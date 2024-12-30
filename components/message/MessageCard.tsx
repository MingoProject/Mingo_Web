"use client";

import {
  ItemChat,
  PusherRevoke,
  ResponseGroupMessageDTO,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import { format, isSameDay } from "date-fns";
import Image from "next/image";
import React, { useEffect } from "react";
import ChatActions from "./ChatActions";
import { useParams } from "next/navigation";
import { useChatContext } from "@/context/ChatContext";
import { pusherClient } from "@/lib/pusher";
import { removeMessage, revokeMessage } from "@/lib/services/message.service";
import { useChatItemContext } from "@/context/ChatItemContext";
import FileViewer from "./FileViewer";

const MessageCard = ({
  chat,
  previousChat,
  item,
}: {
  chat: ResponseGroupMessageDTO;
  previousChat?: ResponseGroupMessageDTO;
  item?: ItemChat | null;
}) => {
  const isSender = chat.createBy === localStorage.getItem("userId");
  const { id }: any = useParams();
  const { messages, setMessages } = useChatContext();
  const { allChat, setAllChat } = useChatItemContext();

  const isNewDay =
    !previousChat ||
    !isSameDay(new Date(chat.createAt), new Date(previousChat.createAt));

  const hasFiles = chat.contentId && chat.contentId.url ? true : false;
  const hasText = chat.text && chat.text.length > 0 ? true : false;

  const handleDelete = async (messageId: string) => {
    try {
      await removeMessage(messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    } catch (error) {
      alert("Xóa chat thất bại. Vui lòng thử lại.");
    }
  };

  const handleRevoke = async (messageId: string) => {
    // Cập nhật giao diện trước để tạo phản hồi nhanh cho người dùng
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, flag: false } : msg
      )
    );

    try {
      // Gửi yêu cầu lên server để cập nhật trạng thái thu hồi
      await revokeMessage(messageId);
    } catch (error) {
      alert("Khôi phục thất bại. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    const handleRevokeMessage = ({ id: messageId }: PusherRevoke) => {
      // console.log("Successfully revoked message: ", messageId);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, flag: false } : msg
        )
      );
    };

    const channels: any[] = allChat.map((chat) => {
      const channel = pusherClient.subscribe(`private-${chat.id.toString()}`);
      // channel.bind("delete-message", handleDeleteMessage);
      channel.bind("revoke-message", handleRevokeMessage);
      return channel;
    });

    //   // Hủy đăng ký khi component unmount hoặc khi allChat thay đổi
    return () => {
      channels.forEach((channel: any) => {
        // channel.bind("delete-message", handleDeleteMessage);
        channel.bind("revoke-message", handleRevokeMessage);
      });
    };
  }, [id, setMessages]);

  return (
    <>
      {isNewDay && (
        <div className="my-4 text-center text-sm text-gray-500">
          {format(new Date(chat.createAt), "dd/MM/yyyy")}
        </div>
      )}
      <div
        className={`flex flex-col ${isSender ? "items-end" : "items-start"} mb-4`}
      >
        {!isSender && item?.groupName !== chat.createName && (
          <p className="text-[8px] ml-[55px]">{chat.createName}</p>
        )}
        <div className="flex">
          {isSender && !hasFiles && (
            <>
              <div className="w-fit self-center">
                <ChatActions
                  onDelete={() => handleDelete(chat.id)}
                  onRevoke={() => handleRevoke(chat.id)}
                />
              </div>
            </>
          )}
          <div className="flex items-start gap-2">
            {!isSender && (
              <div className="w-[45px] h-[45px]">
                <Image
                  src={chat.createAvatar || "/assets/images/default-user.png"}
                  alt="Avatar"
                  width={45}
                  height={45}
                  className="rounded-full object-cover"
                  style={{ objectFit: "cover", width: "45px", height: "45px" }}
                />
              </div>
            )}
            <div
              className={`max-w-sm p-3 rounded-xl ${
                hasFiles
                  ? "bg-none"
                  : isSender
                    ? "bg-primary-100 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {!chat.flag ? (
                <p
                  className={` ${isSender && !hasFiles ? "text-white" : "text-gray-500"} text-sm italic   `}
                >
                  Message unsent
                </p>
              ) : (
                <>
                  {hasText && <p className="text-sm">{chat.text}</p>}
                  <div className="">
                    <FileViewer hasFiles chat={chat} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {chat.createAt && (
          <span className="text-xs text-gray-500 mt-1 ml-14">
            {format(new Date(chat.createAt), "HH:mm")}
          </span>
        )}
      </div>
    </>
  );
};

export default MessageCard;
