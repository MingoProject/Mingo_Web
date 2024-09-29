"use client";
import Link from "next/link";
import React, { useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faBell,
  faMessage,
  faFloppyDisk,
  faGear,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";
import { Button } from "@/components/ui/button";
import ViewProfile from "@/components/home/ViewProfile";
import Setting from "@/components/home/Setting";
import Favorite from "@/components/home/Favorite";
import { PostYouLike } from "@/lib/data/data";
import Save from "@/components/home/Save";

const Navbar = () => {
  const [isSetting, setIsSetting] = useState(false);
  const [isViewProfile, setIsViewProfile] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSave, setIsSave] = useState(false);

  const handleIsSetting = () => {
    setIsSetting(true);
  };

  const closeSetting = () => {
    setIsSetting(false);
  };

  const handleIsViewProfile = () => {
    setIsViewProfile(true);
  };

  const closeViewProfile = () => {
    setIsViewProfile(false);
  };

  const handleIsFavorite = () => {
    setIsFavorite(true);
  };

  const closeFavorite = () => {
    setIsFavorite(false);
  };

  const handleIsSave = () => {
    setIsSave(true);
  };

  const closeSave = () => {
    setIsSave(false);
  };
  return (
    <nav className="flex-between background-light700_dark300 fixed z-50 w-full gap-5 p-6 sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <p className="text-dark100_light500 text-2xl">
          Min<span className="text-2xl text-primary-100 ">gle</span>
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
      </Link>
      <div className="hidden w-auto  sm:flex">
        <Link href="/" className="mr-16 md:mr-20">
          <FontAwesomeIcon
            icon={faHouse}
            className="text-2xl text-light-500 "
          />
        </Link>
        <Link href="/" className="mr-16 md:mr-20">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-2xl text-light-500 "
          />
        </Link>
        <Link href="/" className="mr-16 md:mr-20">
          <FontAwesomeIcon icon={faBell} className="text-2xl text-light-500 " />
        </Link>
        <Link href="/" className="">
          <FontAwesomeIcon
            icon={faMessage}
            className="text-2xl text-light-500 "
          />
        </Link>
      </div>
      <div className="flex-between w-auto">
        <Theme />
        <Link href="/" className="mr-3 text-primary-100 ">
          <p className="hidden md:block">Huỳnh Nguyễn</p>
        </Link>
        <Menubar className="relative border-none  bg-transparent shadow-none">
          <MenubarMenu>
            <MenubarTrigger>
              {" "}
              <Image
                src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
                alt="Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
            </MenubarTrigger>
            <MenubarContent className="mt-2 h-auto w-48 bg-gray-50 px-4 font-sans text-sm hover:border-none">
              <MenubarItem
                onClick={handleIsViewProfile}
                className="mb-4 cursor-pointer pt-4 "
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
                    alt="Avatar"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-xs font-normal">
                    Xem trang cá nhân
                  </p>
                </div>
              </MenubarItem>
              <MenubarItem
                onClick={handleIsSetting}
                className="cursor-pointer pb-4"
              >
                {" "}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGear} className="text-light-500" />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-xs">
                    Cài đặt
                  </p>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={handleIsSave}
                className="cursor-pointer pb-4"
              >
                {" "}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    className="text-light-500"
                  />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-xs">
                    Bài viết đã lưu
                  </p>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={handleIsFavorite}
                className="cursor-pointer pb-4"
              >
                {" "}
                <div className="flex items-center gap-2 ">
                  <FontAwesomeIcon icon={faHeart} className="text-light-500" />
                  <p className="text-ellipsis whitespace-nowrap font-sans text-xs">
                    Bài viết đã thích
                  </p>
                </div>
              </MenubarItem>
              <MenubarItem className="cursor-pointer pb-4">
                {" "}
                <Button className="h-[30px] w-full bg-primary-100 text-center text-sm text-white">
                  Đăng xuất
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <div className="flex w-auto  sm:hidden">
          <MobileNav />
        </div>
        {isViewProfile && <ViewProfile onClose={closeViewProfile} />}
        {isSetting && <Setting onClose={closeSetting} />}
        {isFavorite && <Favorite posts={PostYouLike} onClose={closeFavorite} />}
        {isSave && <Save posts={PostYouLike} onClose={closeSave} />}
      </div>
    </nav>
  );
};

export default Navbar;
