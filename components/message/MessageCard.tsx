"use client";
import { ResponseMessageDTO } from "@/dtos/MessageDTO";
import { format, isSameDay } from "date-fns";
import Image from "next/image";
import React from "react";

const MessageCard = ({
  chat,
  previousChat,
}: {
  chat: ResponseMessageDTO;
  previousChat?: ResponseMessageDTO;
}) => {
  const isSender = chat.createBy === localStorage.getItem("userId");

  // Kiểm tra nếu ngày tin nhắn khác ngày trước đó
  const isNewDay =
    !previousChat ||
    !isSameDay(new Date(chat.createAt), new Date(previousChat.createAt));

  // Kiểm tra nếu contentId có file
  const hasFiles = chat.contentId && chat.contentId.length > 0;

  return (
    <>
      {/* Hiển thị phân cách ngày chỉ khi tin nhắn có ngày khác với ngày trước đó */}
      {isNewDay && (
        <div className="my-4 text-center text-sm text-gray-500">
          {format(new Date(chat.createAt), "dd/MM/yyyy")}
        </div>
      )}

      <div
        className={`flex flex-col ${isSender ? "items-end" : "items-start"} mb-4`}
      >
        <div className="flex items-start gap-2">
          {/* Avatar hiển thị nếu không phải sender */}
          {!isSender && (
            <Image
              src="/assets/images/capy.jpg" // Avatar mặc định
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full"
            />
          )}
          <div
            className={`max-w-sm p-3 rounded-xl ${
              isSender
                ? "bg-primary-100 text-white rounded-br-none"
                : "bg-gray-200 text-black rounded-bl-none"
            }`}
          >
            {/* Hiển thị text nếu không có file */}
            {!hasFiles &&
              chat.text?.map((text, index) => (
                <p key={index} className="text-sm">
                  {text}
                </p>
              ))}

            {/* Hiển thị file nếu contentId có dữ liệu */}
            {hasFiles &&
              chat.contentId.map((file, index) => (
                <div key={index} className="my-2">
                  {file.type === "Image" ? (
                    <Image
                      src={file.url} // URL của file ảnh
                      alt={file.fileName || "Image"}
                      width={file.width ? parseInt(file.width) : 300}
                      height={file.height ? parseInt(file.height) : 300}
                      className="rounded-lg"
                    />
                  ) : (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-200 underline text-sm"
                      download={file.fileName || true} // Tên file tải xuống hoặc sử dụng tên mặc định
                    >
                      {file.fileName || "Download File"}
                    </a>
                  )}
                </div>
              ))}
          </div>
        </div>
        {/* Hiển thị thời gian gửi */}
        {chat.createAt && (
          <span className="text-xs text-gray-500 mt-1 ml-14">
            {format(new Date(chat.createAt), "HH:mm")}
          </span>
        )}
      </div>
    </>
  );
};

export default MessageCard;
