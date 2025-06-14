import React from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
// EndCallMessageCard component
interface EndCallMessageCardProps {
  message: string;
  timestamp?: string;
  isSender: boolean;
  duration?: string;
}

export const EndCallMessageCard: React.FC<
  EndCallMessageCardProps & {
    createAvatar?: string;
    createName?: string;
    showName?: boolean;
  }
> = ({
  message,
  timestamp,
  isSender,
  duration,
  createAvatar,
  createName,
  showName = false,
}) => {
  // Extract duration from message if not provided as prop
  const extractedDuration = React.useMemo(() => {
    if (duration) return duration;

    // Match pattern: //Cuoc goi ket thuc; time: xx:xx
    const timeMatch = message.match(/time:\s*(\d{1,2}:\d{2})/i);
    return timeMatch ? timeMatch[1] : "0:00";
  }, [message, duration]);

  return (
    <div
      className={`flex flex-col ${isSender ? "items-end" : "items-start"} mb-4`}
    >
      {/* Show sender name for group chats */}
      {!isSender && showName && (
        <p className="text-[8px] ml-[55px]">{createName}</p>
      )}

      <div className="flex items-start gap-2">
        {/* Avatar for non-sender */}
        {!isSender && (
          <div className="w-[45px] h-[45px]">
            <Image
              src={createAvatar || "/assets/images/default-user.png"}
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full object-cover"
              style={{ objectFit: "cover", width: "45px", height: "45px" }}
            />
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`max-w-sm p-3 rounded-xl ${
            isSender
              ? "bg-primary-100 text-white rounded-br-none"
              : "bg-gray-200 text-black rounded-bl-none"
          }`}
        >
          {/* Call end content */}
          <div className="flex items-center space-x-3">
            {/* Icon container */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isSender ? "bg-white/20" : "bg-red-50"
              }`}
            >
              <Icon
                icon="material-symbols:call-end"
                className={isSender ? "text-white" : "text-red-500"}
                width={16}
                height={16}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div
                className={`font-medium text-sm ${isSender ? "text-white" : "text-gray-800"}`}
              >
                Cuộc gọi đã kết thúc
              </div>
              <div
                className={`text-xs mt-0.5 ${isSender ? "text-white/70" : "text-gray-500"}`}
              >
                {extractedDuration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      {timestamp && (
        <span className="text-xs text-gray-500 mt-1 ml-14">{timestamp}</span>
      )}
    </div>
  );
};
