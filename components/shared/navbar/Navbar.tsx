"use client";
import { useState } from "react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import { getTimestamp } from "@/lib/utils";

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

const recentSearches = [
  "React Hooks",
  "Tailwind CSS",
  "Next.js",
  "JavaScript ES6 Features",
  "Web Development Trends",
];

const Navbar = () => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteSearch = (search: any) => {
    // Logic to delete a search term can be added here
    console.log(`Delete search: ${search}`);
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
    <nav className="flex-between background-light700_dark300 fixed z-50 h-[79px] w-full gap-5 p-6 sm:px-5">
      <Link href="/" className="flex items-center gap-1">
        <p className="text-dark100_light500 text-3xl">
          Min<span className="text-3xl text-primary-100 ">gle</span>
        </p>
      </Link>

      {/* Sidebar links */}
      <div className="hidden w-auto sm:flex">
        <Sheet>
          {sidebarLinks.map((item) => {
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
                } ml-[12%] flex h-[43px] items-center justify-start gap-4 bg-transparent p-4 cursor-pointer`}
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
        <Link href="/personal-page" className="">
          <Image
            src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
            alt="Avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        </Link>
        <div className="flex w-auto sm:hidden">
          <MobileNav />
        </div>
      </div>

      {/* Right drawer/modal */}
      {isDrawerOpen && (
        <div className="fixed background-light700_dark300 left-0 top-16 h-full w-1/3 bg-white shadow-lg z-50">
          <div className="p-6">
            <button
              className="absolute top-4 right-4 text-lg"
              onClick={closeDrawer}
            >
              <Icon
                icon="mingcute:close-line"
                className="text-dark100_light500 mt-5"
              />
            </button>
            {activeDrawer === "/search" && (
              <>
                <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
                  Search{" "}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      placeholder="Search..."
                      className="flex-grow bg-transparent h-10 px-4 rounded-l-lg border border-primary-100 focus:outline-none focus:ring focus:ring-primary-200"
                    />
                    <button className="h-10 px-4 bg-primary-100 text-white rounded-r-lg">
                      Search
                    </button>
                  </div>

                  <h2 className="text-lg font-normal text-primary-100 mb-2">
                    Recently
                  </h2>
                  <ul className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center py-2 px-5 rounded-md  hover:bg-light-700 dark:hover:bg-dark-400 cursor-pointer"
                      >
                        <span className="text-dark100_light500">{search}</span>
                        <button onClick={() => handleDeleteSearch(search)}>
                          <Icon
                            icon="mdi:close"
                            className="text-dark100_light500"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {activeDrawer === "/notifications" && (
              <div>
                <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
                  Notifications
                </div>
                <div className="flex  text-primary-100 mt-4">Recently</div>
                <div className="flex mt-5 flex-col  space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between p-2 "
                    >
                      <img
                        src={notification.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 pr-4 ml-2">
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
