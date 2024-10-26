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
      <div className=" flex w-full flex-col gap-4 ">
        <p className="flex items-center gap-4 border-b border-gray-300 pb-1">
          <FontAwesomeIcon
            icon={faBell}
            className="text-dark100_light500 mb-2"
          />
          <span className="text-dark100_light500 text-[20px]">
            Recent notification
          </span>
        </p>
        <div className=" no-scrollbar flex h-52 w-full flex-col gap-2 overflow-auto">
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
