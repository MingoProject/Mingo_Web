"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import { ResponseMessageDTO } from "@/dtos/MessageDTO";
import { getAllChat } from "@/lib/services/message.service";
import { useChatContext } from "@/context/ChatContext";

const BodyMessage = ({ boxId }: { boxId: string }) => {
  const { messages, setMessages } = useChatContext();
  const [isHydrated, setIsHydrated] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const myChat = async () => {
      try {
        const data = await getAllChat(boxId); // Gọi API
        if (isMounted && data.success) {
          setMessages(data.messages); // Lưu trực tiếp `messages` từ API
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };

    myChat();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, [boxId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full no-scrollbar">
      {messages.map((message, index) => (
        <MessageCard
          key={message.id}
          chat={message}
          previousChat={index > 0 ? messages[index - 1] : undefined} // Kiểm tra tin nhắn trước
        />
      ))}
      <div ref={messageEndRef}></div>
    </div>
  );
};

export default BodyMessage;
