import { ChatProvider } from "@/context/ChatContext";
import React from "react";

const noChats = () => {
  return (
    <div className="flex w-full items-center justify-center text[24px] ">
      <p>No Chat</p>
    </div>
  );
};

export default noChats;
