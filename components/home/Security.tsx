import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Security = () => {
  return (
    <div className="text-dark100_light500 background-light700_dark300 flex h-full w-11/12 flex-col gap-8 pr-4 text-xs font-thin md:text-sm">
      <div className="flex items-center justify-between">
        <p className="whitespace-normal">
          Người có thể xem thông tin cá nhân của bạn
        </p>
        <Menubar className="text-dark100_light500 relative border-none bg-transparent text-xs shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="mb-5 flex cursor-pointer items-center gap-2 text-primary-100">
              <p className="whitespace-nowrap"> Bạn bè</p>

              <FontAwesomeIcon icon={faCaretDown} />
            </MenubarTrigger>
            <MenubarContent className="text-dark100_light500 bg-gray-50  dark:bg-neutral-800">
              <MenubarItem className="cursor-pointer whitespace-nowrap hover:bg-primary-100 hover:text-white">
                Mọi người
              </MenubarItem>
              <MenubarItem className="cursor-pointer whitespace-nowrap hover:bg-primary-100 hover:text-white">
                Chỉ mình tôi
              </MenubarItem>
              <MenubarSeparator />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="flex items-center justify-between">
        <p className="whitespace-normal">Người có thể xem bài đăng của bạn</p>
        <Menubar className="relative border-none text-xs shadow-none  dark:bg-transparent">
          <MenubarMenu>
            <MenubarTrigger className="mb-5  flex cursor-pointer items-center gap-2 text-primary-100">
              <p className=" whitespace-nowrap"> Bạn bè</p>

              <FontAwesomeIcon icon={faCaretDown} />
            </MenubarTrigger>
            <MenubarContent className="  text-dark100_light500 bg-gray-50 dark:bg-neutral-800 ">
              <MenubarItem className="w-full  cursor-pointer whitespace-nowrap px-4 hover:bg-primary-100 hover:text-white">
                Mọi người
              </MenubarItem>
              <MenubarItem className="w-full cursor-pointer whitespace-nowrap px-4 hover:bg-primary-100 hover:text-white">
                Chỉ mình tôi
              </MenubarItem>
              <MenubarSeparator />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Security;
