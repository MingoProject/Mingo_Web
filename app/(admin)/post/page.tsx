"use client";
import { useEffect, useState } from "react";
import TableSearch from "@/components/shared/TableSearch";
import { Icon } from "@iconify/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";
import HeaderNoButton from "@/components/header/HeaderNoButton";
import PostTab from "@/components/admin/content/PostTab";
import MessageTab from "@/components/admin/content/MessageTab";

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const [activeTab, setActiveTab] = useState("post"); // Khởi tạo state với tab "post" mặc định

  const renderContent = () => {
    switch (activeTab) {
      case "post":
        return <PostTab />; // Hiển thị component tương ứng với post
      case "message":
        return <MessageTab />; // Hiển thị component tương ứng với message
      default:
        return <PostTab />;
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="background-light700_dark400 flex size-full flex-col p-4">
      <HeaderNoButton />

      <div className="text-dark100_light500 mt-0 flex w-full flex-col items-center justify-between gap-4 rounded-md md:flex-row">
        <TableSearch onSearch={setSearchQuery} />
        <div className="flex items-center justify-between gap-4 p-4">
          <Menubar className="relative border-none bg-transparent p-4 shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2">
                <button className=" text-dark100_light500 flex h-[35px] items-center gap-1 rounded-lg border-2 px-4 py-2 text-sm shadow-md transition-opacity duration-300 hover:opacity-75">
                  <Icon
                    icon="tabler:adjustments-horizontal"
                    width={14}
                    height={14}
                    className="text-dark100_light500"
                  />
                  <p className="text-dark100_light500">Filter</p>
                </button>
              </MenubarTrigger>
              <MenubarContent className="text-dark100_light500 absolute -right-12 top-full z-50 mt-3 h-auto w-40 bg-gray-50 font-sans text-sm shadow-md">
                <MenubarItem
                  className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                  onSelect={() => setFilterOption("image")}
                >
                  <p className="p-1 pb-2">Image</p>
                </MenubarItem>
                <MenubarItem
                  className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                  onSelect={() => setFilterOption("video")}
                >
                  <p className="p-1 pb-2">Video</p>
                </MenubarItem>
                <MenubarItem
                  className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                  onSelect={() => setFilterOption("status")}
                >
                  <p className="p-1 pb-2">Status</p>
                </MenubarItem>
                <MenubarItem
                  className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                  onSelect={() => setFilterOption("post")}
                >
                  <p className="p-1 pb-2">Post</p>
                </MenubarItem>
                <MenubarSeparator />
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <div className="flex w-full flex-col gap-8  text-lg  font-bold dark:text-white lg:flex-row">
        <button
          className={`flex items-center gap-1 ${
            activeTab === "post"
              ? "border-b border-primary-100 text-primary-100 opacity-100"
              : "text-light-600"
          }`}
          onClick={() => setActiveTab("post")}
        >
          Post
        </button>
        <button
          className={`flex items-center gap-1 ${
            activeTab === "message"
              ? "border-b border-primary-100 text-primary-100 opacity-100"
              : "text-light-600"
          }`}
          onClick={() => setActiveTab("message")}
        >
          Message
        </button>
      </div>
      <div className="pt-2">{renderContent()}</div>
    </div>
  );
};

export default Page;
