// "use client";

// import React, { useEffect, useState } from "react";
// import { ItemChat } from "@/dtos/MessageDTO";
// import { getListChat } from "@/lib/services/message.service";
// import ListUserChatCard from "../cards/ListUserChatCard";
// import {
//   Menubar,
//   MenubarMenu,
//   MenubarTrigger,
//   MenubarContent,
//   MenubarItem,
//   MenubarSeparator,
// } from "@radix-ui/react-menubar";
// import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useRouter } from "next/navigation";
// import BodyMessage from "./BodyMessage";
// import HeaderMessageContent from "./HeaderMessageContent";
// import FooterMessage from "./FooterMessage";
// import RightSide from "./RightSide";
// import MessageSearch from "./MessageSearch";

// const ListUserChat = () => {
//   const [allChat, setAllChat] = useState<ItemChat[]>([]);
//   const router = useRouter(); // Khởi tạo useRouter
//   const [selectedChat, setSelectedChat] = useState<ItemChat | null>(null);
//   useEffect(() => {
//     let isMounted = true;
//     const myChat = async () => {
//       try {
//         const data = await getListChat();
//         if (isMounted) {
//           setAllChat(data); // Cập nhật danh sách chat
//         }
//       } catch (error) {
//         console.error("Error loading posts:", error);
//       }
//     };
//     myChat();

//     return () => {
//       isMounted = false; // Cleanup
//     };
//   }, []);

//   console.log(allChat, "this is all chat");

//   const handleChatClick = (id: string) => {
//     const chat = allChat.find((chat) => chat.id === id);
//     setSelectedChat(chat || null); // Set the selected chat
//     router.push(`/message/${id}`); // Điều hướng đến trang chat theo ID
//   };

//   return (
//     <>
//       {selectedChat ? (
//         <div className="w-full h-full flex ">
//           {/* <div className="flex flex-col w-1/5 h-full">
//             <Menubar className="relative border-none bg-transparent py-4 shadow-none">
//               <MenubarMenu>
//                 <MenubarTrigger className="flex items-center gap-2">
//                   <span className="ml-1 whitespace-nowrap text-xs font-semibold md:text-base">
//                     Đoạn chat
//                   </span>
//                   <FontAwesomeIcon icon={faChevronDown} />
//                 </MenubarTrigger>
//                 <MenubarContent className="text-dark100_light500 background-light700_dark300 absolute top-full z-50 ml-20 mt-2 h-auto w-40 font-sans text-sm shadow-md">
//                   <MenubarItem className="mb-4 flex w-full cursor-pointer items-center justify-center text-center hover:bg-primary-100 hover:text-white">
//                     <p className="p-1 pt-2">Tin nhắn đang chờ</p>
//                   </MenubarItem>
//                   <MenubarItem className="flex w-full cursor-pointer items-center justify-center text-center hover:bg-primary-100 hover:text-white">
//                     <p className="p-1 pb-2">Lưu trữ đoạn chat</p>
//                   </MenubarItem>
//                   <MenubarSeparator />
//                 </MenubarContent>
//               </MenubarMenu>
//             </Menubar>

//             <div className="h-[75vh] w-full">
//               {allChat.map((item) => (
//                 <div key={item.id} onClick={() => handleChatClick(item.id)}>
//                   <ListUserChatCard itemChat={item} />
//                 </div>
//               ))}
//             </div>
//           </div> */}
//           <div className="flex flex-col w-3/5 h-full px-2">
//             <HeaderMessageContent item={selectedChat} />
//             <BodyMessage boxId={selectedChat.id} />
//             <FooterMessage />
//           </div>
//           <div className="text-dark100_light500 h-full hidden w-1/5 flex-col gap-2 overflow-y-auto lg:block ">
//             <RightSide />
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col w-full px-2">
//           <Menubar className="relative border-none bg-transparent py-4 shadow-none">
//             <MenubarMenu>
//               <MenubarTrigger className="flex items-center gap-2">
//                 <span className="ml-1 whitespace-nowrap text-xs font-semibold md:text-base">
//                   Đoạn chat
//                 </span>
//                 <FontAwesomeIcon icon={faChevronDown} />
//               </MenubarTrigger>
//               <MenubarContent className="text-dark100_light500 background-light700_dark300 absolute top-full z-50 ml-20 mt-2 h-auto w-40 font-sans text-sm shadow-md">
//                 <MenubarItem className="mb-4 flex w-full cursor-pointer items-center justify-center text-center hover:bg-primary-100 hover:text-white">
//                   <p className="p-1 pt-2">Tin nhắn đang chờ</p>
//                 </MenubarItem>
//                 <MenubarItem className="flex w-full cursor-pointer items-center justify-center text-center hover:bg-primary-100 hover:text-white">
//                   <p className="p-1 pb-2">Lưu trữ đoạn chat</p>
//                 </MenubarItem>
//                 <MenubarSeparator />
//               </MenubarContent>
//             </MenubarMenu>
//           </Menubar>

//           <div className="h-[75vh] w-full">
//             {allChat.map((item) => (
//               <div key={item.id} onClick={() => handleChatClick(item.id)}>
//                 <ListUserChatCard itemChat={item} />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ListUserChat;

// components/message/ListUserChat.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ItemChat } from "@/dtos/MessageDTO";
import { getListChat } from "@/lib/services/message.service";
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

const ListUserChat = () => {
  const [allChat, setAllChat] = useState<ItemChat[]>([]);
  const [filteredChat, setFilteredChat] = useState<ItemChat[]>([]); // State lưu trữ các cuộc trò chuyện đã lọc
  const [searchTerm, setSearchTerm] = useState<string>(""); // State lưu trữ từ khóa tìm kiếm
  const router = useRouter(); // Use router for navigation

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getListChat();
        setAllChat(data); // Cập nhật danh sách chat
        setFilteredChat(data); // Cập nhật danh sách chat đã lọc ban đầu
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
    </div>
  );
};

export default ListUserChat;
