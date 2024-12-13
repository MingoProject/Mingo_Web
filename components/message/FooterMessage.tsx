import { useChatContext } from "@/context/ChatContext";
import { useChatItemContext } from "@/context/ChatItemContext";
import { FileContent, ItemChat, ResponseMessageDTO } from "@/dtos/MessageDTO";
import { FindUserDTO } from "@/dtos/UserDTO";
import { pusherClient } from "@/lib/pusher";
import { MarkMessageAsRead, sendMessage } from "@/lib/services/message.service";
import { checkRelation } from "@/lib/services/relation.service";
import { getFileFormat } from "@/lib/utils";
import {
  faMicrophone,
  faFaceSmile,
  faImage,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  // const [relation, setRelation] = useState<string>("");
  const { allChat, setAllChat } = useChatItemContext();

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
    handleMarkAsRead();
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

        await sendMessage(formData);
      }
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const mark = await MarkMessageAsRead(
        id.toString(),
        userId?.toString() || ""
      );
      console.log(mark, "this is mark");
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("boxId is missing or invalid");
      return;
    }

    const handleNewMessage = (data: ResponseMessageDTO) => {
      console.log("Successfully received message: ", data);
      if (id !== data.boxId) return; // Kiểm tra đúng kênh
      console.log(data.boxId);
      setMessages((prevMessages) => {
        return [...prevMessages, data]; // Thêm tin nhắn mới vào mảng
      });
    };

    pusherClient.subscribe(`private-${id}`);
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("pusher:subscription_error", (error: any) => {
      console.log("Subscription error:", error);
    });
    // Cleanup function to unsubscribe and unbind when component unmounts or boxId changes
    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      console.log(`Unsubscribed from private-${id} channel`);
    };
  }, []); // Re-run if boxId or setMessages changes

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!item) {
    return <div></div>;
  }

  return (
    // Giao diện footer thông thường
    <div className="sticky bottom-0 w-full bg-white px-6 py-2 flex items-center gap-4">
      <div className="flex gap-2 px-4 items-center w-full border border-border-color rounded-3xl h-12 bg-gray-100">
        <div className="flex-1" onClick={handleMarkAsRead}>
          <input
            type="text"
            placeholder="Aa"
            className="w-full border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:ring-0"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            onFocus={handleMarkAsRead}
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
      <div
        className="bg-primary-100 flex items-center justify-center rounded-full w-10 h-10 p-2 cursor-pointer hover:bg-primary-200"
        onClick={handleSendTextMessage}
      >
        <FontAwesomeIcon icon={faPaperPlane} size="lg" className="text-white" />
      </div>
    </div>
  );
};

export default FooterMessage;
