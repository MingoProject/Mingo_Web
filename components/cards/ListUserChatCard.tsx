"use client";
import React, { useEffect, useRef, useState } from "react";
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
import {
  FileContent,
  PusherDelete,
  PusherRevoke,
  ResponseGroupMessageDTO,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import { pusherClient } from "@/lib/pusher";
import {
  getAllChat,
  getGroupAllChat,
  IsOnline,
  MarkMessageAsRead,
} from "@/lib/services/message.service";
import { useChatItemContext } from "@/context/ChatItemContext";
import data from "@iconify/icons-mi/sort";
import { getMyProfile } from "@/lib/services/user.service";

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
  groupName: string;
  avatarUrl: string;
  status: string;
  lastMessage: Text;
  isRead: boolean;
  receiverId: string | undefined;
  senderId: string | undefined;
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
  const { id } = useParams();
  const [isRead, setIsRead] = useState(false);
  // const { isOnlineChat } = useChatContext();
  const { isOnlineChat, setIsOnlineChat } = useChatContext();

  const markMessagesAsRead = async (chatId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      await MarkMessageAsRead(chatId.toString(), userId?.toString() || "");
      setIsRead(true);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const myChat = async () => {
    try {
      const data = await getGroupAllChat(itemChat.id.toString()); // Gọi API

      if (data.success) {
        setMessages(data.messages); // Lưu trực tiếp `messages` từ API
        if (data.messages.length > 0) {
          // Cập nhật `lastMessage`
          const latestMessage = data.messages.sort(
            (a, b) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
          )[0];

          setLastMessage({
            id: latestMessage.boxId,
            text: latestMessage.text || "",
            contentId: latestMessage.contentId || null,
            createBy: latestMessage.createBy,
            timestamp: new Date(latestMessage.createAt),
            status: false,
          });
        } else {
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
          // Nếu không có tin nhắn, đặt giá trị mặc định cho `lastMessage`
          setLastMessage({
            id: itemChat.id,
            text: "",
            contentId: fileContent,
            createBy: "",
            timestamp: new Date(),
            status: true,
          });
        }
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const handleNewMessage = async (data: ResponseGroupMessageDTO) => {
    if (data.boxId !== itemChat.id) return;

    try {
      if (data.boxId === id) {
      }
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

      const isReadNow = updatedMessages.some(
        (msg) =>
          msg.readedId.includes(userId?.toString() || "") || data.boxId === id
      );

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
        status: isReadNow, // Cập nhật trạng thái dựa vào `readedId`
      });

      // console.log(isRead, "updatedMessages");
      if (data.boxId === id) {
        markMessagesAsRead(data.boxId); // Gọi API đánh dấu tin nhắn đã đọc
      }
      return updatedMessages;
    });

    // Đánh dấu tin nhắn là đã đọc nếu người dùng là receiver
  };

  const handleDeleteMessage = (data: PusherDelete) => {
    // Kiểm tra nếu không phải tin nhắn trong box hiện tại
    if (data.boxId !== itemChat.id) return;

    const currentUserId = localStorage.getItem("userId");

    setMessages((prevMessages) => {
      // Lọc tin nhắn trong box chat hiện tại
      const boxChatMessages = prevMessages.filter(
        (msg) => msg.boxId === itemChat.id
      );

      console.log("Box chat messages before delete: ", boxChatMessages);

      // Nếu `visibility` là `false`, xử lý tin nhắn bị xóa
      if (!data.visibility) {
        // Lọc các tin nhắn còn lại sau khi xóa tin nhắn bị thu hồi
        const updatedMessages = boxChatMessages.filter(
          (msg) => msg.id !== data.id
        );

        console.log("Updated messages after delete: ", updatedMessages);

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

        // Chỉ cập nhật `lastMessage` cho người xóa
        if (data.createBy === currentUserId) {
          let latestMessage;

          if (updatedMessages.length > 0) {
            // Lấy tin nhắn mới nhất từ `updatedMessages`
            latestMessage = updatedMessages.sort(
              (a, b) =>
                new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
            )[0];
          } else {
            // Nếu không còn tin nhắn, gọi API để lấy lại danh sách tin nhắn
            myChat();
            return prevMessages; // Tạm thời trả về danh sách hiện tại
          }

          if (latestMessage) {
            console.log("Last message after deletion: ", latestMessage);

            setLastMessage({
              id: latestMessage.boxId,
              text: latestMessage.text || "",
              contentId: latestMessage.contentId || fileContent,
              createBy: latestMessage.createBy,
              timestamp: new Date(latestMessage.createAt),
              status: false, // Tùy chỉnh logic trạng thái nếu cần
            });
          } else {
            // Không còn tin nhắn nào, đặt giá trị mặc định cho `lastMessage`
            setLastMessage({
              id: itemChat.id,
              text: "",
              contentId: fileContent,
              createBy: "",
              timestamp: new Date(),
              status: true,
            });
          }
        }

        // Trả về danh sách đã cập nhật (xóa tin nhắn bị thu hồi)
        return prevMessages.filter((msg) => msg.id !== data.id);
      }

      // Nếu `visibility` không phải `false`, giữ nguyên danh sách
      return prevMessages;
    });
  };

  const handleRevokeMessage = (data: any) => {
    if (data.boxId !== itemChat.id) return;

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((chat) => {
        // Nếu là tin nhắn bị thu hồi, cập nhật nội dung
        if (chat.id === data.id) {
          return {
            ...chat,
            text: "Đã thu hồi", // Hoặc nội dung tùy chỉnh
            type: "recalled", // Có thể thêm type để phân loại tin nhắn đã thu hồi
          };
        }
        return chat;
      });

      const fileContent: FileContent = {
        fileName: "",
        bytes: "",
        format: "",
        height: "",
        publicId: "",
        type: "Đã thu hồi",
        url: "",
        width: "",
      };

      // Cập nhật `lastMessage` và trạng thái (`status`)
      if (updatedMessages.length > 0) {
        const latestMessage = updatedMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0];

        setLastMessage({
          id: latestMessage.boxId,
          text: latestMessage.text,
          contentId: latestMessage.contentId || fileContent,
          createBy: latestMessage.createBy,
          timestamp: new Date(latestMessage.createAt),
          status: true,
        });
      } else {
        setLastMessage({
          id: "",
          text: "Đã thu hồi",
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

    if (id === itemChat.id) {
      markMessagesAsRead(id); // Đánh dấu tất cả tin nhắn là đã đọc
    }
    // const pusherChannel = `private-${itemChat.id}`;
    // pusherClient.subscribe(pusherChannel);
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("delete-message", handleDeleteMessage);
    pusherClient.bind("revoke-message", handleRevokeMessage);

    // Dọn dẹp khi component bị unmount
    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unbind("delete-message", handleDeleteMessage);
      pusherClient.unbind("revoke-message", handleRevokeMessage);
    };
  }, [setMessages, id]);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (itemChat) {
          const data = await getMyProfile(
            itemChat?.receiverId?.toString() || ""
          );
          setIsOnlineChat((prevState) => ({
            ...prevState,
            [itemChat?.receiverId?.toString() || ""]: data.userProfile.status,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [itemChat, itemChat?.receiverId]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="text-dark100_light500 flex w-full items-center justify-between px-4 py-2 hover:bg-primary-100/20 hover:rounded-lg">
          <div className="flex w-full items-center gap-3">
            <div className="relative w-[45px] h-[45px]">
              <Image
                src={itemChat.avatarUrl || "/assets/images/default-user.png"}
                alt="Avatar"
                width={45}
                height={45}
                className="rounded-full object-cover"
                style={{ objectFit: "cover", width: "45px", height: "45px" }}
              />
              {isOnlineChat[itemChat.receiverId || ""] && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
              )}
            </div>
            <div className="hidden w-[55%] gap-1 text-xs md:flex md:flex-col">
              <span className="text-base font-semibold whitespace-nowrap overflow-hidden truncate">
                {itemChat.groupName}
              </span>
              <span className={`truncate text-sm font-medium`}>
                {lastMessage.text === "Bắt đầu đoạn chat" ? (
                  <p className={isRead ? "font-normal" : "font-bold"}>
                    {lastMessage.text}
                  </p>
                ) : isReceiver ? (
                  <div className="flex gap-1 text-sm">
                    <p className={`${isRead ? "font-normal" : "font-bold"}`}>
                      {itemChat.userName.trim().split(" ").pop()}:{" "}
                    </p>
                    {(() => {
                      const type =
                        lastMessage.contentId?.type?.toLowerCase() || "";
                      const messageStatusClass = isRead
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
                      const messageStatusClass = isRead
                        ? "font-normal"
                        : "font-normal";

                      if (lastMessage.text !== "") {
                        return (
                          <p className={messageStatusClass}>
                            {lastMessage.text}
                          </p>
                        );
                      }

                      if (type !== "") {
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
