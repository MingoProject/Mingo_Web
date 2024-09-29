import HeaderMessageContent from "@/components/message/HeaderMessageContent";
import ListUserChat from "@/components/message/ListUserChat";
import MessageSearch from "@/components/message/MessageSearch";
import RightSide from "@/components/message/RightSide";
import React from "react";

const page = () => {
  return (
    <div className=" flex size-full border-t border-gray-200 pt-[86px] text-xs text-light-500 dark:text-white md:text-sm">
      <div className="no-scrollbar flex h-full w-1/5 flex-col gap-2 overflow-y-auto bg-white px-4">
        <MessageSearch />
        <ListUserChat />
      </div>

      <div className="flex h-full w-3/5 flex-col ">
        <HeaderMessageContent />
      </div>

      <div className="h-full w-1/5 flex-col gap-2 overflow-y-auto bg-white ">
        <RightSide />
      </div>
    </div>
  );
};

export default page;
