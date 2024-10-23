"use client";
import { useEffect, useState } from "react";
import Headers from "@/components/header/HeaderNoButton";
import Table from "@/components/admin/user/Table";
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

type UserTable = {
  postedUser: string;
  createdDate: Date; // Kiểu Date để chứa ngày kết thúc
  content: string; // Mảng của kiểu Time chứa thông tin về các thời gian
  postId: number; // Có thể là trạng thái hoạt động, ví dụ: 1 = Active, 2 = Inactive
  type: number; // Có thể là trạng thái hoạt động, ví dụ: 1 = Active, 2 = Inactive
};

const columns = [
  {
    header: "Post User",
    accessor: "postedUser",
    className: " text-lg font-md",
  },
  {
    header: "PostId",
    accessor: "postId",
    className: "hidden md:table-cell text-lg font-md",
  },
  {
    header: "Type",
    accessor: "type",
    className: "hidden lg:table-cell text-lg font-md",
  },
  {
    header: "Created Date",
    accessor: "createdDate",
    className: " text-lg font-md",
  },
  { header: "Content", accessor: "content", className: " text-lg font-md" },
];
const PostTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  //Sorted
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "postId",
    direction: "ascending",
  });
  type SortableKeys = "postedUser" | "postId" | "createdDate" | "type";

  const getValueByKey = (item: (typeof PostData)[0], key: SortableKeys) => {
    switch (key) {
      case "postedUser":
        return item.postedUser;
      case "postId":
        return item.postId;
      case "createdDate":
        return item.createdDate;
      case "type":
        return item.type;
      default:
        return "";
    }
  };
  const sorted = [...PostData].sort((a, b) => {
    const aValue = getValueByKey(a, sortConfig.key);
    const bValue = getValueByKey(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  const requestSort = (key: SortableKeys) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filterData = sorted.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    // Lọc theo searchQuery
    const matchesSearch =
      item.postedUser.toLowerCase().includes(lowerCaseQuery) ||
      item.content.toLowerCase().includes(lowerCaseQuery) ||
      item.postId.toLowerCase().includes(lowerCaseQuery) ||
      format(item.createdDate, "dd/MM/yyyy")
        .toLowerCase()
        .includes(lowerCaseQuery);

    // Lọc theo giá trị bộ lọc được chọn
    const matchesFilter =
      (filterOption === "status" && item.type === 0) ||
      (filterOption === "image" && item.type === 1) ||
      (filterOption === "video" && item.type === 2) ||
      (filterOption === "post" && item.type === 3) ||
      !filterOption; // Không có bộ lọc nào được chọn thì hiển thị tất cả

    return matchesSearch && matchesFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(PostData.length / rowsPerPage);
  const totalResult = filterData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filterData.slice(startIndex, endIndex);
  const [isMounted, setIsMounted] = useState(false);

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginationUI: PaginationProps = {
    currentPage,
    setCurrentPage,
    indexOfLastItem,
    indexOfFirstItem,
    totalPages: Math.ceil(filterData.length / itemsPerPage),
    dataLength: filterData.length,
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderRow = (item: UserTable) => (
    <tr
      key={item.postId}
      className="border-t border-gray-300 my-4 text-sm  dark:text-dark-360 "
    >
      <td className="px-4 py-2" key={item.postId}>
        <Link href={`/post/${item.postId}`}>
          <h3>{item.postedUser}</h3>
          <p className="text-xs text-gray-500">#00{item.postId}</p>
        </Link>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.postId}>
        <p className="text-sm ">{item.postId}</p>
      </td>

      <td className="px-4 py-2 hidden lg:table-cell" key={item.postId}>
        <p className="text-sm text-gray-500">
          {item.type === 0 ? (
            <MyButton
              title="Image"
              backgroundColor="bg-light-blue"
              color="text-blue-500"
              fontWeight="font-medium"
              fontSize="text-[14px]"
              height="h-[30px]"
              width="w-[97px]"
            />
          ) : item.type === 1 ? (
            <MyButton
              title="Video"
              backgroundColor="bg-light-yellow"
              color="text-yellow-500"
              fontWeight="font-medium"
              fontSize="text-[14px]"
              height="h-[30px]"
              width="w-[97px]"
            />
          ) : item.type === 2 ? (
            <MyButton
              title="Status"
              backgroundColor="bg-custom-green"
              color="text-green-500"
              fontWeight="font-medium"
              fontSize="text-[14px]"
              height="h-[30px]"
              width="w-[97px]"
            />
          ) : (
            <MyButton
              title="Post"
              backgroundColor="bg-light-red"
              color="text-red-500"
              fontWeight="font-medium"
              fontSize="text-[14px]"
              height="h-[30px]"
              width="w-[97px]"
            />
          )}
        </p>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.postId}>
        <p className="text-sm ">
          <div className="flex flex-col w-full ">
            <p>{format(item.createdDate, "PPP")}</p>
            <p className="text-xs text-gray-500 pt-1">
              {new Date(item.createdDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </p>
      </td>

      <td className="px-4 py-2 hidden lg:table-cell" key={item.postId}>
        <p className="text-sm ">{item.content}</p>
      </td>
    </tr>
  );
  return (
    <div className="w-full">
      <div className="w-full px-4">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={currentData} // Pass sorted data to the table
          onSort={(key: string) => requestSort(key as SortableKeys)} // Sorting function
        />
      </div>

      <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
        <PaginationUI paginationUI={paginationUI} />
      </div>
    </div>
  );
};

export default PostTab;
