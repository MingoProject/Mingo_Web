import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import {
  createNotification,
  deleteNotification,
  getNotifications,
} from "@/lib/services/notification.service";
import { Button } from "@/components/ui/button";
import {
  acceptAddBff,
  acceptAddFriend,
  unfollowOrRefuseFriendRequest,
  unrequestBffOrRefuseBffRequest,
} from "@/lib/services/friend.service";

const getNotificationContent = (notification: any) => {
  switch (notification.type) {
    case "friend_request":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} sent you a friend request.`;
    case "bff_request":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} sent you a BFF request.`;
    case "friend_accept":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} accepted your friend request.`;
    case "bff_accept":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} accepted your BFF request.`;
    case "comment":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} commented on your post.`;
    case "comment_media":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} commented on your media.`;
    case "like":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} liked your post.`;
    case "like_comment":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} liked your comment.`;
    case "like_media":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} liked your media.`;
    case "reply_comment":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} replied to your comment.`;
    case "message":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} sent you a message.`;
    case "tags":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} tagged you in a post.`;
    default:
      return "You have a new notification.";
  }
};

const Notification = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await getNotifications(token);
          console.log("res", res);
          if (isMounted) {
            setNotifications(res);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotification();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefuseBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }
      await unrequestBffOrRefuseBffRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleRefuseFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await unfollowOrRefuseFriendRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await acceptAddFriend(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "friend_accept",
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await acceptAddBff(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "bff_accept",
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <div>
      <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
        Notifications
      </div>
      <div className="mt-4  flex text-primary-100">Recently</div>
      <div className="mt-5 flex h-[650px]  flex-col space-y-4 overflow-y-scroll">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="flex items-center justify-between p-2 "
          >
            <Image
              src={
                notification.senderId.avatar
                  ? notification.senderId.avatar
                  : "/assets/images/capy.jpg"
              }
              alt="Avatar"
              width={50}
              height={50}
              className="size-16 rounded-full object-cover"
            />
            <div className="ml-2 flex-1 pr-4">
              <p className="text-dark100_light500 font-light">
                {getNotificationContent(notification)}
              </p>
              {notification.type === "friend_request" && (
                <div>
                  <Button
                    onClick={() =>
                      handleAcceptFriend(
                        notification.senderId,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className=" rounded-lg bg-primary-100 px-4 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() =>
                      handleRefuseFriend(
                        notification.senderId,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className="background-light800_dark400 text-dark100_light500 ml-3 rounded-lg px-4 "
                  >
                    Refuse
                  </Button>
                </div>
              )}
              {notification.type === "bff_request" && (
                <div className="my-1">
                  <Button
                    onClick={() =>
                      handleAcceptBff(
                        notification.senderId,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className=" rounded-lg bg-primary-100 px-4 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() =>
                      handleRefuseBff(
                        notification.senderId,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className="background-light800_dark400 text-dark100_light500 ml-3 rounded-lg px-4 "
                  >
                    Refuse
                  </Button>
                </div>
              )}
              <p className="text-sm text-gray-500">
                {getTimestamp(notification.createAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
