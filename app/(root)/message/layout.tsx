// app/message/layout.tsx
"use client";
import React from "react";
import MessageSearch from "@/components/message/MessageSearch";
import ListUserChat from "@/components/message/ListUserChat";
import { ChatItemProvider } from "@/context/ChatItemContext";
import { SocketProvider } from "@/providers/SocketProvider";
import CallNotification from "@/components/message/CallNotification";
import { VideoCall } from "@/components/message/VideoCall";
import { AudioCall } from "@/components/message/AudioCall";
import { useSocket } from "@/context/SocketContext";

const MessageLayout = ({ children }: { children: React.ReactNode }) => {
  // const { ongoingCall } = useSocket();

  return (
    <ChatItemProvider>
      <div className="text-dark100_light500 background-light700_dark300 flex w-full h-[98vh] border-t border-gray-200 pt-[84px] text-xs md:text-sm">
        {/* Phần bên trái cố định */}
        <div className="no-scrollbar h-full text-dark100_light500 background-light700_dark300 flex w-2/5 flex-col gap-2 overflow-y-auto px-4 lg:w-1/5">
          <ListUserChat />
          {/* <CallNotification /> */}
          {/* Chỉ hiển thị 1 trong 2 component */}
          {/* {ongoingCall?.isVideoCall ? <VideoCall /> : <AudioCall />} */}

          {/* <VideoCall /> */}
          {/* <AudioCall /> */}
        </div>

        {/* Phần bên phải, thay đổi theo [id] */}
        <div className="flex h-full w-4/5 border-l border-r dark:border-gray-900">
          {children}
        </div>
      </div>
    </ChatItemProvider>
  );
};

export default MessageLayout;
