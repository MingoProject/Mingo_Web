import { useChatContext } from "@/context/ChatContext";
import {
  FileContent,
  ItemChat,
  ResponseGroupMessageDTO,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import { pusherClient } from "@/lib/pusher";
import { MarkMessageAsRead, sendMessage } from "@/lib/services/message.service";
import { checkRelation } from "@/lib/services/relation.service";
import { getFileFormat } from "@/lib/utils";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const FooterMessage = ({ item }: { item: ItemChat | null }) => {
  const [value, setValue] = useState("");
  const { messages, setMessages } = useChatContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [temporaryToCloudinaryMap, setTemporaryToCloudinaryMap] = useState<
    { tempUrl: string; cloudinaryUrl: string }[]
  >([]);
  const { id } = useParams(); // Lấy ID từ URL
  const [isRecording, setIsRecording] = useState(false); // Để theo dõi trạng thái ghi âm
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // URL của file audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Để lưu MediaRecorder instance
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [currentContentType, setCurrentContentType] = useState<
    "text" | "voice" | "file" | null
  >(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (temporaryToCloudinaryMap.length === 0) return;

    setMessages((prev: any) =>
      prev.map((msg: any) => {
        const mapEntry = temporaryToCloudinaryMap.find(
          (entry) => msg.contentId[0].url === entry.tempUrl
        );
        return mapEntry
          ? {
              ...msg,
              contentId: [{ ...msg.contentId[0], url: mapEntry.cloudinaryUrl }],
            }
          : msg;
      })
    );

    // Sau khi cập nhật xong, loại bỏ các URL đã xử lý
    setTemporaryToCloudinaryMap([]);
  }, [temporaryToCloudinaryMap]);

  const resetContent = () => {
    setValue("");
    setAudioBlob(null);
    setSelectedFiles([]);
    setCurrentContentType(null);
  };

  const handleSend = async () => {
    switch (currentContentType) {
      case "text":
        await handleSendTextMessage();
        break;
      case "voice":
        await handleSendVoiceMessage();
        break;
      case "file":
        await handleSendMultipleFiles(selectedFiles);
        break;
      default:
        console.log("No content to send");
    }
    // Reset trạng thái sau khi gửi
    resetContent();
  };

  const handleMarkAsRead = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const mark = await MarkMessageAsRead(
        id?.toString() || "",
        userId?.toString() || ""
      );
      console.log(mark, "this is mark");
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setCurrentContentType("voice");
    console.log("Recording started...");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl); // Lưu URL của file audio
        };

        mediaRecorder.start();
        setIsRecording(true); // Đánh dấu trạng thái ghi âm
      })
      .catch((err) => {
        console.error("Error accessing audio: ", err);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Giả lập audioBlob (thay bằng logic thực)
    const mockBlob = new Blob(["audio data"], { type: "audio/wav" });
    setAudioBlob(mockBlob);
    console.log(mockBlob, "Blob created from recording");
    console.log("Recording stopped");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false); // Đánh dấu ghi âm đã dừng
    }
  };

  const handleSendVoiceMessage = async () => {
    if (!audioBlob) return;
    console.log("Sending voice message:", audioBlob);
    if (!audioUrl || !id) return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    console.log(audioBlob, "Blob created from recording");
    try {
      const formData = new FormData();
      formData.append("boxId", id.toString());

      // Đọc file từ audio URL và gửi lên server
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const fileContent: FileContent = {
        fileName: "voice-message.wav",
        url: "",
        publicId: "", // Cloudinary Public ID
        bytes: audioBlob.size.toString(),
        width: "0",
        height: "0",
        format: "wav",
        type: "audio",
      };

      formData.append("content", JSON.stringify(fileContent));
      formData.append("file", audioBlob, "voice-message.wav");
      console.log(formData, "formData created from recording");

      const messageResponse = await sendMessage(formData);
      console.log("Voice message sent successfully:", messageResponse);
    } catch (error) {
      console.error("Error sending voice message: ", error);
    }
  };

  const handleSendTextMessage = async () => {
    if (!value.trim()) return;
    console.log("Sending text message:", value);
    handleMarkAsRead();
    // Tạo đối tượng SegmentMessageDTO
    const messageData = {
      boxId: id.toString(),
      content: value, // content is now a string
    };

    if (!messageData.boxId) {
      console.error("Missing required fields in message data");
      return;
    }

    // Reset input value
    setValue("");

    // Gửi request đến API để gửi tin nhắn với file đã chọn
    if (value === "") {
      console.log("Missing value");
      return;
    }

    const formData = new FormData();
    formData.append("boxId", messageData.boxId.toString());
    formData.append("content", JSON.stringify(messageData.content)); // Directly append the string

    // Gửi API
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;

      const response = await sendMessage(formData);
      console.log("Message sent successfully:", response);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleSendMultipleFiles = async (files: File[]) => {
    if (!files.length || !id) return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      // Gửi từng file lên server
      for (const file of files) {
        const fileContent: FileContent = {
          fileName: file.name,
          url: "",
          publicId: "", // Cloudinary Public ID
          bytes: file.size.toString(),
          width: "0",
          height: "0",
          format: getFileFormat(file.type, file.name),
          type: file.type.split("/")[0],
        };

        const formData = new FormData();
        formData.append("boxId", id.toString());
        formData.append("content", JSON.stringify(fileContent));
        formData.append("file", file);

        console.log(fileContent, "file");
        console.log(file, "file");

        await sendMessage(formData);
      }
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("boxId is missing or invalid");
      return;
    }

    const handleNewMessage = (data: ResponseGroupMessageDTO) => {
      console.log("Successfully received message: ", data);
      if (id !== data.boxId) return; // Kiểm tra đúng kênh
      setMessages((prevMessages) => {
        return [...prevMessages, data]; // Thêm tin nhắn mới vào mảng
      });
    };

    console.log(`Đang đăng ký kênh private-${id}`);
    pusherClient.subscribe(`private-${id}`);
    console.log(`Đã đăng ký thành công kênh private-${id}`);

    // Bind the new-message event
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("pusher:subscription_error", (error: any) => {
      console.log("Subscription error:", error);
    });
    // Cleanup function to unsubscribe and unbind when component unmounts or boxId changes
    return () => {
      pusherClient.unsubscribe(`private-${id}`);
      pusherClient.unbind("new-message", handleNewMessage);
      console.log(`Unsubscribed from private-${id} channel`);
    };
  }, [id, setMessages]); // Re-run if boxId or setMessages changes

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log(files, "fileObject");
      setSelectedFiles(files);
      setCurrentContentType("file");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setCurrentContentType("text");
      handleSendTextMessage();
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-white px-6 py-2 flex items-center gap-4">
      <div className="flex gap-2 px-4 items-center w-full border border-border-color rounded-3xl h-12 bg-gray-100">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Aa"
            className="w-full border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:ring-0"
            onChange={(e) => {
              setValue(e.target.value); // Cập nhật giá trị
              setCurrentContentType("text"); // Đặt loại nội dung
            }}
            value={value}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-3">
          <Icon
            icon={
              isRecording
                ? "material-symbols:settings-voice"
                : "material-symbols:keyboard-voice"
            }
            className="text-primary-100 cursor-pointer hover:text-primary-200 text-[24px]"
            onClick={isRecording ? stopRecording : startRecording}
          />

          <Icon
            icon={"carbon:face-satisfied-filled"}
            className="text-primary-100 cursor-pointer hover:text-primary-200 text-[24px]"
          />

          <label htmlFor="image-upload">
            <Icon
              icon={"material-symbols:image"}
              className="text-primary-100 cursor-pointer hover:text-primary-200 text-[24px]"
              onClick={handleIconClick}
            />
          </label>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div
        className="bg-primary-100 flex items-center justify-center rounded-full w-10 h-10 p-2 cursor-pointer hover:bg-primary-200"
        onClick={handleSend}
      >
        <FontAwesomeIcon icon={faPaperPlane} size="lg" className="text-white" />
      </div>
    </div>
  );
};

export default FooterMessage;
