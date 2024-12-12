"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import MessageSearch from "./MessageSearch";
import CreateGroup from "./CreateGroup";
import { useAuth } from "@/context/AuthContext";
import { useChatItemContext } from "@/context/ChatItemContext";
import { ChatProvider } from "@/context/ChatContext";
import { pusherClient } from "@/lib/pusher";
import { getUserById } from "@/lib/services/user.service";
import { FindUserDTO } from "@/dtos/UserDTO";

const ListUserChat = () => {
  const { allChat, setAllChat } = useChatItemContext();
  const { filteredChat, setFilteredChat } = useChatItemContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { profile } = useAuth();
  const { id } = useParams();
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  const [user, setUser] = useState<FindUserDTO | null>(null);

  const fetchUserIfNotExists = useCallback(async () => {
    if (id && !allChat.some((chat) => chat.id === id)) {
      try {
        const data = await getUserById(id.toString());
        setUser(data);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
  }, [id, allChat]);

  useEffect(() => {
    fetchUserIfNotExists();
  }, [fetchUserIfNotExists]);

  useEffect(() => {
    if (id && !allChat.find((chat) => chat.id === id)) {
      let isMounted = true;

      const fetchUser = async () => {
        try {
          const userId = localStorage.getItem("userId");

          const existChat = allChat.find((item) => item?.receiverId === id);
          if (!existChat) {
            const groupData = {
              membersIds: [id, userId],
              leaderId: userId,
              groupName: `${user?.firstName} ${user?.lastName}`,
              groupAva: user?.avatar || "/assets/images/default-avatar.jpg",
            };
            await createGroup(groupData);
          } else {
            console.log("Chat already exists!");
          }
        } catch (error) {
          console.error("Error creating group chat:", error);
        }
      };

      fetchUser();

      return () => {
        isMounted = false;
      };
    }
  }, [id, user, allChat]);

  const fetchChats = useCallback(async () => {
    try {
      const [normalChats, groupChats] = await Promise.all([
        getListChat(),
        getListGroupChat(),
      ]);
      const combinedChats = [
        ...(normalChats || []),
        ...(groupChats || []),
      ].sort((a, b) => {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      });

      console.log(combinedChats, "combinedChats");

      setAllChat(combinedChats);
      setFilteredChat(combinedChats);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }, [setAllChat, setFilteredChat]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      setAllChat((prevChats: any) => {
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

        return updatedChats.sort(
          (a: any, b: any) => b.lastMessage.timestamp - a.lastMessage.timestamp
        );
      });

      setFilteredChat((prevFiltered) => {
        const updatedChats = prevFiltered.map((chat) => {
          if (chat.id === data.boxId) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                text: data.text || "Đã gửi 1 file",
                timestamp: new Date(data.createAt),
              },
            };
          }
          return chat;
        });

        const isNewChat = !updatedChats.find((chat) => chat.id === data.boxId);
        if (isNewChat) {
          updatedChats.unshift({
            id: data.boxId,
            userName: data.userName || "Người dùng mới",
            avatarUrl: data.avatarUrl || "/assets/images/default-avatar.png",
            lastMessage: {
              id: "unique-id",
              createBy: "system",
              text: data.text || "Đã gửi 1 file",
              timestamp: new Date(data.createAt),
            },
            status: "active",
            isRead: false,
            senderId: profile._id,
            receiverId: data.receiverIds,
          });
        }

        return updatedChats.sort(
          (a: any, b: any) => b.lastMessage.timestamp - a.lastMessage.timestamp
        );
      });
    };

    pusherClient.subscribe("chat-channel");
    pusherClient.bind("new-message", handleNewMessage);

    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe("chat-channel");
    };
  }, [id, allChat]);

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
      return timestampB - timestampA; // Sorting in descending order
    });

    setFilteredChat(sortedFilteredChats);
  };

  const handleChatClick = (id: string) => {
    router.push(`/message/${id}`);
  };

  return (
    <ChatProvider>
      <div className="flex flex-col w-full">
        <MessageSearch value={searchTerm} onChange={handleSearch} />
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
