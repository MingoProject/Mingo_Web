"use client";
import Image from "next/image";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { ItemChat } from "@/dtos/MessageDTO";

const HeaderMessageContent = ({
  item,
  toggleRightSide,
}: {
  item: ItemChat;
  toggleRightSide: () => void;
}) => {
  return (
    <div className="w-full border-b border-gray-200 flex px-4">
      <div className="text-dark100_light500 flex w-full items-center justify-between py-2">
        <div className="flex w-full items-center gap-3">
          <div className="relative">
            <Image
              src={item.avatarUrl || "/assets/images/capy.jpg"}
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full"
            />
          </div>
          <div className="hidden w-2/3 text-xs md:flex md:flex-col">
            <span className="text-base font-semibold">{item.userName}</span>
            <span className="truncate text-xs text-border-color">
              {item.status}
            </span>
          </div>
        </div>

        {/* Icons */}
        <div className="flex gap-6 self-center">
          <FontAwesomeIcon
            icon={faPhone}
            size="xl"
            className="text-primary-100"
          />
          <FontAwesomeIcon
            icon={faVideo}
            size="xl"
            className="text-primary-100"
          />
          <FontAwesomeIcon
            icon={faCircleInfo}
            size="xl"
            className="text-primary-100 cursor-pointer"
            onClick={toggleRightSide} // Gọi hàm toggle
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderMessageContent;
