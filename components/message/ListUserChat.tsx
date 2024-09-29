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
import Image from "next/image";
import {
  faChevronDown,
  faFilePdf,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListUserChat = () => {
  return (
    <div className="flex size-full flex-col">
      <Menubar className="relative border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-2">
            <span className="ml-1 text-base font-semibold">Đoạn chat</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </MenubarTrigger>
          <MenubarContent className="absolute top-full mt-2 ml-20 h-auto w-40 bg-gray-50 shadow-md  font-sans text-sm z-50">
            <MenubarItem className="flex justify-center items-center hover:bg-primary-100 text-center hover:opacity-80 hover:text-white w-full mb-4 cursor-pointer ">
              <p className="p-1 pt-2">Tin nhắn đang chờ</p>
            </MenubarItem>
            <MenubarItem className="flex justify-center items-center hover:bg-primary-100 text-center hover:opacity-80 hover:text-white w-full cursor-pointer">
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
