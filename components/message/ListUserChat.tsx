"use client";
import React, { useEffect, useState } from "react";
import { ItemChat } from "@/dtos/MessageDTO";
import { getListChat, getListGroupChat } from "@/lib/services/message.service";
import ListUserChatCard from "../cards/ListUserChatCard";
import { useRouter } from "next/navigation";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageSearch from "./MessageSearch"; // Import component tìm kiếm
import CreateGroup from "./CreateGroup";
import { useAuth } from "@/context/AuthContext";

const ListUserChat = () => {
  const [allChat, setAllChat] = useState<ItemChat[]>([]);
  const [filteredChat, setFilteredChat] = useState<ItemChat[]>([]); // State lưu trữ các cuộc trò chuyện đã lọc
  const [searchTerm, setSearchTerm] = useState<string>(""); // State lưu trữ từ khóa tìm kiếm
  const router = useRouter(); // Use router for navigation
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { profile } = useAuth();
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  useEffect(() => {
    // const fetchChats = async () => {
    //   try {
    //     const data = await getListChat();
    //     setAllChat(data); // Cập nhật danh sách chat
    //     setFilteredChat(data); // Cập nhật danh sách chat đã lọc ban đầu
    //   } catch (error) {
    //     console.error("Error loading chats:", error);
    //   }
    // };
    // fetchChats();
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

  // Hàm lọc các cuộc trò chuyện theo tên
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Lọc các cuộc trò chuyện theo tên
    const filtered = allChat.filter((chat) =>
      chat.userName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredChat(filtered);
  };

  // Handle chat selection and navigation
  const handleChatClick = (id: string) => {
    router.push(`/message/${id}`); // Navigate to chat details page
  };

  return (
    <div className="flex flex-col w-full">
      <MessageSearch value={searchTerm} onChange={handleSearch} />{" "}
      {/* Component tìm kiếm */}
      <Menubar className="relative border-none bg-transparent py-4 shadow-none z-50">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-2">
            <span className="ml-1 text-xs font-semibold md:text-base">
              Đoạn chat
            </span>
            <FontAwesomeIcon icon={faChevronDown} />
          </MenubarTrigger>
          <MenubarContent className="absolute top-full z-1000 ml-20 mt-2 w-40 font-sans text-sm shadow-md bg-white ">
            <MenubarItem className="flex w-full cursor-pointer justify-center hover:bg-primary-100 hover:text-white py-2 rounded-md">
              Tin nhắn đang chờ
            </MenubarItem>
            <MenubarItem className="flex w-full cursor-pointer justify-center hover:bg-primary-100 hover:text-white py-2 rounded-md">
              Lưu trữ đoạn chat
            </MenubarItem>
            <MenubarItem
              onClick={toggleForm}
              className="flex w-full cursor-pointer justify-center hover:bg-primary-100 hover:text-white py-2 rounded-md"
            >
              Tạo nhóm
            </MenubarItem>
            <MenubarSeparator />
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="h-[75vh] w-full overflow-y-auto">
        {filteredChat.length === 0 ? (
          <p>Không tìm thấy cuộc trò chuyện nào!</p>
        ) : (
          filteredChat.map((item) => (
            <div key={item.id} onClick={() => handleChatClick(item.id)}>
              <ListUserChatCard itemChat={item} />
            </div>
          ))
        )}
      </div>
      {isFormOpen && (
        <CreateGroup onClose={() => setIsFormOpen(false)} me={profile} />
      )}
    </div>
  );
};

export default ListUserChat;
