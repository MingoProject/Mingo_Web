"use client";

import {
  PusherDelete,
  PusherRevoke,
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

const MessageCard = ({
  chat,
  previousChat,
}: {
  chat: ResponseMessageDTO;
  previousChat?: ResponseMessageDTO;
}) => {
  const isSender = chat.createBy === localStorage.getItem("userId");
  const { id } = useParams();
  const { messages, setMessages } = useChatContext();

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
    if (!id) {
      console.error("boxId is missing or invalid");
      return;
    }

    const handleDeleteMessage = ({ id: messageId }: PusherDelete) => {
      console.log("Successfully deleted message: ", messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    };

    const handleRevokeMessage = ({ id: messageId }: PusherRevoke) => {
      console.log("Successfully revoked message: ", messageId);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, flag: false } : msg
        )
      );
    };

    pusherClient.subscribe(`private-${id}`);
    pusherClient.bind("delete-message", handleDeleteMessage);
    pusherClient.bind("revoke-message", handleRevokeMessage);

    return () => {
      pusherClient.unbind("delete-message", handleDeleteMessage);
      pusherClient.unbind("revoke-message", handleRevokeMessage);
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
        <div className="flex">
          {isSender && (
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
              <Image
                src="/assets/images/capy.jpg"
                alt="Avatar"
                width={45}
                height={45}
                className="rounded-full"
              />
            )}
            <div
              className={`max-w-sm p-3 rounded-xl ${
                isSender
                  ? "bg-primary-100 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {!chat.flag ? (
                <p
                  className={` ${isSender ? "text-white" : "text-gray-500"} text-sm italic   `}
                >
                  Tin nhắn đã được thu hồi
                </p>
              ) : (
                <>
                  {hasText && <p className="text-sm">{chat.text}</p>}
                  {hasFiles && (
                    <div className="my-2">
                      {chat.contentId.type === "Image" ? (
                        <Image
                          src={chat.contentId.url}
                          alt={chat.contentId.fileName || "Image"}
                          width={300}
                          height={300}
                          className="rounded-lg"
                        />
                      ) : (
                        <a
                          href={chat.contentId.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-200 underline text-sm"
                        >
                          {chat.contentId.fileName || "Download File"}
                        </a>
                      )}
                    </div>
                  )}
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
