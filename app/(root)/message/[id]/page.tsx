"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ItemChat } from "@/dtos/MessageDTO";
import BodyMessage from "@/components/message/BodyMessage";
import FooterMessage from "@/components/message/FooterMessage";
import HeaderMessageContent from "@/components/message/HeaderMessageContent";
import RightSide from "@/components/message/RightSide";
import { getListChat, getListGroupChat } from "@/lib/services/message.service";
import { ChatProvider } from "@/context/ChatContext";
import { getUserById } from "@/lib/services/user.service";
import { FindUserDTO } from "@/dtos/UserDTO";

const MessageContent = () => {
  const [allChat, setAllChat] = useState<ItemChat[]>([]);
  const [filteredChat, setFilteredChat] = useState<ItemChat[]>([]); // State lưu trữ các cuộc trò chuyện đã lọc

  const [isRightSideVisible, setIsRightSideVisible] = useState(false); // Trạng thái hiển thị của RightSide
  const { id } = useParams(); // Lấy ID từ URL
  const [user, setUser] = useState<FindUserDTO | null>(null);

  // Fetch user nếu không có chatItem
  useEffect(() => {
    if (id && !allChat.find((chat) => chat.id === id)) {
      let isMounted = true;

      const fetchUser = async () => {
        try {
          const data = await getUserById(id.toString());
          if (isMounted && data) {
            setUser(data);
          }
        } catch (error) {
          console.error("Error loading user:", error);
        }
      };

      fetchUser();

      return () => {
        isMounted = false; // Cleanup khi component unmount
      };
    }
  }, []);

  // Fetch danh sách chat khi component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Lấy danh sách chat thường
        const normalChats = await getListChat();
        // Lấy danh sách group chat
        const groupChats = await getListGroupChat();

        // Kết hợp cả hai danh sách
        const combinedChats = [...normalChats, ...groupChats];
        setAllChat(combinedChats); // Cập nhật danh sách chat
        setFilteredChat(combinedChats); // Cập nhật danh sách chat đã lọc ban đầu
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    fetchChats();
  }, []);

  if (!allChat) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  const chatItem = allChat.find((chat) => chat.id === id);

  return (
    <ChatProvider>
      <div className="flex w-full">
        <div className="flex flex-col flex-1 h-full px-2 border-r border-border-color">
          <HeaderMessageContent
            item={chatItem || null}
            // user={chatItem ? null : user} // Nếu không có chatItem, truyền user
            toggleRightSide={() => setIsRightSideVisible((prev) => !prev)}
          />
          <BodyMessage />
          <FooterMessage
            item={chatItem || null}
            user={chatItem ? null : user}
          />
        </div>

        {/* RightSide hiển thị dựa trên trạng thái isRightSideVisible */}
        {isRightSideVisible && (
          <div className="h-full hidden w-[25%] flex-col gap-2 overflow-y-auto lg:block">
            <RightSide item={chatItem || null} />
          </div>
        )}
      </div>
    </ChatProvider>
  );
};

export default MessageContent;
