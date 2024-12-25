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
import { getMyProfile } from "@/lib/services/user.service";
import { useChatContext } from "@/context/ChatContext";

const HeaderMessageContent = ({
  item,
  toggleRightSide,
}: {
  item: ItemChat | null;
  toggleRightSide: () => void;
}) => {
  const { isOnlineChat, setIsOnlineChat } = useChatContext();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (item) {
          const data = await getMyProfile(item?.receiverId?.toString() || "");
          setIsOnlineChat((prevState) => ({
            ...prevState,
            [item?.receiverId?.toString() || ""]: data.userProfile.status,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [item, item?.receiverId]);
  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-900 flex px-4">
      <div className="text-dark100_light500 flex w-full items-center justify-between py-2">
        <div className="flex w-full items-center gap-3">
          {item && (
            <>
              {/* Hiển thị thông tin từ `item` */}
              <div className="relative">
                <Image
                  src={item.avatarUrl || "/assets/images/default-user.png"}
                  alt="Avatar"
                  width={45}
                  height={45}
                  className="rounded-full object-cover"
                  style={{ objectFit: "cover", width: "45px", height: "45px" }}
                />
                {isOnlineChat[item.receiverId || ""] && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                )}
              </div>
              <span className="text-[18px] font-semibold self-center">
                {item.groupName}
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
