"use client";
import React, { useEffect, useState } from "react";
import {
  createGroup,
  getListChat,
  getListGroupChat,
} from "@/lib/services/message.service";
import ListUserChatCard from "../cards/ListUserChatCard";
import { useParams, useRouter } from "next/navigation";
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
import { useChatItemContext } from "@/context/ChatItemContext";
import { ChatProvider } from "@/context/ChatContext";
import { pusherClient } from "@/lib/pusher";
import { getUserById } from "@/lib/services/user.service";
import { FindUserDTO } from "@/dtos/UserDTO";

const ListUserChat = () => {
  const { allChat, setAllChat } = useChatItemContext();
  const { filteredChat, setFilteredChat } = useChatItemContext(); // State lưu trữ các cuộc trò chuyện đã lọc
  const [searchTerm, setSearchTerm] = useState<string>(""); // State lưu trữ từ khóa tìm kiếm
  const router = useRouter(); // Use router for navigation
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { profile } = useAuth();
  const { id } = useParams(); // Lấy ID từ URL
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
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

  useEffect(() => {
    if (id && !allChat.find((chat) => chat.id === id)) {
      let isMounted = true;

      const fetchUser = async () => {
        try {
          const userId = localStorage.getItem("userId");

          // Kiểm tra nếu không có `allChat` nào có boxId trùng với id
          const existChat = allChat.find((item) => item?.receiverId === id);
          if (!existChat) {
            // Dữ liệu để tạo group chat
            const groupData = {
              membersIds: [id, userId],
              leaderId: userId,
              groupName: `${user?.firstName} ${user?.lastName}`,
              groupAva: user?.avatar || "/assets/images/default-avatar.jpg",
            };

            // Gọi API tạo group
            const res = await createGroup(groupData);
          } else {
            console.log("Chat already exists!");
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

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const normalChats = await getListChat();
        const groupChats = await getListGroupChat();

        // Gộp hai danh sách, đảm bảo không bị rỗng nếu một trong hai có dữ liệu
        const combinedChats = [
          ...(normalChats || []), // Nếu rỗng, dùng mảng trống thay thế
          ...(groupChats || []),
        ];

        setAllChat(combinedChats);
        setFilteredChat(combinedChats);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };

    fetchChats();

    // Lắng nghe sự kiện tin nhắn mới
    const handleNewMessage = (data: any) => {
      setAllChat((prevChats: any) => {
        // Cập nhật danh sách chat
        const updatedChats = prevChats.map((chat: any) => {
          if (chat.id === data.boxId) {
            return {
              ...chat,
              lastMessage: {
                text: data.text || "Đã gửi 1 file",
                timestamp: new Date(data.createAt),
              },
            };
          }
          return chat;
        });

        // Nếu tin nhắn mới thuộc một chat chưa tồn tại, thêm nó
        const isNewChat = !updatedChats.find(
          (chat: any) => chat.id === data.boxId
        );
        if (isNewChat) {
          updatedChats.unshift({
            id: id,
            userName: data.userName || "Người dùng mới",
            avatarUrl:
              data.avatarUrl ||
              "/assets/images/0d80fa84f049bc902d6786a7d5574ca6.jpg",
            lastMessage: {
              text: data.text || "Đã gửi 1 file",
              timestamp: new Date(data.createAt),
            },
            status: false,
            isRead: false,
          });
        }

        return updatedChats;
      });

      // Cập nhật danh sách chat đã lọc nếu cần
      setFilteredChat((prevFiltered) => {
        const updatedChats = prevFiltered.map((chat) => {
          if (chat.id === data.boxId) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage, // Giữ nguyên các thuộc tính khác
                text: data.text || "Đã gửi 1 file",
                timestamp: new Date(data.createAt),
              },
            };
          }
          return chat;
        });

        // Nếu tin nhắn mới thuộc một chat chưa tồn tại, thêm nó
        const isNewChat = !updatedChats.find((chat) => chat.id === data.boxId);
        if (isNewChat) {
          updatedChats.unshift({
            id: data.boxId,
            userName: data.userName || "Người dùng mới",
            avatarUrl: data.avatarUrl || "/assets/images/default-avatar.png",
            lastMessage: {
              id: "unique-id", // Cung cấp giá trị mặc định cho id
              createBy: "system", // Cung cấp giá trị mặc định cho createBy
              text: data.text || "Đã gửi 1 file",
              timestamp: new Date(data.createAt),
            },
            status: "active", // Giá trị mặc định cho status
            isRead: false, // Giá trị mặc định cho isRead
            senderId: profile._id,
            receiverId: data.receiverIds,
          });
        }

        return updatedChats;
      });
    };

    // Đăng ký kênh và sự kiện
    pusherClient.subscribe("chat-channel");
    pusherClient.bind("new-message", handleNewMessage);

    // Dọn dẹp sự kiện
    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe("chat-channel");
    };
  }, []);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const searchValue = e.target.value;
  //   setSearchTerm(searchValue);

  //   // Lọc các cuộc trò chuyện theo tên
  //   const filtered = allChat.filter((chat) =>
  //     chat.userName.toLowerCase().includes(searchValue.toLowerCase())
  //   );
  //   setFilteredChat(filtered);
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Filter the chats by username
    const filtered = allChat.filter((chat) =>
      chat.userName.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Sort the filtered chats by lastMessage timestamp (createAt)
    const sortedFilteredChats = filtered.sort((a, b) => {
      const timestampA = new Date(a.lastMessage.timestamp).getTime();
      const timestampB = new Date(b.lastMessage.timestamp).getTime();
      return timestampA - timestampB; // Sorting in descending order
    });

    setFilteredChat(sortedFilteredChats);
  };

  console.log(filteredChat, "this is filterchat");

  // Handle chat selection and navigation
  const handleChatClick = (id: string) => {
    router.push(`/message/${id}`); // Navigate to chat details page
  };

  return (
    <ChatProvider>
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
    </ChatProvider>
  );
};

export default ListUserChat;
