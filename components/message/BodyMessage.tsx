"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import { getAllChat } from "@/lib/services/message.service";
import { useChatContext } from "@/context/ChatContext";
import { useParams } from "next/navigation";

const BodyMessage = () => {
  const { messages, setMessages } = useChatContext();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams(); // Lấy ID từ URL

  useEffect(() => {
    let isMounted = true;

    const myChat = async () => {
      try {
        const data = await getAllChat(id.toString()); // Gọi API
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
  }, [id, setMessages]);

  // Cuộn đến tin nhắn cuối cùng khi messages thay đổi
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger khi messages thay đổi

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full no-scrollbar">
      {messages.map((message, index) => (
        <MessageCard
          key={message.id}
          chat={message}
          previousChat={index > 0 ? messages[index - 1] : undefined} // Kiểm tra tin nhắn trước
        />
      ))}
      <div ref={messageEndRef}></div> {/* Tham chiếu cuối cùng để cuộn */}
    </div>
  );
};

export default BodyMessage;
