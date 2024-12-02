import { useChatContext } from "@/context/ChatContext";
import { FileContent, ResponseMessageDTO } from "@/dtos/MessageDTO";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/lib/services/message.service";
import { getFileFormat } from "@/lib/utils";
import {
  faMicrophone,
  faFaceSmile,
  faImage,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

const FooterMessage = ({ boxId }: { boxId: string }) => {
  const [value, setValue] = useState("");
  const { messages, setMessages } = useChatContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [temporaryToCloudinaryMap, setTemporaryToCloudinaryMap] = useState<
    { tempUrl: string; cloudinaryUrl: string }[]
  >([]);

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

  const handleSendTextMessage = async () => {
    // Tạo đối tượng SegmentMessageDTO
    const messageData = {
      boxId: boxId,
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
    formData.append("boxId", messageData.boxId);
    formData.append("content", JSON.stringify(messageData.content)); // Directly append the string

    console.log(formData);
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
    if (!files.length || !boxId) return;

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
        console.log(file);
        formData.append("boxId", boxId);
        formData.append("content", JSON.stringify(fileContent));
        formData.append("file", file);

        // await axios.post(`${process.env.BASE_URL}message/send`, formData, {
        //   headers: {
        //     Authorization: storedToken,
        //   },
        // });

        await sendMessage(formData);
      }
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };

  useEffect(() => {
    console.log(`private-${boxId}`, "Attempting to subscribe to the channel");

    // Ensure boxId is not undefined or null
    if (!boxId) {
      console.error("boxId is missing or invalid");
      return;
    }

    const handleNewMessage = (data: ResponseMessageDTO) => {
      console.log("Successfully received message: ", data);

      setMessages((prevMessages) => {
        const currentMessages = prevMessages || [];
        return [...currentMessages, data]; // Add new message to the list
      });
    };
    console.log("Updated messages:", messages); // Kiểm tra giá trị mới của messages

    // Ensure Pusher client is initialized and subscribed
    console.log(`Đang đăng ký kênh private-${boxId}`);
    pusherClient.subscribe(`private-${boxId}`);
    console.log(`Đã đăng ký thành công kênh private-${boxId}`);

    // Bind the new-message event
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("pusher:subscription_error", (error: any) => {
      console.log("Subscription error:", error);
    });
    // Cleanup function to unsubscribe and unbind when component unmounts or boxId changes
    return () => {
      pusherClient.unsubscribe(`private-${boxId}`);
      pusherClient.unbind("new-message", handleNewMessage);
      console.log(`Unsubscribed from private-${boxId} channel`);
    };
  }, [boxId, setMessages]); // Re-run if boxId or setMessages changes

  useEffect(() => {
    console.log("Updated messages:", messages); // Kiểm tra giá trị mới của messages
  }, [messages]); // Mỗi khi messages thay đổi, effect này sẽ được gọi

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
        <div className="flex gap-3">
          <FontAwesomeIcon
            icon={faMicrophone}
            size="lg"
            className="text-primary-100 cursor-pointer hover:text-primary-200"
          />
          <FontAwesomeIcon
            icon={faFaceSmile}
            size="lg"
            className="text-primary-100 cursor-pointer hover:text-primary-200"
          />
          <label htmlFor="image-upload">
            <FontAwesomeIcon
              icon={faImage}
              size="lg"
              className="text-primary-100 cursor-pointer hover:text-primary-200"
              onClick={handleIconClick}
            />
          </label>
          {/* Input ẩn để chọn ảnh */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple
            onChange={(e) => {
              if (e.target.files) {
                handleSendMultipleFiles(Array.from(e.target.files));
              }
            }}
          />
        </div>
      </div>
      <div className="bg-primary-100 flex items-center justify-center rounded-full w-10 h-10 p-2 cursor-pointer hover:bg-primary-200">
        <FontAwesomeIcon
          icon={faPaperPlane}
          size="lg"
          className="text-white"
          onClick={handleSendTextMessage}
        />
      </div>
    </div>
  );
};

export default FooterMessage;
