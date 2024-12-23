"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { findMessage } from "@/lib/services/message.service";
import {
  FindMessageResponse,
  ResponseGroupMessageDTO,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import MessageCard from "./MessageCard";

const SearchMessage = ({
  boxId,
  onCancel,
}: {
  boxId: string;
  onCancel: () => void;
}) => {
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<ResponseGroupMessageDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch messages whenever query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 0) {
        setLoading(true);
        findMessage(boxId, query)
          .then((result: FindMessageResponse) => {
            if (result.success && Array.isArray(result.messages)) {
              setMessages(result.messages);
            } else {
              setMessages([]);
            }
            console.log(result.messages, "Fetched messages");
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setMessages([]);
      }
    }, 500); // Delay để giảm số lần gọi API không cần thiết

    return () => clearTimeout(delayDebounceFn);
  }, [query, boxId]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="h-10 w-full border-b border-gray-200 px-4 flex items-center">
        <Icon
          onClick={onCancel}
          icon="formkit:arrowleft"
          width={20}
          height={20}
          className="text-gray-500 dark:text-white"
        />
        <p className="text-lg text-center w-full">Tìm kiếm</p>
      </div>
      <div className="w-full px-4">
        <div className="ml-4 mt-4 flex h-[33px] items-center gap-2 rounded-full border-2 px-2 text-xs sm:w-auto lg:ml-0">
          <Icon
            icon="solar:magnifer-linear"
            width={20}
            height={20}
            className="text-gray-500 dark:text-white"
          />
          <input
            type="text"
            placeholder="Tìm kiếm tin nhắn"
            value={query}
            onChange={handleSearchChange}
            className="w-full bg-transparent p-2 outline-none"
          />
        </div>
      </div>

      {/* Loading indicator */}
      {loading && <div className="text-center mt-4">Đang tìm kiếm...</div>}

      {/* Message results */}
      {messages.length > 0 ? (
        <div className="mt-4 px-2">
          {messages.map((message, index) => (
            <MessageCard
              key={message.id}
              chat={message}
              previousChat={index > 0 ? messages[index - 1] : undefined} // Kiểm tra tin nhắn trước
            />
          ))}
        </div>
      ) : (
        query.trim().length > 0 &&
        !loading && (
          <div className="mt-4 text-center text-gray-500">
            Không tìm thấy kết quả
          </div>
        )
      )}
    </div>
  );
};

export default SearchMessage;
