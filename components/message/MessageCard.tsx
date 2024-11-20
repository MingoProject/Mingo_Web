"use client";
import Image from "next/image";
import React from "react";

interface MessageCardProps {
  mess: string; // Nội dung tin nhắn
  isSender: boolean; // Xác định là tin nhắn gửi (true) hay nhận (false)
  timestamp?: string; // Thời gian gửi tin nhắn (tùy chọn)
  avatarUrl?: string; // Avatar của người gửi hoặc người nhận (tùy chọn)
}

const MessageCard: React.FC<MessageCardProps> = ({
  mess,
  isSender,
  timestamp,
  avatarUrl,
}) => {
  return (
    <div
      className={`flex flex-col ${isSender ? "items-end" : "items-start"} mb-4`}
    >
      <div className="flex items-start gap-2">
        {/* Hiển thị avatar cho người nhận hoặc người gửi */}
        {!isSender && avatarUrl && (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={45}
            height={45}
            className="rounded-full"
          />
        )}
        <div
          className={`max-w-sm p-3 rounded-xl ${isSender ? "bg-primary-100 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"}`}
        >
          <p className="text-sm">{mess}</p>
        </div>
      </div>
      {timestamp && (
        <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
      )}
    </div>
  );
};

export default MessageCard;
