import Button from "@/components/ui/button";
import { NotificationResponseDTO } from "@/dtos/NotificationDTO";
import {
  acceptAddBff,
  unrequestBffOrRefuseBffRequest,
} from "@/lib/services/friend.service";
import {
  createNotification,
  deleteNotification,
  getNotification,
} from "@/lib/services/notification.service";
import React from "react";

interface BffRequestActionProps {
  senderId: string;
  receiverId: string;
  setNotifications?: React.Dispatch<
    React.SetStateAction<NotificationResponseDTO[]>
  >;
}

const BffRequestAction: React.FC<BffRequestActionProps> = ({
  senderId,
  receiverId,
  setNotifications,
}: BffRequestActionProps) => {
  const handleRefuseBff = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      // Tìm notification BFF request
      const notification = await getNotification(
        senderId,
        receiverId,
        "bff_request"
      );

      if (!notification || !notification._id) {
        console.warn("Không tìm thấy thông báo cần xoá.");
        return;
      }

      await unrequestBffOrRefuseBffRequest(
        {
          sender: senderId,
          receiver: receiverId,
        },
        token
      );

      await deleteNotification(notification._id, token);

      setNotifications?.((prev) =>
        prev.filter((notif) => notif._id !== notification._id)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  const handleAcceptBff = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      // Tìm notification BFF request
      const notification = await getNotification(
        senderId,
        receiverId,
        "bff_request"
      );

      if (!notification || !notification._id) {
        console.warn("Không tìm thấy thông báo cần xoá.");
        return;
      }

      await acceptAddBff(
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
          type: "bff_accept",
        },
        token
      );

      await deleteNotification(notification._id, token);

      setNotifications?.((prev) =>
        prev.filter((notif) => notif._id !== notification._id)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="flex gap-3 mt-2">
      <Button title="Accept" size="small" onClick={() => handleAcceptBff()} />
      <Button
        title="Decline"
        size="small"
        color="transparent"
        border="border border-border-100"
        fontColor="text-dark100_light100"
        onClick={() => handleRefuseBff()}
      />
    </div>
  );
};

export default BffRequestAction;
