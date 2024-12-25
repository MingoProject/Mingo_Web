"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Format from "../cards/FormatCard";
import ImagesMedia from "./ImagesMedia";
import File from "./File";
import { ItemChat } from "@/dtos/MessageDTO";
import { FindUserDTO } from "@/dtos/UserDTO";
import {
  getListChat,
  getListGroupChat,
  removeChatBox,
} from "@/lib/services/message.service";
import { useParams, useRouter } from "next/navigation";
import SearchMessage from "./SearchMessage";
import { block, unblock } from "@/lib/services/friend.service";
import { FriendRequestDTO } from "@/dtos/FriendDTO";
import { useChatItemContext } from "@/context/ChatItemContext";
import ReportCard from "../cards/ReportCard";
import ChangeAvatar from "./ChangeAvatar";

const RightSide = ({
  item,
  setGroupData,
  setRelation,
  // user,
}: {
  item: ItemChat | null;
  setGroupData: any;
  setRelation: any;
}) => {
  const [isReport, setIsReport] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isNoNotification, setIsNoNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const { id } = useParams();
  const { allChat, setAllChat } = useChatItemContext();
  const { filteredChat, setFilteredChat } = useChatItemContext(); // State lưu trữ các cuộc trò chuyện đã lọc
  const router = useRouter();

  // console.log(item, "this is item");

  const handleIsReport = () => {
    setIsReport(true);
  };

  const closeReport = () => {
    setIsReport(false);
  };

  const handleIsBlock = () => {
    setIsBlock(true);
  };

  const closeBlock = () => {
    setIsBlock(false);
  };

  const handleIsDelete = () => {
    setIsDelete(true);
  };

  const closeDelete = () => {
    setIsDelete(false);
  };

  const handleIsNoNotification = () => {
    setIsNoNotification(true);
  };

  const closeNoNotification = () => {
    setIsNoNotification(false);
  };

  const resetActiveTab = () => {
    setActiveTab(""); // hoặc bạn có thể đặt lại thành một giá trị khác nếu cần
  };

  const handleDeleteChat = async () => {
    try {
      setIsLoading(true);

      // Gọi API xóa chat
      await removeChatBox(id?.toString() || "");

      // Lấy danh sách chat sau khi xóa
      const normalChats = await getListChat();
      const groupChats = await getListGroupChat();
      const combinedChats = [...normalChats, ...groupChats];

      // Cập nhật danh sách chat
      setAllChat(combinedChats);
      setFilteredChat(combinedChats);

      alert("Đoạn chat đã được xóa thành công!");

      // Đóng modal
      closeDelete();

      // Kiểm tra và điều hướng sang chat đầu tiên
      if (combinedChats.length >= 0) {
        const firstChat = combinedChats[0];
        router.push(`/message/${firstChat.id}`); // Điều hướng sang chat đầu tiên
      } else {
        router.push("/message"); // Nếu không còn chat, điều hướng về trang tin nhắn chính
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Xóa chat thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockChat = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      // Kiểm tra xem receiverId và senderId có tồn tại hay không
      if (!item?.receiverId || !item?.senderId) {
        alert("Lỗi: Không có ID người nhận hoặc người gửi.");
        setIsLoading(false);
        return;
      }

      // Tạo đối tượng params theo kiểu FriendRequestDTO
      const params: FriendRequestDTO = {
        sender: item.senderId || null, // Nếu senderId là undefined, sử dụng null
        receiver: item.receiverId || null, // Nếu receiverId là undefined, sử dụng null
      };
      // console.log(params, "id ng dui nguoi nhan");

      await block(params, token); // Gọi API block
      setRelation("block");
      alert("Đã block thành công!");

      closeBlock(); // Đóng modal sau khi block thành công
    } catch (error) {
      alert("Block thất bại. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  const RenderTag = () => {
    switch (activeTab) {
      case "search":
        return item ? (
          <SearchMessage onCancel={resetActiveTab} boxId={item.id.toString()} />
        ) : null;
      case "media":
        return item ? (
          <ImagesMedia onCancel={resetActiveTab} boxId={item.id.toString()} />
        ) : null;
      case "file":
        return item ? (
          <File onCancel={resetActiveTab} boxId={item.id.toString()} />
        ) : null;

      default:
        if (!item) {
          return <div>Loading chat...</div>;
        }
        return (
          <>
            <div className="h-[45px] w-full border-b border-gray-200 dark:border-gray-900 px-8">
              <p className="text-lg">Detail</p>
            </div>
            {item && (
              <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
                {item.groupName === item.userName ? (
                  <Image
                    src={item.avatarUrl || "/assets/images/default-user.png"}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                    style={{
                      objectFit: "cover",
                      width: "80px",
                      height: "80px",
                    }}
                  />
                ) : (
                  <ChangeAvatar groupData={item} setGroupData={setGroupData} />
                )}

                <p className="text-lg">{item.groupName}</p>
              </div>
            )}
            <div className="flex items-center px-8 ">
              <ul>
                <li
                  onClick={() => setActiveTab("search")}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="iconamoon:search-thin"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Find
                  </p>
                </li>
                <li
                  onClick={() => setActiveTab("media")}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="system-uicons:picture"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Media
                  </p>
                </li>
                <li
                  onClick={() => setActiveTab("file")}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="bx:file"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    File
                  </p>
                </li>
                <li
                  onClick={handleIsNoNotification}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="ion:notifications-off-outline"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Turn off
                  </p>
                </li>
                <li
                  onClick={handleIsReport}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="material-symbols:report-outline"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Report
                  </p>
                </li>
                <li
                  onClick={handleIsBlock}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="material-symbols:block"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Block
                  </p>
                </li>
                <li
                  onClick={handleIsDelete}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="material-symbols:delete-outline"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Remove
                  </p>
                </li>
              </ul>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex w-full flex-col py-4">
      {RenderTag()}
      {isReport && (
        <ReportCard
          onClose={closeReport}
          type="message"
          entityId={id.toString()}
          reportedId={item?.receiverId || ""}
        />
      )}
      {isBlock && (
        <Format
          onClose={closeBlock}
          content="with"
          label="Block"
          userName={item?.userName || ""}
          onConfirmBlock={handleBlockChat}
          type="block"
        />
      )}
      {isDelete && (
        <Format
          onClose={closeDelete}
          content="remove chat with"
          label="Remove"
          userName={item?.userName || ""}
          onConfirmDelete={handleDeleteChat} // Thêm hàm gọi API xóa vào đây
          type="delete"
        />
      )}
      {isNoNotification && (
        <Format
          onClose={closeNoNotification} // Function to close the notification when triggered
          content="Disable notifications for chat with" // The content of the notification
          label="Disable Notifications" // The label or title for the notification
          userName={item?.userName || ""} // The username, defaults to an empty string if not available
          type="disableNotifications" // The type of notification, used in your logic within Format
        />
      )}
    </div>
  );
};
export default RightSide;
