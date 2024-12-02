"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ItemChat } from "@/dtos/MessageDTO";
import BodyMessage from "@/components/message/BodyMessage";
import FooterMessage from "@/components/message/FooterMessage";
import HeaderMessageContent from "@/components/message/HeaderMessageContent";
import RightSide from "@/components/message/RightSide";
import { getAllChat, getListChat } from "@/lib/services/message.service";
import { ChatProvider } from "@/context/ChatContext";

const MessageContent = () => {
  const [allChat, setAllChat] = useState<ItemChat[]>([]);
  const [isRightSideVisible, setIsRightSideVisible] = useState(true); // Trạng thái hiển thị của RightSide
  const { id } = useParams(); // Lấy ID từ URL

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getListChat();
        setAllChat(data);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    fetchChats();
  }, []);

  if (!allChat) {
    return <div>Loading chat...</div>;
  }

  const chatItem = allChat.find((chat) => chat.id === id);

  if (!chatItem) {
    return null;
  }

  return (
    <ChatProvider>
      <div className="flex w-full">
        <div className="flex flex-col flex-1 h-full px-2 border-r border-border-color">
          <HeaderMessageContent
            item={chatItem}
            toggleRightSide={() => setIsRightSideVisible((prev) => !prev)} // Hàm toggle trạng thái
          />
          <BodyMessage boxId={id.toString()} />
          <FooterMessage boxId={id.toString()} />
        </div>

        {/* RightSide hiển thị dựa trên trạng thái isRightSideVisible */}
        {isRightSideVisible && (
          <div className="h-full hidden w-[25%] flex-col gap-2 overflow-y-auto lg:block">
            <RightSide item={chatItem} />
          </div>
        )}
      </div>
    </ChatProvider>
  );
};

export default MessageContent;
