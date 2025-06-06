"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  createGroup,
  getListChat,
  getListGroupChat,
  IsOnline,
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
import { ItemChat, StatusResponse } from "@/dtos/MessageDTO";
import { useSocket } from "@/context/SocketContext";
import CallNotification from "./CallNotification";
import user from "pusher-js/types/src/core/user";
import { VideoCall } from "./VideoCall";

const ListUserChat = () => {
  const { allChat, setAllChat } = useChatItemContext();
  const { filteredChat, setFilteredChat } = useChatItemContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { profile } = useAuth();
  const { onlineUsers, handleCall } = useSocket();
  const params = useParams();
  const id = params.id?.toString();
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const channelRefs = useRef<any[]>([]);

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

      setAllChat(combinedChats);
      setFilteredChat(combinedChats);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }, [setAllChat, setFilteredChat]);

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (id !== data.boxId) return; // Kiểm tra đúng kênh
      // console.log(data.boxId);

      setAllChat((prevChats: any) => {
        const updatedChats = prevChats.map((chat: any) => {
          if (chat.id === data.boxId) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                text: data.text || "",
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
            id: data.boxId,
            userName: data.userName || "Người dùng mới",
            avatarUrl: data.avatarUrl || "/assets/images/default-avatar.png",
            lastMessage: {
              id: "unique-id",
              createBy: "system",
              text: "",
              timestamp: new Date(data.createAt),
              status: false,
              contentId: {
                fileName: "",
                bytes: "",
                format: "",
                height: "",
                publicId: "",
                type: "",
                url: "",
                width: "",
              },
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
              text: "",
              timestamp: new Date(data.createAt),
              status: false,
              contentId: {
                fileName: "",
                bytes: "",
                format: "",
                height: "",
                publicId: "",
                type: "",
                url: "",
                width: "",
              },
            },
            status: "active",
            isRead: false,
            senderId: profile._id,
            receiverId: data.receiverIds,
            groupName: data.groupName,
          });
        }

        return updatedChats.sort(
          (a: any, b: any) => b.lastMessage.timestamp - a.lastMessage.timestamp
        );
      });
    };

    // Đảm bảo hủy đăng ký kênh cũ
    channelRefs.current.forEach((channel) => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(channel.name);
    });

    // Đăng ký kênh mới
    const channels: any[] = allChat.map((chat) => {
      const channel = pusherClient.subscribe(`private-${chat.id.toString()}`);
      channel.bind("new-message", handleNewMessage); // Đảm bảo lại bind sự kiện
      return channel;
    });

    // Lưu lại các kênh đã đăng ký
    channelRefs.current = channels;

    // Hủy đăng ký khi component unmount hoặc khi allChat thay đổi
    return () => {
      channels.forEach((channel: any) => {
        channel.unbind("new-message", handleNewMessage);
        pusherClient.unsubscribe(channel.name); // Hủy đăng ký kênh
      });
    };
  }, [id, allChat]);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const handleUserStatusChanged = (data: StatusResponse) => {
      // Cập nhật trạng thái online/offline của người dùng
      // console.log(profile.status, "profile.status");
      // console.log(data.status, "this is all data chat");
      // Nếu người dùng online, cập nhật status = true cho filteredChat
      if (data.status) {
        setFilteredChat((prevFiltered: any) => {
          const updatedChats = prevFiltered.map((chat: any) => {
            if (chat.receiverId === data.userId) {
              return {
                ...chat,
                status: true, // Cập nhật status là true khi người dùng online
              };
            }
            return chat;
          });
          return updatedChats;
        });
      } else {
        // Nếu trạng thái là offline, vẫn có thể cập nhật nếu cần
        setFilteredChat((prevFiltered: any) => {
          const updatedChats = prevFiltered.map((chat: any) => {
            if (chat.receiverId === data.userId) {
              return {
                ...chat,
                status: false, // Cập nhật status là false khi người dùng offline
              };
            }
            return chat;
          });
          return updatedChats;
        });
      }

      // Cập nhật lại allChat nếu cần
      setAllChat((prevChats) => {
        const updatedChats = prevChats.map((chat: any) => {
          if (chat.receiverId === data.userId) {
            return {
              ...chat,
              status: data.status, // 'online' hoặc 'offline'
            };
          }
          return chat;
        });
        return updatedChats;
      });
    };

    const userId = localStorage.getItem("userId");

    // Gọi API IsOnline khi người dùng truy cập vào kênh
    const markUserAsOnline = async () => {
      try {
        await IsOnline(userId?.toString() || ""); // Đánh dấu người dùng là online khi truy cập
      } catch (error) {
        console.error("Error marking user as online:", error);
      }
    };

    // Gọi hàm để đánh dấu người dùng là online khi họ truy cập kênh
    markUserAsOnline();

    // Đảm bảo hủy đăng ký kênh cũ
    channelRefs.current.forEach((channel) => {
      channel.unbind("online-status", handleUserStatusChanged);
      pusherClient.unsubscribe(channel.name);
    });

    // Đăng ký kênh theo dõi trạng thái người dùng
    const statusChannel = pusherClient.subscribe(`${userId}`);

    // Lắng nghe sự kiện thay đổi trạng thái
    statusChannel.bind("online-status", handleUserStatusChanged);

    // Lưu lại kênh đã đăng ký
    channelRefs.current.push(statusChannel);

    // Hủy đăng ký khi component unmount hoặc khi allChat thay đổi
    return () => {
      statusChannel.unbind("online-status", handleUserStatusChanged);
      pusherClient.unsubscribe(statusChannel.name);
    };
  }, [allChat, setAllChat, setFilteredChat]);

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
      <div className="flex flex-col w-full bg-transparent">
        <MessageSearch value={searchTerm} onChange={handleSearch} />
        <Menubar className="relative  border-none bg-transparent py-4 shadow-none z-50">
          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-2">
              <span className="ml-1 text-xs font-semibold md:text-base">
                Chat
              </span>
              <FontAwesomeIcon icon={faChevronDown} />
            </MenubarTrigger>
            <MenubarContent className="  absolute top-full ml-20 mt-2 w-40 font-sans text-sm shadow-md z-50 dark:z-50 bg-white text-primary-100 dark:bg-gray-700 rounded-md dark:text-white">
              <MenubarItem
                onClick={toggleForm}
                className="flex w-full cursor-pointer justify-center hover:bg-primary-100 hover:text-white py-2 rounded-md"
              >
                Create group
              </MenubarItem>
              <MenubarSeparator />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="h-[75vh] w-full overflow-y-auto">
          {filteredChat.length === 0 ? (
            <p>No conversations found!</p>
          ) : (
            filteredChat.map((item) => (
              <div key={item.id} onClick={() => handleChatClick(item.id)}>
                <ListUserChatCard itemChat={item} />
                <CallNotification />
                <VideoCall />
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
