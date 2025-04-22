import Button from "@/components/ui/button";
import { NotificationResponseDTO } from "@/dtos/NotificationDTO";
import {
  acceptAddFriend,
  unfollowOrRefuseFriendRequest,
} from "@/lib/services/friend.service";
import {
  createNotification,
  deleteNotification,
  getNotification,
} from "@/lib/services/notification.service";
import React from "react";

interface FriendRequestActionProps {
  senderId: string;
  receiverId: string;
  setNotifications?: React.Dispatch<
    React.SetStateAction<NotificationResponseDTO[]>
  >;
}

const FriendRequestAction: React.FC<FriendRequestActionProps> = ({
  senderId,
  receiverId,
  setNotifications,
}: FriendRequestActionProps) => {
  const handleRefuseFriend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      const notification = await getNotification(
        senderId,
        receiverId,
        "friend_request"
      );

      if (!notification || !notification._id) {
        console.warn("Không tìm thấy thông báo cần xoá.");
        return;
      }

      await unfollowOrRefuseFriendRequest(
        {
          sender: senderId,
          receiver: receiverId,
        },
        token
      );

      await deleteNotification(notification._id, token);

      setNotifications?.((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notification._id)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  const handleAcceptFriend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      const notification = await getNotification(
        senderId,
        receiverId,
        "friend_request"
      );

      if (!notification || !notification._id) {
        console.warn("Không tìm thấy thông báo cần xoá.");
        return;
      }

      await acceptAddFriend(
        {
          sender: senderId,
          receiver: receiverId,
        },
        token
      );

      await createNotification(
        {
          senderId: receiverId,
          receiverId: senderId,
          type: "friend_accept",
        },
        token
      );

      await deleteNotification(notification._id, token);

      setNotifications?.((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notification._id)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "An error has occurred");
    }
  };
  return (
    <div className="flex gap-3">
      <Button
        title="Accept"
        size="small"
        onClick={() => handleAcceptFriend()}
      />
      <Button
        title="Decline"
        size="small"
        color="transparent"
        border="border border-border-100"
        fontColor="text-dark100_light100"
        onClick={() => handleRefuseFriend()}
      />
    </div>
  );
};

export default FriendRequestAction;
