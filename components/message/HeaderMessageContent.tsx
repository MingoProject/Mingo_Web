"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { ItemChat } from "@/dtos/MessageDTO";
import { FindUserDTO } from "@/dtos/UserDTO";

const HeaderMessageContent = ({
  item,
  // user,
  toggleRightSide,
}: {
  item: ItemChat | null;
  // user: FindUserDTO | null;
  toggleRightSide: () => void;
}) => {
  if (!item) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-gray-200 flex px-4">
      <div className="text-dark100_light500 flex w-full items-center justify-between py-2">
        <div className="flex w-full items-center gap-3">
          {item && (
            <>
              {/* Hiển thị thông tin từ `item` */}
              <div className="relative">
                <Image
                  src={item.avatarUrl || "/assets/images/capy.jpg"}
                  alt="Avatar"
                  width={45}
                  height={45}
                  className="rounded-full object-cover"
                  style={{ objectFit: "cover", width: "45px", height: "45px" }}
                />
                {item.status && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                )}
              </div>
              <span className="text-[18px] font-semibold self-center">
                {item.userName}
              </span>
            </>
          )}
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
