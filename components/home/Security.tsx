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
    <div className="flex h-full w-11/12 flex-col gap-8 pr-4 text-sm font-thin">
      <div className="flex items-center justify-between">
        <p className="whitespace-normal">
          Người có thể xem thông tin cá nhân của bạn
        </p>
        <Menubar className="relative border-none bg-transparent text-xs shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="mb-5 flex items-center gap-2 text-primary-100">
              <p className="whitespace-nowrap"> Bạn bè</p>

              <FontAwesomeIcon icon={faCaretDown} />
            </MenubarTrigger>
            <MenubarContent className="bg-gray-50">
              <MenubarItem className="whitespace-nowrap">Mọi người</MenubarItem>
              <MenubarItem className="whitespace-nowrap">
                Chỉ mình tôi
              </MenubarItem>
              <MenubarSeparator />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="flex items-center justify-between">
        <p className="whitespace-normal">Người có thể xem bài đăng của bạn</p>
        <Menubar className="relative border-none bg-transparent text-xs shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="mb-5 flex items-center gap-2 text-primary-100">
              <p className="whitespace-nowrap"> Bạn bè</p>

              <FontAwesomeIcon icon={faCaretDown} />
            </MenubarTrigger>
            <MenubarContent className="bg-gray-50">
              <MenubarItem className="whitespace-nowrap">Mọi người</MenubarItem>
              <MenubarItem className="whitespace-nowrap">
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
