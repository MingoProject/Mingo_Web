"use client";
import { useEffect, useState } from "react";
import Headers from "@/components/header/HeaderNoButton";
import Table from "@/components/shared/Table";
import TableSearch from "@/components/shared/TableSearch";
import { PostData } from "@/components/shared/data";
import Active from "@/components/cards/Active";
import Off from "@/components/cards/Off";
import { format } from "date-fns";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";
import PaginationUI from "@/components/shared/Pagination";
import { PaginationProps } from "@/types/pagination";
import HeaderNoButton from "@/components/header/HeaderNoButton";
import MyButton from "@/components/shared/MyButton";
import PostTab from "@/components/admin/content/PostTab";
import router, { useRouter } from "next/router";
import UserTab from "@/components/admin/report/UserTab";
import ContentTab from "@/components/admin/report/ContentTab";
import CommentTab from "@/components/admin/report/CommentTab";

type UserTable = {
  postedUser: string;
  createdDate: Date; // Kiểu Date để chứa ngày kết thúc
  content: string; // Mảng của kiểu Time chứa thông tin về các thời gian
  postId: number; // Có thể là trạng thái hoạt động, ví dụ: 1 = Active, 2 = Inactive
  type: number; // Có thể là trạng thái hoạt động, ví dụ: 1 = Active, 2 = Inactive
};

const columns = [
  { header: "Post User", accessor: "postedUser" },
  {
    header: "PostId",
    accessor: "postId",
    className: "hidden md:table-cell",
  },
  {
    header: "Type",
    accessor: "type",
    className: "hidden lg:table-cell",
  },
  { header: "Created Date", accessor: "createdDate" },
  { header: "Content", accessor: "content" },
];

const page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const [activeTab, setActiveTab] = useState("user"); // Khởi tạo state với tab "post" mặc định

  const renderContent = () => {
    switch (activeTab) {
      case "user":
        return <UserTab />; // Hiển thị component tương ứng với post
      case "content":
        return <ContentTab />;
      case "comment":
        return <CommentTab />; // Hiển thị component tương ứng với comment
      default:
        return <UserTab />;
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <HeaderNoButton />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full dark:text-dark-360 rounded-md mt-0">
        <TableSearch onSearch={setSearchQuery} />

        <div className="flex justify-between items-center gap-4 p-4">
          <Menubar className="relative border-none bg-transparent py-4 shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2">
                <button className="flex text-sm items-center py-2 px-4 border-2 dark:border-light100_dark400 gap-1 dark:text-dark-360 h-[35px] text-dark360_light360 shadow-md hover:opacity-75 transition-opacity duration-300 rounded-lg">
                  <Icon
                    icon="tabler:adjustments-horizontal"
                    width={14}
                    height={14}
                    className="text-gray-800 dark:text-white"
                  />
                  Filter
                </button>
              </MenubarTrigger>
              <MenubarContent className="text-dark100_light500 bg-gray-50 absolute top-full right-[-3rem] z-50 mt-3 h-auto w-40 font-sans text-sm shadow-md">
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
      <div className="flex flex-col lg:flex-row gap-8 w-full p-4 pt-0 text-lg font-bold dark:text-white">
        <button
          className={`flex items-center gap-1  ${
            activeTab === "user"
              ? "text-primary-100 border-b border-primary-100 opacity-100"
              : "opacity-40"
          }`}
          onClick={() => setActiveTab("user")}
        >
          User
        </button>
        <button
          className={`flex items-center gap-1 ${
            activeTab === "content"
              ? "text-primary-100 border-b border-primary-100 opacity-100"
              : "opacity-40"
          }`}
          onClick={() => setActiveTab("content")}
        >
          Content
        </button>
        <button
          className={`flex items-center gap-1 ${
            activeTab === "comment"
              ? "text-primary-100 border-b border-primary-100 opacity-100"
              : "opacity-40"
          }`}
          onClick={() => setActiveTab("comment")}
        >
          Comment
        </button>
      </div>
      <div className="">{renderContent()}</div>
    </div>
  );
};

export default page;
