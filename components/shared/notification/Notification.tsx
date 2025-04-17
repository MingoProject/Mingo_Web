import React, { useEffect, useState } from "react";
import { getNotifications } from "@/lib/services/notification.service";
import { useAuth } from "@/context/AuthContext";
import NameCard from "@/components/cards/other/NameCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UserBasicInfo } from "@/dtos/UserDTO";
import NotificationCard from "@/components/cards/notification/NotificationCard";
import { NotificationResponseDTO } from "@/dtos/NotificationDTO";

const Notification = ({ closeDrawer }: any) => {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    []
  );

  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
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
                  new Date(b.createAt).getTime() -
                  new Date(a.createAt).getTime()
              );
            setNotifications(sortedNotifications);
          }
        }
      } catch (err) {
        console.error(err);
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
          className="text-dark100_light100  text-[20px]"
          onClick={closeDrawer}
        />
      </div>
      <div className="px-10 py-5 flex flex-col gap-[15px]">
        <span className=" text-[14px] font-semibold text-dark100_light100">
          Recently
        </span>
        <div>
          <div className="flex h-screen  flex-col space-y-[14px] overflow-auto custom-scrollbar">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                setNotifications={setNotifications}
              />
            ))}
          </div>
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
