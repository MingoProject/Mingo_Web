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
import { FileContent, ResponseMessageDTO } from "@/dtos/MessageDTO";
import { pusherClient } from "@/lib/pusher";
import { getAllChat, MarkMessageAsRead } from "@/lib/services/message.service";
import { useChatItemContext } from "@/context/ChatItemContext";

interface Text {
  id: string;
  text: string;
  contentId: FileContent;
  timestamp: Date;
  createBy: string;
  status: boolean;
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

  const [activeAction, setActiveAction] = useState("");
  const [activeLabel, setActiveLabel] = useState("");

  // Tạo state để lưu `lastMessage` mới nhất
  const [lastMessage, setLastMessage] = useState(itemChat.lastMessage);
  const userId = localStorage.getItem("userId");

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

  const handleNewMessage = async (data: ResponseMessageDTO) => {
    if (data.boxId !== itemChat.id) return;

    try {
      const mark = await MarkMessageAsRead(
        data.boxId,
        userId?.toString() || ""
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, data];

      // Lấy tin nhắn mới nhất
      const latestMessage = updatedMessages.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )[0];

      // Kiểm tra xem userId có trong mảng readedId không
      const userId = localStorage.getItem("userId");
      const isRead =
        latestMessage.readedId.includes(userId?.toString() || "") ||
        data.boxId === itemChat.id;

      const fileContent: FileContent = {
        fileName: "",
        bytes: "",
        format: "",
        height: "",
        publicId: "",
        type: "",
        url: "",
        width: "",
      };

      // Cập nhật `lastMessage` và trạng thái (`status`)
      setLastMessage({
        id: latestMessage.boxId,
        text: latestMessage.text || "",
        contentId: latestMessage.contentId || fileContent,
        createBy: latestMessage.createBy,
        timestamp: new Date(latestMessage.createAt),
        status: isRead, // Cập nhật trạng thái dựa vào `readedId`
      });
      console.log(updatedMessages, "updatedMessages");

      return updatedMessages;
    });

    // Đánh dấu tin nhắn là đã đọc nếu người dùng là receiver
  };

  const handleDeleteMessage = (data: any) => {
    if (data.boxId !== itemChat.id) return;

    setMessages((prevMessages) => {
      // Lọc ra các tin nhắn thuộc box chat hiện tại
      const boxChatMessages = prevMessages.filter(
        (msg) => msg.boxId === itemChat.id
      );

      // Loại bỏ tin nhắn bị xóa
      const updatedMessages = boxChatMessages.filter(
        (chat) => chat.id !== data.id
      );

      // Khởi tạo giá trị mặc định cho fileContent
      const fileContent = {
        fileName: "",
        bytes: "",
        format: "",
        height: "",
        publicId: "",
        type: "",
        url: "",
        width: "",
      };

      // Xử lý cập nhật lastMessage
      if (updatedMessages.length > 0) {
        // Lấy tin nhắn mới nhất từ updatedMessages
        const latestMessage = updatedMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0];

        setLastMessage({
          id: latestMessage.boxId,
          text: latestMessage.text || "",
          contentId: latestMessage.contentId || fileContent,
          createBy: latestMessage.createBy,
          timestamp: new Date(latestMessage.createAt),
          status: false, // Có thể cập nhật trạng thái theo logic
        });
      } else if (boxChatMessages.length > 0) {
        // Nếu không còn tin nhắn trong updatedMessages, lấy từ prevMessages
        const latestMessage = boxChatMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0];

        if (latestMessage) {
          setLastMessage({
            id: latestMessage.boxId,
            text: latestMessage.text || "",
            contentId: latestMessage.contentId || fileContent,
            createBy: latestMessage.createBy,
            timestamp: new Date(latestMessage.createAt),
            status: true,
          });
        }
      } else {
        // Nếu không còn tin nhắn nào
        setLastMessage({
          id: itemChat.id,
          text: "",
          contentId: fileContent,
          createBy: "",
          timestamp: new Date(),
          status: true,
        });
      }

      return prevMessages
        .filter((msg) => msg.boxId !== itemChat.id)
        .concat(updatedMessages);
    });
  };

  const handleRevokeMessage = (data: any) => {
    if (data.boxId !== itemChat.id) return;

    setMessages((prevMessages) => {
      // Filter out the deleted message
      const updatedMessages = prevMessages.filter(
        (chat) => chat.id !== data.id
      );
      const fileContent: FileContent = {
        fileName: "",
        bytes: "",
        format: "",
        height: "",
        publicId: "",
        type: "Đã thu hồi tin nhắn",
        url: "",
        width: "",
      };

      // Cập nhật `lastMessage` và trạng thái (`status`)

      // If the deleted message was the last one, update the lastMessage
      if (updatedMessages.length >= 0) {
        const latestMessage = updatedMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0]; // Get the latest message from the updated list

        // Update the `lastMessage` state with the new last message
        setLastMessage({
          id: latestMessage.boxId,
          text: latestMessage.text || "Đã thu hồi tin nhắn",
          contentId: latestMessage.contentId || fileContent,
          createBy: latestMessage.createBy,
          timestamp: new Date(latestMessage.createAt),
          status: true, // Cập nhật trạng thái dựa vào `readedId`
        });
      } else {
        // If no messages left after deletion, clear the lastMessage
        setLastMessage({
          id: "",
          text: "Đã thu hồi tin nhắn",
          contentId: fileContent,
          createBy: "",
          timestamp: new Date(),
          status: true,
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
    //const pusherChannel = `private-${itemChat.id}`;
    //pusherClient.subscribe(pusherChannel);
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("delete-message", handleDeleteMessage);
    pusherClient.bind("revoke-message", handleRevokeMessage);

    // Dọn dẹp khi component bị unmount
    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unbind("delete-message", handleDeleteMessage);
      pusherClient.unbind("revoke-message", handleRevokeMessage);
    };
  }, [itemChat.id, setMessages]);

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

  const handleAction = (action: string, label: string) => {
    setActiveAction(action);
    setActiveLabel(label);
  };

  const closeAction = () => {
    setActiveAction("");
    setActiveLabel("");
  };

  const isReceiver = lastMessage.createBy !== userId;

  console.log(lastMessage, "this is last mes");
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
              <span className={`truncate text-sm font-medium`}>
                {lastMessage.text === "Bắt đầu đoạn chat" ? (
                  <p
                    className={lastMessage.status ? "font-normal" : "font-bold"}
                  >
                    {lastMessage.text}
                  </p>
                ) : isReceiver ? (
                  <div className="flex gap-1 text-sm">
                    <p
                      className={`${lastMessage.status ? "font-normal" : "font-bold"}`}
                    >
                      {itemChat.userName.trim().split(" ").pop()}:{" "}
                    </p>
                    {(() => {
                      const type =
                        lastMessage.contentId?.type?.toLowerCase() || "";
                      const messageStatusClass = lastMessage.status
                        ? "font-normal"
                        : "font-bold";

                      if (lastMessage.text !== "") {
                        return (
                          <p className={messageStatusClass}>
                            {lastMessage.text}
                          </p>
                        );
                      }

                      switch (type) {
                        case "image":
                          return (
                            <p className={messageStatusClass}>đã gửi 1 ảnh</p>
                          );
                        case "video":
                          return (
                            <p className={messageStatusClass}>đã gửi 1 video</p>
                          );
                        case "audio":
                          return (
                            <p className={messageStatusClass}>
                              đã gửi 1 âm thanh
                            </p>
                          );
                        case "other":
                          return (
                            <p className={messageStatusClass}>đã gửi 1 file</p>
                          );
                        default:
                          return <p className={messageStatusClass}></p>;
                      }
                    })()}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <p className="font-normal">Bạn: </p>
                    {(() => {
                      const type =
                        lastMessage.contentId?.type?.toLowerCase() || "";
                      const messageStatusClass = lastMessage.status
                        ? "font-normal"
                        : "font-normal";

                      if (lastMessage.text !== "") {
                        return (
                          <p className={messageStatusClass}>
                            {lastMessage.text}
                          </p>
                        );
                      }

                      switch (type) {
                        case "image":
                          return (
                            <p className={messageStatusClass}>Gửi 1 ảnh</p>
                          );
                        case "video":
                          return (
                            <p className={messageStatusClass}>Gửi 1 video</p>
                          );
                        case "audio":
                          return (
                            <p className={messageStatusClass}>
                              đã gửi 1 âm thanh
                            </p>
                          );
                        case "other":
                          return (
                            <p className={messageStatusClass}>Gửi 1 file</p>
                          );
                        default:
                          return (
                            <p className={messageStatusClass}>
                              Bắt đầu đoạn chat
                            </p>
                          );
                      }
                    })()}
                  </div>
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
