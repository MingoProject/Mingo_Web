"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";

interface Message {
  text: string;
  isSender: boolean;
  timestamp: string;
  avatarUrl?: string; // Thêm avatarUrl cho mỗi tin nhắn
}

const initialMessages: Message[] = [
  {
    text: "Hello!",
    isSender: true,
    timestamp: "10:00 AM",
    avatarUrl: "/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg", // Thêm avatar cho người gửi
  },
  {
    text: "Hi there!",
    isSender: false,
    timestamp: "10:01 AM",
    avatarUrl: "/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg", // Thêm avatar cho người nhận
  },
  {
    text: "How are you?",
    isSender: true,
    timestamp: "10:02 AM",
    avatarUrl: "/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg",
  },
  {
    text: "I'm fine, thanks!",
    isSender: false,
    timestamp: "10:03 AM",
    avatarUrl: "/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg",
  },
  {
    text: "Great to hear!",
    isSender: true,
    timestamp: "10:04 AM",
    avatarUrl: "/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg",
  },
];

const BodyMessage = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isHydrated, setIsHydrated] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Set hydration state only once after component mounts
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Display null until hydration is complete (for server-side rendering)
  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full no-scrollbar">
      {messages.map((msg, index) => (
        <MessageCard
          key={index}
          mess={msg.text}
          isSender={msg.isSender}
          timestamp={msg.timestamp}
          avatarUrl={msg.avatarUrl} // Pass avatarUrl to MessageCard
        />
      ))}
      {/* Hidden element to scroll to the bottom */}
      <div ref={messageEndRef}></div>
    </div>
  );
};

export default BodyMessage;
