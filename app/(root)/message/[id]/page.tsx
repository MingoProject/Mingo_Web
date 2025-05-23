"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ItemChat } from "@/dtos/MessageDTO";
import BodyMessage from "@/components/message/BodyMessage";
import FooterMessage from "@/components/message/FooterMessage";
import HeaderMessageContent from "@/components/message/HeaderMessageContent";
import RightSide from "@/components/message/RightSide";
import {
  getListChat,
  getListGroupChat,
  IsOnline,
} from "@/lib/services/message.service";
import { ChatProvider, useChatContext } from "@/context/ChatContext";
import { getMyProfile, getUserById } from "@/lib/services/user.service";
import { FindUserDTO } from "@/dtos/UserDTO";
import { checkRelation } from "@/lib/services/relation.service";
import { FriendRequestDTO } from "@/dtos/FriendDTO";
import { unblock } from "@/lib/services/friend.service";
import { useChatItemContext } from "@/context/ChatItemContext";

const MessageContent = () => {
  const [allChat, setAllChat] = useState<ItemChat[]>([]);
  const [filteredChat, setFilteredChat] = useState<ItemChat[]>([]); // State lưu trữ các cuộc trò chuyện đã lọc
  const [relation, setRelation] = useState<string>("");
  const [isRightSideVisible, setIsRightSideVisible] = useState(false); // Trạng thái hiển thị của RightSide
  const { id } = useParams(); // Lấy ID từ URL
  const router = useRouter();
  const [chatItem, setChatItem] = useState<ItemChat | null>(null); // State lưu trữ itemChat
  const { isOnlineChat, setIsOnlineChat } = useChatContext();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const normalChats = await getListChat();
        const groupChats = await getListGroupChat();
        const combinedChats = [...normalChats, ...groupChats];
        setAllChat(combinedChats);
        setFilteredChat(combinedChats);

        // Kiểm tra nếu không có id trong URL và danh sách chat có ít nhất 1 cuộc trò chuyện
        if (!id && combinedChats.length > 0) {
          const firstChat = combinedChats[0]; // Lấy cuộc trò chuyện đầu tiên
          router.push(`/message/${firstChat.id}`); // Điều hướng sang chat đầu tiên
        } else if (combinedChats.length === 0) {
          // Nếu không có chat nào, điều hướng về trang chính
          router.push("/message");
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };

    fetchChats();
  }, [id, router]);

  if (!allChat) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  // const chatItem = allChat.find((chat) => chat.id === id);

  useEffect(() => {
    const chatItem = allChat.find((chat) => chat.id === id);
    if (chatItem) {
      setChatItem(chatItem); // Cập nhật itemChat khi tìm thấy cuộc trò chuyện
    }
  }, [id, allChat]);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       if (chatItem) {
  //         const data = await getMyProfile(
  //           chatItem?.receiverId?.toString() || ""
  //         );
  //         setIsOnlineChat((prevState) => ({
  //           ...prevState,
  //           [chatItem?.receiverId?.toString() || ""]: data.userProfile.status,
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //     }
  //   };
  //   fetchProfile();
  // }, [chatItem, chatItem?.receiverId]);

  // console.log(isOnlineChat, "isOnlineChat");

  const handleUnBlockChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Kiểm tra xem receiverId và senderId có tồn tại hay không
      if (!chatItem?.receiverId || !userId) {
        alert("Lỗi: Không có ID người nhận hoặc người gửi.");
        return;
      }

      // Tạo đối tượng params theo kiểu FriendRequestDTO
      const params: FriendRequestDTO = {
        sender: userId || null, // Nếu senderId là undefined, sử dụng null
        receiver: chatItem?.receiverId?.toString() || null, // Nếu receiverId là undefined, sử dụng null
      };

      await unblock(params, token);
      setRelation("stranger"); // Hoặc bạn có thể thay thế với giá trị mới mà bạn muốn
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!chatItem) {
      return; // Nếu chưa có chatItem, không thực hiện gì
    }
    let isMounted = true;
    const userId = localStorage.getItem("userId");

    const check = async () => {
      try {
        // const userId = localStorage.getItem("userId");
        if (userId) {
          const res: any = await checkRelation(
            userId,
            chatItem?.receiverId?.toString()
          );
          if (isMounted) {
            if (!res) {
              setRelation("stranger");
              // setRelationStatus(false);
            } else {
              const { relation, status, sender, receiver } = res;

              if (relation === "bff") {
                if (status) {
                  setRelation("bff"); //
                } else if (userId === sender) {
                  setRelation("senderRequestBff"); //
                } else if (userId === receiver) {
                  setRelation("receiverRequestBff"); //
                }
              } else if (relation === "friend") {
                if (status) {
                  setRelation("friend"); //
                } else if (userId === sender) {
                  setRelation("following"); //
                } else if (userId === receiver) {
                  setRelation("follower"); //
                }
              } else if (relation === "block") {
                if (userId === sender) {
                  setRelation("blocked"); //
                } else if (userId === receiver) {
                  setRelation("blockedBy");
                }
              } else {
                setRelation("stranger"); //
              }
              // setRelationStatus(status);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching relation:", error);
      }
    };
    check();
    return () => {
      isMounted = false;
    };
  }, [chatItem, relation]);

  if (!chatItem && id) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white dark:bg-transparent">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col flex-1 h-full px-2 border-r dark:border-gray-900 border-border-color">
        {!chatItem && !id ? (
          // Hiển thị giao diện mặc định khi không có chat hoặc id
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-lg text-gray-600">
              Select a conversation to start.
            </p>
            <p className="text-sm text-gray-400">No conversation selected.</p>
          </div>
        ) : relation === "" ? (
          // Hiển thị loader hoặc giao diện chờ trong khi chờ xác định trạng thái relation
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="loader"></div>
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : relation === "blockedBy" ? (
          <>
            <HeaderMessageContent
              item={chatItem || null}
              toggleRightSide={() => setIsRightSideVisible((prev) => !prev)}
            />
            <BodyMessage item={chatItem || null} />
            <div className="flex flex-col items-center justify-center w-full h-20 border-t dark:border-gray-900 border-border-color text-gray-700">
              <p className="text-sm">You are unable to contact this user.</p>
            </div>
          </>
        ) : relation === "blocked" ? (
          <>
            <HeaderMessageContent
              item={chatItem || null}
              toggleRightSide={() => setIsRightSideVisible((prev) => !prev)}
            />
            <BodyMessage item={chatItem || null} />
            <div className="flex flex-col items-center justify-center w-full border-t dark:border-gray-900 border-border-color text-gray-700">
              <p className="text-sm p-4">You have blocked this user.</p>
              <button
                className="text-sm cursor-pointer text-blue-500 hover:bg-opacity-30 hover:bg-border-color rounded-md shadow-md w-full p-4"
                onClick={handleUnBlockChat}
              >
                Unblock
              </button>
              <button className="text-sm cursor-pointer text-red-500 hover:bg-opacity-30 hover:bg-border-color rounded-md shadow-md w-full p-4">
                Report
              </button>
            </div>
          </>
        ) : (
          <>
            <HeaderMessageContent
              item={chatItem || null}
              toggleRightSide={() => setIsRightSideVisible((prev) => !prev)}
            />
            <BodyMessage item={chatItem || null} />
            <FooterMessage item={chatItem || null} />
          </>
        )}
      </div>

      {/* RightSide hiển thị dựa trên trạng thái isRightSideVisible */}
      {isRightSideVisible && (
        <div className="h-full hidden w-[25%] flex-col gap-2 overflow-y-auto lg:block">
          <RightSide
            item={chatItem || null}
            setGroupData={setChatItem}
            setRelation={setRelation}
          />
        </div>
      )}
    </div>
  );
};

export default MessageContent;
