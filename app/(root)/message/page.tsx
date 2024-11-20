import BodyMessage from "@/components/message/BodyMessage";
import FooterMessage from "@/components/message/FooterMessage";
import HeaderMessageContent from "@/components/message/HeaderMessageContent";
import ListUserChat from "@/components/message/ListUserChat";
import MessageSearch from "@/components/message/MessageSearch";
import RightSide from "@/components/message/RightSide";
import React from "react";

const page = () => {
  return (
    <div className=" text-dark100_light500 background-light700_dark300 flex w-full h-[98vh] border-t border-gray-200 pt-[84px] text-xs  md:text-sm ">
      <div className="no-scrollbar h-full text-dark100_light500 background-light700_dark300 flex w-2/5 flex-col gap-2 overflow-y-auto px-4  lg:w-1/5">
        <MessageSearch />
        <ListUserChat />
      </div>

      <div className="flex h-full w-3/5 flex-col border-r border-l ">
        <HeaderMessageContent />
        <BodyMessage />
        <FooterMessage />
      </div>
      <div className="text-dark100_light500 h-full hidden  w-1/5 flex-col gap-2 overflow-y-auto lg:block ">
        <RightSide />
      </div>
    </div>
  );
};

export default page;
