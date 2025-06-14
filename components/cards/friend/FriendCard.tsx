import FriendRequestAction from "@/components/shared/friend/FriendRequestAction";
import Button from "@/components/ui/button";
import { FriendResponseDTO } from "@/dtos/FriendDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import {
  unblock,
  unfollowOrRefuseFriendRequest,
} from "@/lib/services/friend.service";
import {
  deleteNotification,
  getNotification,
} from "@/lib/services/notification.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FriendCardProps {
  friend: FriendResponseDTO;
  profileBasic: UserBasicInfo;
  activeTabFriend: string;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  profileBasic,
  activeTabFriend,
}) => {
  const handleUnblock = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await unblock(
        {
          sender: profileBasic._id,
          receiver: friend._id,
        },
        token
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await unfollowOrRefuseFriendRequest(
        {
          sender: profileBasic._id,
          receiver: friend._id,
        },
        token
      );
      try {
        const notification = await getNotification(
          profileBasic._id,
          friend._id,
          "friend_request"
        );
        await deleteNotification(notification._id, token);
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link href={`/profile/${friend._id}`}>
        <Image
          width={50}
          height={50}
          src={
            friend?.avatar ||
            "/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"
          }
          alt={friend.lastName}
          className="size-[50px] rounded-full object-cover"
        />
      </Link>

      <div className="flex-1">
        <div className="font-medium text-4">
          {friend.firstName} {friend.lastName}
        </div>
      </div>

      {activeTabFriend !== "follower" && (
        <div className="ml-auto flex gap-2">
          {activeTabFriend === "blocked" && (
            <Button
              title="Unblock"
              size="small"
              onClick={() => handleUnblock()}
            />
          )}
          {activeTabFriend === "following" && (
            <Button
              title="Unfollow"
              size="small"
              onClick={() => handleUnfollow()}
            />
          )}
          {(activeTabFriend === "friend" ||
            activeTabFriend === "bestfriend") && (
            <div className="px-[7px] py-[7px] background-light400_dark400 rounded-full">
              <Icon
                icon="mynaui:message-dots"
                className="text-primary-100 size-[20px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendCard;
