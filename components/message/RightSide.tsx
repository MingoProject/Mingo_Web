"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Format from "../cards/FormatCard";
import SearchMessage from "./SearchMessage";
import ImagesMedia from "./ImagesMedia";
import File from "./File";
import { ItemChat } from "@/dtos/MessageDTO";

const RightSide = ({ item }: { item: ItemChat }) => {
  const [isReport, setIsReport] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isNoNotification, setIsNoNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const handleIsReport = () => {
    setIsReport(true);
  };

  const closeReport = () => {
    setIsReport(false);
  };

  const handleIsBlock = () => {
    setIsBlock(true);
  };

  const closeBlock = () => {
    setIsBlock(false);
  };

  const handleIsDelete = () => {
    setIsDelete(true);
  };

  const closeDelete = () => {
    setIsDelete(false);
  };

  const handleIsNoNotification = () => {
    setIsNoNotification(true);
  };

  const closeNoNotification = () => {
    setIsNoNotification(false);
  };

  const resetActiveTab = () => {
    setActiveTab(""); // hoặc bạn có thể đặt lại thành một giá trị khác nếu cần
  };

  const RenderTag = () => {
    switch (activeTab) {
      case "search":
        return <SearchMessage onCancel={resetActiveTab} />;
      case "media":
        return <ImagesMedia onCancel={resetActiveTab} />;
      case "file":
        return <File onCancel={resetActiveTab} />;
      default:
        return (
          <>
            <div className="h-[45px] w-full border-b border-gray-200 px-8">
              <p className="text-lg">Chi tiết</p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
              <Image
                src={item.avatarUrl || "/assets/images/capy.jpg"}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full"
              />
              <p className="text-lg">{item.userName}</p>
            </div>
            <div className="flex items-center px-8 ">
              <ul>
                <li
                  onClick={() => setActiveTab("search")}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="iconamoon:search-thin"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Tìm kiếm tin nhắn
                  </p>
                </li>
                <li
                  onClick={() => setActiveTab("media")}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="system-uicons:picture"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Phương tiện
                  </p>
                </li>
                <li
                  onClick={() => setActiveTab("file")}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="bx:file"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    File
                  </p>
                </li>
                <li
                  onClick={handleIsNoNotification}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="ion:notifications-off-outline"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Tắt thông báo
                  </p>
                </li>
                <li
                  onClick={handleIsReport}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="material-symbols:report-outline"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Báo cáo
                  </p>
                </li>
                <li
                  onClick={handleIsBlock}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="material-symbols:block"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Chặn
                  </p>
                </li>
                <li
                  onClick={handleIsDelete}
                  className="mt-6 flex cursor-pointer items-center gap-2 text-base"
                >
                  <Icon
                    icon="material-symbols:delete-outline"
                    width={20}
                    height={20}
                    className="text-gray-500 dark:text-white"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-base">
                    Xóa đoạn chat
                  </p>
                </li>
              </ul>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex w-full flex-col py-4">
      {RenderTag()}
      {isReport && (
        <Format
          onClose={closeReport}
          content="báo cáo"
          label="Báo cáo"
          userName={item.userName}
        />
      )}
      {isBlock && (
        <Format
          onClose={closeBlock}
          content="chặn"
          label="Chặn"
          userName={item.userName}
        />
      )}
      {isDelete && (
        <Format
          onClose={closeDelete}
          content="xóa đoạn chat với"
          label="Xóa"
          userName={item.userName}
        />
      )}
      {isNoNotification && (
        <Format
          onClose={closeNoNotification}
          content="tắt thông báo đoạn chat với"
          label="Tắt thông báo"
          userName={item.userName}
        />
      )}
    </div>
  );
};

export default RightSide;
