import React, { useEffect, useState } from "react";
import { getNotifications } from "@/lib/services/notification.service";
import NameCard from "@/components/cards/other/NameCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import NotificationCard from "@/components/cards/notification/NotificationCard";
import { NotificationResponseDTO } from "@/dtos/NotificationDTO";
import { pusherClient } from "@/lib/pusher";

const Notification = ({ closeDrawer }: any) => {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    []
  );
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    const channelName = `notifications-${userId}`;
    const notificationChannel = pusherClient.subscribe(channelName);

    const handleNewNotification = (data: any) => {
      const newNotification = {
        ...data.notification,
        senderId: data.sender,
      };

      setNotifications((prev) => {
        if (
          prev.some((notification) => notification._id === newNotification._id)
        ) {
          return prev;
        }
        return [newNotification, ...prev];
      });
    };

    const handleDeletedNotification = (data: any) => {
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== data.notificationId)
      );
    };

    notificationChannel.bind("new-notification", handleNewNotification);
    notificationChannel.bind("notification-deleted", handleDeletedNotification);

    return () => {
      notificationChannel.unbind("new-notification", handleNewNotification);
      notificationChannel.unbind(
        "notification-deleted",
        handleDeletedNotification
      );
      pusherClient.unsubscribe(channelName);
    };
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getNotifications(token);

        if (isMounted) {
          const sortedNotifications = res
            .filter(
              (notification: any) =>
                ![
                  "report_post",
                  "report_user",
                  "report_comment",
                  "report_message",
                ].includes(notification.type)
            )
            .sort(
              (a: any, b: any) =>
                new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
            );
          setNotifications(sortedNotifications);
        }
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mr-10">
        <NameCard name="Notifications" />
        <Icon
          icon="mingcute:close-line"
          className="text-dark100_light100 text-[20px]"
          onClick={closeDrawer}
        />
      </div>
      <div className="px-10 py-5 flex flex-col gap-[15px]">
        <span className="text-[14px] font-semibold text-dark100_light100">
          Recently
        </span>
        <div className="flex h-screen flex-col space-y-[14px] overflow-auto custom-scrollbar">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              setNotifications={setNotifications}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 100, 100, 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(80, 80, 80, 1);
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(230, 230, 230, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Notification;
