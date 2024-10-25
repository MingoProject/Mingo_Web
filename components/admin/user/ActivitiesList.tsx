"use client";
import TableSearch from "@/components/shared/TableSearch";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { userData } from "@/components/shared/data";
import Active from "@/components/cards/Active";
import Off from "@/components/cards/Off";
import Table from "@/components/shared/Table";
import MyButton from "@/components/shared/MyButton";

type User = {
  id: number;
  fullname: string;
  gender: string;
  address: string;
  nickName: string;
  gmail: string;
  phone: string;
  status: number; // Trạng thái người dùng (ví dụ: 'active', 'inactive')
  job: string; // Nghề nghiệp
  bio: string; // Giới thiệu về bản thân
  hobbies: string[]; // Sở thích (danh sách)
  enrolled: Date; // Ngày tham gia (đăng ký)
};

type ActivityType = "save" | "like" | "reported";

const columns = [
  {
    header: "Posted User",
    accessor: "fullname",
    className: " text-lg font-md",
  },
  {
    header: "ID",
    accessor: "fullname",
    className: "hidden md:table-cell text-lg font-md",
  },
  {
    header: "Created Date",
    accessor: "createdDate",
    className: " text-lg font-md",
  },
  {
    header: "Content",
    accessor: "gmail",
    className: "hidden lg:table-cell text-lg font-md",
  },
  {
    header: "Like At",
    accessor: "createdDate",
    className: "hidden lg:table-cell text-lg font-md",
  },

  { header: "Type", accessor: "type", className: " text-lg font-md" },
];

const ActivitiesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [activeTab, setActiveTab] = useState<ActivityType>("save");
  const [isMounted, setIsMounted] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });
  type SortableKeys = "username" | "id" | "fullname" | "email" | "phone";

  const getValueByKey = (item: (typeof userData)[0], key: SortableKeys) => {
    switch (key) {
      case "username":
        return item.fullname;
      case "id":
        return item.id;
      case "fullname":
        return item.fullname;
      case "email":
        return item.gmail;
      case "phone":
        return item.phone;
      default:
        return "";
    }
  };
  const sorted = [...userData].sort((a, b) => {
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
      item.fullname.toLowerCase().includes(lowerCaseQuery) ||
      item.gmail.toLowerCase().includes(lowerCaseQuery) ||
      item.phone.toLowerCase().includes(lowerCaseQuery) ||
      format(item.enrolled, "dd/MM/yyyy")
        .toLowerCase()
        .includes(lowerCaseQuery);

    // Lọc theo giá trị bộ lọc được chọn
    const matchesFilter =
      (filterOption === "offline" && item.status === 0) ||
      (filterOption === "online" && item.status === 1) ||
      !filterOption; // Không có bộ lọc nào được chọn thì hiển thị tất cả

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderRow = (item: User) => (
    <tr
      key={item.id}
      className="border-t border-gray-300 my-4 text-sm  dark:text-dark-360 "
    >
      <td className="px-4 py-2" key={item.id}>
        <Link href={`/post/${item.id}`}>
          <h3>{item.fullname}</h3>
          <p className="text-xs text-gray-500">#00{item.id}</p>
        </Link>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.id}>
        <p className="text-sm ">{item.fullname}</p>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.id}>
        <p className="text-sm ">
          <div className="flex flex-col w-full ">
            <p>{format(item.enrolled, "PPP")}</p>
            <p className="text-xs text-gray-500 pt-1">
              {new Date(item.enrolled).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </p>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.id}>
        <p className="text-sm ">{item.gmail}</p>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.id}>
        <p className="text-sm ">
          <div className="flex flex-col w-full ">
            <p>{format(item.enrolled, "PPP")}</p>
            <p className="text-xs text-gray-500 pt-1">
              {new Date(item.enrolled).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </p>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.id}>
        <p className="text-sm text-gray-500">
          {item.status === 0 ? (
            <MyButton
              title="Image"
              backgroundColor="bg-light-blue"
              color="text-blue-500"
              fontWeight="font-medium"
              fontSize="text-[14px]"
              height="h-[30px]"
              width="w-[97px]"
            />
          ) : item.status === 1 ? (
            <MyButton
              title="Video"
              backgroundColor="bg-light-yellow"
              color="text-yellow-500"
              fontWeight="font-medium"
              fontSize="text-[14px]"
              height="h-[30px]"
              width="w-[97px]"
            />
          ) : item.status === 2 ? (
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
    </tr>
  );

  return (
    <div className="w-full flex flex-col py-6">
      <TableSearch onSearch={setSearchQuery} />
      <div className="flex flex-col lg:flex-row gap-10 w-full py-4 text-sm font-bold dark:text-white">
        <button
          className={`flex items-center gap-1 ${activeTab === "save" ? "text-red-500 opacity-100" : "opacity-40"}`}
          onClick={() => setActiveTab("save")}
        >
          Saved
        </button>
        <button
          className={`flex items-center gap-1 ${activeTab === "like" ? "text-red-500 opacity-100" : "opacity-40"}`}
          onClick={() => setActiveTab("like")}
        >
          Liked
        </button>
        <button
          className={`flex items-center gap-1 ${activeTab === "reported" ? "text-red-500 opacity-100" : "opacity-40"}`}
          onClick={() => setActiveTab("reported")}
        >
          Reported
        </button>
      </div>

      <div className="w-full px-4">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={filterData} // Pass sorted data to the table
          onSort={(key: string) => requestSort(key as SortableKeys)} // Sorting function
        />
      </div>
    </div>
  );
};

export default ActivitiesList;
