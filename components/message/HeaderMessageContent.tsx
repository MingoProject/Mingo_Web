"use client";
import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react";
import {
  faPhone,
  faVideo,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const HeaderMessageContent = () => {
  return (
    <div className="w-full border-b border-gray-200 flex px-4">
      <div className="text-dark100_light500 flex w-full items-center justify-between py-2 hover:bg-primary-100/20">
        <div className="flex w-full items-center gap-3">
          <div className="relative">
            <Image
              src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full"
            />
          </div>
          <div className="hidden w-2/3  text-xs md:flex md:flex-col">
            <span className="text-base font-semibold">Huỳnh Nguyễn</span>
            <span className="truncate text-xs  text-border-color">
              Hoạt động 16 phút trước
            </span>
          </div>
        </div>
      </div>
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
          className="text-primary-100"
        />
      </div>
    </div>
  );
};

export default HeaderMessageContent;
