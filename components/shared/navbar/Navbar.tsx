"use client";
import React, { useState } from "react";
import Link from "next/link";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import { getTimestamp } from "@/lib/utils";
import {
  faGear,
  faFloppyDisk,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import Search from "../search/Search";
export const notifications = [
  {
    id: 1,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "John Doe đã thích bài viết của bạn.",
    createdAt: "2024-09-28T14:35:00Z",
  },
  {
    id: 2,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Alice đã bình luận về bài viết của bạn: 'Thật tuyệt vời!'",
    createdAt: "2024-09-28T13:20:00Z",
  },
  {
    id: 3,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Bob đã gửi cho bạn một lời mời kết bạn.",
    createdAt: "2024-09-28T12:05:00Z",
  },
  {
    id: 4,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Charlie đã chia sẻ bài viết của bạn.",
    createdAt: "2024-09-27T18:15:00Z",
  },
  {
    id: 5,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Diana đã nhắc đến bạn trong một bình luận.",
    createdAt: "2024-09-27T16:45:00Z",
  },
  {
    id: 6,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Eve đã thích ảnh hồ sơ mới của bạn.",
    createdAt: "2024-09-27T15:30:00Z",
  },
];

const Navbar = () => {
  const pathname = usePathname();

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

  // State for handling the right drawer/modal
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(""); // To track if 'search' or 'notifications' is active

  const toggleDrawer = (drawerType: any) => {
    // Open or close the drawer and set the active drawer type
    if (activeDrawer === drawerType) {
      setDrawerOpen(false);
      setActiveDrawer("");
    } else {
      setDrawerOpen(true);
      setActiveDrawer(drawerType);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveDrawer("");
  };

  return (
    <nav className="flex-between background-light700_dark300 fixed z-50 h-[79px] w-full gap-5 border-b p-6 dark:border-transparent sm:px-5">
      <Link href="/" className="flex items-center gap-1">
        <p className="text-dark100_light500 text-3xl">
          Min<span className="text-3xl text-primary-100 ">gle</span>
        </p>
      </Link>

      {/* Sidebar links */}
      <div className="hidden w-auto sm:flex">
        <Sheet>
          {navbarLinks.map((item) => {
            // Check if the route is for a drawer (Search, Notifications) or a regular link
            const isDrawerLink =
              item.route === "/search" || item.route === "/notifications";

            // Modify the active condition to check both the pathname and activeDrawer state for drawer links
            const isActive = isDrawerLink
              ? activeDrawer === item.route // Use activeDrawer for Search and Notifications
              : pathname === item.route; // Use pathname for regular links

            return isDrawerLink ? (
              <div
                key={item.route}
                onClick={() => toggleDrawer(item.route)}
                className={`${
                  isActive
                    ? "background-light600_dark200 text-dark100_light500 rounded-lg"
                    : "text-dark100_light500"
                } ml-[12%] flex h-[43px] cursor-pointer items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Icon className="text-2xl text-light-500" icon={item.icon} />
                {isActive && (
                  <p className={`${isActive ? "font-medium" : "font-medium"}`}>
                    {item.label}
                  </p>
                )}
              </div>
            ) : (
              <SheetClose asChild key={item.route}>
                <Link
                  href={item.route}
                  className={`${
                    isActive
                      ? "background-light600_dark200 text-dark100_light500 rounded-lg"
                      : "text-dark100_light500"
                  } ml-[12%] flex h-[43px] items-center justify-start gap-4 bg-transparent p-4`}
                >
                  <Icon className="text-2xl text-light-500" icon={item.icon} />
                  {isActive && (
                    <p
                      className={`${isActive ? "font-medium" : "font-medium"}`}
                    >
                      {item.label}
                    </p>
                  )}
                </Link>
              </SheetClose>
            );
          })}
        </Sheet>
      </div>

      {/* Right side options */}
      <div className="flex-between w-auto">
        <Theme />
        <Link href="/" className="mr-3 text-primary-100 ">
          <p className="hidden md:block">Huỳnh Nguyễn</p>
        </Link>
        <Menubar className="relative border-none bg-transparent   shadow-none focus:outline-none">
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
            <MenubarContent className="text-dark100_light500 background-light700_dark300 mt-2 h-auto w-52 border-none font-sans text-sm ">
              <MenubarItem className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20  ">
                <Link href="/personal-page" className="">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
                      alt="Avatar"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <p className="text-ellipsis whitespace-nowrap  text-base font-normal">
                      Xem trang cá nhân
                    </p>
                  </div>
                </Link>
              </MenubarItem>
              <MenubarItem
                onClick={handleIsSetting}
                className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20"
              >
                {" "}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faGear}
                    className="text-dark100_light500"
                  />
                  <p className="text-ellipsis whitespace-nowrap  text-base">
                    Cài đặt
                  </p>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={handleIsSave}
                className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20"
              >
                {" "}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    className="text-dark100_light500"
                  />
                  <p className="text-ellipsis whitespace-nowrap  text-base">
                    Bài viết đã lưu
                  </p>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={handleIsFavorite}
                className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20"
              >
                {" "}
                <div className="flex items-center gap-2 ">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-dark100_light500"
                  />
                  <p className="text-ellipsis whitespace-nowrap  text-base">
                    Bài viết đã thích
                  </p>
                </div>
              </MenubarItem>
              <MenubarItem className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20">
                {" "}
                <Button className="h-[30px] w-full bg-primary-100 text-center text-base text-white">
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

      {isDrawerOpen && (
        <div className="background-light700_dark300 fixed left-0 top-16 z-50 size-full bg-white shadow-lg md:w-1/2 lg:w-2/5">
          <div className="p-6">
            <button
              className="absolute right-4 top-4 text-lg"
              onClick={closeDrawer}
            >
              <Icon
                icon="mingcute:close-line"
                className="text-dark100_light500 mt-5"
              />
            </button>
            {activeDrawer === "/search" && (
              <>
                <Search />
              </>
            )}
            {activeDrawer === "/notifications" && (
              <div>
                <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
                  Notifications
                </div>
                <div className="mt-4  flex text-primary-100">Recently</div>
                <div className="mt-5 flex flex-col  space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between p-2 "
                    >
                      <Image
                        src={notification.avatar}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                      <div className="ml-2 flex-1 pr-4">
                        <p className="text-dark100_light500 font-light">
                          {notification.content}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getTimestamp(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
