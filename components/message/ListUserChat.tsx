import React from "react";
import { ListUserChatData } from "@/lib/data/data";
import ListUserChatCard from "../cards/ListUserChatCard";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListUserChat = () => {
  return (
    <div className="flex size-full flex-col">
      <Menubar className="relative border-none bg-transparent py-4 shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-2">
            <span className="ml-1 text-base font-semibold">Đoạn chat</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </MenubarTrigger>
          <MenubarContent className="text-dark100_light500 background-light700_dark300 absolute top-full z-50 ml-20 mt-2 h-auto w-40  font-sans text-sm shadow-md">
            <MenubarItem className="mb-4 flex w-full cursor-pointer items-center justify-center text-center hover:bg-primary-100 hover:text-white  ">
              <p className="p-1 pt-2">Tin nhắn đang chờ</p>
            </MenubarItem>
            <MenubarItem className="flex w-full cursor-pointer items-center justify-center text-center hover:bg-primary-100 hover:text-white ">
              <p className="p-1 pb-2">Lưu trữ đoạn chat</p>
            </MenubarItem>
            <MenubarSeparator />
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="h-[75vh] w-full">
        {ListUserChatData.map((item) => (
          <ListUserChatCard key={item.id} itemChat={item} />
        ))}
      </div>
    </div>
  );
};

export default ListUserChat;
