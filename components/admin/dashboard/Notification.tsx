import NotificationCard from "@/components/cards/NotificationCard";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const fakeNotification = [
  {
    id: "1",
    content: "You have a new report waiting for approval",
    status: 1,
  },
  {
    id: "2",
    content: "You have a new report waiting for approval",
    status: 1,
  },
  {
    id: "3",
    content: "You have a new report waiting for approval",
    status: 1,
  },
  {
    id: "4",
    content: "You have a new report waiting for approval",
    status: 1,
  },
  {
    id: "5",
    content: "You have a new report waiting for approval",
    status: 1,
  },
];

const Notification = () => {
  return (
    <div className="flex h-64 w-full flex-col">
      <div className="no-scrollbar flex w-full flex-col gap-4 overflow-auto">
        <p className="flex items-center gap-4 border-b border-gray-300 pb-1">
          <FontAwesomeIcon icon={faBell} className="mb-2" />
          <span className="text-[24px]">Recent notification</span>
        </p>
        <div className=" flex w-full flex-col gap-2">
          {fakeNotification.map((item) => (
            <NotificationCard
              content={item.content}
              status={item.status}
              key={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
