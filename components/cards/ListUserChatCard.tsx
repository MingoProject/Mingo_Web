"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Icon } from "@iconify/react";
import Format from "./FormatCard";
import { useChatContext } from "@/context/ChatContext";
import { useParams } from "next/navigation";
import { ResponseMessageDTO } from "@/dtos/MessageDTO";
import { pusherClient } from "@/lib/pusher";
import { getAllChat } from "@/lib/services/message.service";

interface Text {
  id: string;
  text: string;
  timestamp: Date;
  createBy: string;
}

interface ItemChat {
  id: string;
  userName: string;
  avatarUrl: string;
  status: string;
  lastMessage: Text;
  isRead: boolean;
}

export function getDisplayName(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length > 1 ? parts[parts.length - 1] : name;
}

const ListUserChatCard = ({ itemChat }: { itemChat: ItemChat }) => {
  const { messages, setMessages } = useChatContext();
  // Tạo state để lưu `lastMessage` mới nhất
  const [lastMessage, setLastMessage] = useState(itemChat.lastMessage);

  const myChat = async () => {
    try {
      const data = await getAllChat(itemChat.id.toString()); // Gọi API
      if (data.success) {
        setMessages(data.messages); // Lưu trực tiếp `messages` từ API
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const handleNewMessage = (data: ResponseMessageDTO) => {
    console.log("Successfully received message: ", data);
    if (data.boxId !== itemChat.id) return;

    // Cập nhật mảng tin nhắn
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, data];

      // Lấy tin nhắn mới nhất
      const latestMessage = updatedMessages.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )[0];

      // Cập nhật `lastMessage`
      setLastMessage({
        id: latestMessage.boxId, // Include the 'id' from latestMessage
        text: latestMessage.text
          ? latestMessage.text // Lấy phần tử đầu tiên nếu có text
          : latestMessage.contentId
            ? "" // Nếu không có text, kiểm tra tệp
            : "",
        createBy: latestMessage.createBy,
        timestamp: new Date(latestMessage.createAt),
      });

      return updatedMessages;
    });
  };

  const handleDeleteMessage = (data: any) => {
    if (data.boxId !== itemChat.id) return;

    console.log(messages, "this is premessage");
    setMessages((prevMessages) => {
      // Filter out the deleted message
      const updatedMessages = prevMessages.filter(
        (chat) => chat.id !== data.id
      );

      console.log(updatedMessages, "Day la thang updateMessage");

      // If the deleted message was the last one, update the lastMessage
      if (updatedMessages.length >= 0) {
        const latestMessage = updatedMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0]; // Get the latest message from the updated list

        // Update the `lastMessage` state with the new last message
        setLastMessage({
          id: latestMessage.boxId, // Include the 'id' from latestMessage
          text: latestMessage.text
            ? latestMessage.text
            : latestMessage.contentId
              ? "" // If no text, check for file
              : "",
          createBy: latestMessage.createBy,
          timestamp: new Date(latestMessage.createAt),
        });
      } else {
        // If no messages left after deletion, clear the lastMessage
        setLastMessage({
          id: "",
          text: "",
          createBy: "",
          timestamp: new Date(),
        });
      }

      return updatedMessages;
    });
  };

  useEffect(() => {
    if (!itemChat.id) {
      console.error("ID is missing or invalid");
      return;
    }
    myChat();
    const pusherChannel = `private-${itemChat.id}`;
    pusherClient.subscribe(pusherChannel);
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("delete-message", handleDeleteMessage);

    // Dọn dẹp khi component bị unmount
    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unbind("delete-message", handleDeleteMessage);
      pusherClient.unsubscribe(pusherChannel);
    };
  }, []);

  function timeSinceMessage(timestamp: Date | string) {
    const now = new Date();
    const messageTimestamp = new Date(timestamp);
    const diffInMs = now.getTime() - messageTimestamp.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} ngày`;
    if (diffInHours > 0) return `${diffInHours} giờ`;
    if (diffInMinutes > 0) return `${diffInMinutes} phút`;
    return `${diffInSeconds} giây`;
  }

  const [activeAction, setActiveAction] = useState("");
  const [activeLabel, setActiveLabel] = useState("");

  const handleAction = (action: string, label: string) => {
    setActiveAction(action);
    setActiveLabel(label);
  };

  const closeAction = () => {
    setActiveAction("");
    setActiveLabel("");
  };

  // Lấy ID người đăng nhập (giả sử lưu trữ trong localStorage)
  const userId = localStorage.getItem("userId");

  // Kiểm tra nếu receiverId là người nhận, không phải người gửi (userId)
  const isReceiver = lastMessage.createBy !== userId;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="text-dark100_light500 flex w-full items-center justify-between px-4 py-2 hover:bg-primary-100/20 hover:rounded-lg">
          <div className="flex w-full items-center gap-3">
            <div className="relative w-[45px] h-[45px]">
              <Image
                src={itemChat.avatarUrl || "/assets/images/capy.jpg"}
                alt="Avatar"
                width={45}
                height={45}
                className="rounded-full object-cover"
                style={{ objectFit: "cover", width: "45px", height: "45px" }}
              />
              {itemChat.status && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
              )}
            </div>
            <div className="hidden w-[55%] gap-1 text-xs md:flex md:flex-col">
              <span className="text-base font-semibold whitespace-nowrap overflow-hidden truncate">
                {itemChat.userName}
              </span>
              <span
                className={`truncate text-sm font-medium ${itemChat.isRead ? "font-normal" : "font-bold"}`}
              >
                {isReceiver && lastMessage.id === itemChat.id ? (
                  <>
                    {itemChat.userName.trim().split(" ").pop()}:{" "}
                    {lastMessage.text.trim() !== ""
                      ? lastMessage.text
                      : "Đã gửi 1 file"}
                  </>
                ) : (
                  <>
                    Bạn:{" "}
                    {lastMessage.text.trim() !== ""
                      ? lastMessage.text
                      : "Đã gửi 1 file"}
                  </>
                )}
              </span>
            </div>
            <span className="mt-8 items-center hidden whitespace-nowrap px-1 text-[11px] text-gray-500 md:block">
              {timeSinceMessage(lastMessage.timestamp)}
            </span>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="text-dark100_light500 bg-gray-50 dark:bg-neutral-800">
        {[
          {
            icon: "system-uicons:picture",
            label: "Lưu đoạn chat",
            action: "lưu đoạn chat",
          },
          {
            icon: "material-symbols:delete-outline",
            label: "Xóa đoạn chat",
            action: "xóa đoạn chat",
          },
          {
            icon: "ion:notifications-off-outline",
            label: "Tắt thông báo",
            action: "tắt thông báo đoạn chat",
          },
          {
            icon: "material-symbols:report-outline",
            label: "Báo cáo",
            action: "báo cáo",
          },
          {
            icon: "material-symbols:block",
            label: "Chặn",
            action: "chặn đoạn chat",
          },
        ].map(({ icon, label, action }) => (
          <ContextMenuItem
            key={action}
            onClick={() => handleAction(action, label)}
            className="gap-1 hover:bg-primary-100 hover:bg-opacity-90 hover:text-white"
          >
            <div className="group flex size-full items-center gap-1 hover:text-white">
              <Icon
                icon={icon}
                width={14}
                height={14}
                className="text-gray-500 group-hover:text-white dark:text-white"
              />
              <p className="text-ellipsis whitespace-nowrap font-sans text-xs group-hover:text-white">
                {label}
              </p>
            </div>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
      {activeAction && (
        <Format
          onClose={closeAction}
          content={`${activeAction} với`}
          label={activeLabel}
          userName={itemChat.userName}
        />
      )}
    </ContextMenu>
  );
};

export default ListUserChatCard;
