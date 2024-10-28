"use client";
import { useEffect, useState } from "react";
import Headers from "@/components/header/HeaderNoButton";
import TableSearch from "@/components/shared/TableSearch";
import { userData } from "@/components/shared/data";
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
import Table from "@/components/shared/Table";

type UserTable = {
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

const columns = [
  { header: "Username", accessor: "username" },
  {
    header: "Fullname",
    accessor: "fullname",
    className: "hidden md:table-cell",
  },
  {
    header: "Created Date",
    accessor: "createdDate",
    className: "hidden lg:table-cell",
  },
  { header: "Email", accessor: "email" },
  { header: "Phone", accessor: "phone" },
  { header: "Status", accessor: "status", className: "hidden lg:table-cell" },
];

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });
  type SortableKeys = "id" | "username" | "fullname" | "createdDate";

  const getValueByKey = (item: (typeof userData)[0], key: SortableKeys) => {
    switch (key) {
      case "username":
        return item.fullname;
      case "fullname":
        return item.nickName;
      case "createdDate":
        return item.enrolled;
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
      format(item.birthday, "dd/MM/yyyy")
        .toLowerCase()
        .includes(lowerCaseQuery);

    // Lọc theo giá trị bộ lọc được chọn
    const matchesFilter =
      (filterOption === "online" && item.status === 1) ||
      (filterOption === "offline" && item.status === 0) ||
      !filterOption; // Không có bộ lọc nào được chọn thì hiển thị tất cả

    return matchesSearch && matchesFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  // const totalPages = Math.ceil(userData.length / rowsPerPage);
  // const totalResult = filterData.length;
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
    <tr key={item.id} className=" my-4 border-t border-gray-300  text-sm ">
      <td className="px-4 py-2" key={item.id}>
        <Link href={`/user/${item.id}`}>
          <h3 className="text-base">{item.fullname}</h3>
          <p className="text-base text-gray-500">#00{item.id}</p>
        </Link>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell" key={item.id}>
        <p className="text-base ">{item.fullname}</p>
      </td>
      <td className="hidden px-4 py-2 md:table-cell" key={item.id}>
        <div className="flex w-full flex-col ">
          <p className="text-base">{format(item.enrolled, "PPP")}</p>
          <p className="pt-1 text-base text-gray-500">
            {new Date(item.enrolled).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell" key={item.id}>
        <p className="text-base text-gray-500">{item.gmail}</p>
      </td>
      <td className="hidden px-4 py-2 lg:table-cell" key={item.id}>
        <p className="text-base text-gray-500">{item.phone}</p>
      </td>

      <td className="hidden px-4 py-2 lg:table-cell" key={item.id}>
        {item.status ? <Active /> : <Off />}
      </td>
    </tr>
  );
  return (
    <div className="background-light700_dark400 text-dark100_light500 flex size-full flex-col p-4 text-base">
      <Headers />
      <div className=" mt-4 w-full rounded-md shadow-md">
        {/* TOP */}
        <div className=" mt-0 flex w-full flex-col items-center justify-between gap-4 rounded-md md:flex-row">
          <div className="w-full px-4">
            <TableSearch onSearch={setSearchQuery} />
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <Menubar className="relative border-none bg-transparent py-4 shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-2">
                  <button className=" flex h-[35px] items-center gap-1 rounded-lg border-2 px-4 py-2 text-sm shadow-md transition-opacity duration-300 hover:opacity-75">
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
                    onSelect={() => setFilterOption("online")}
                  >
                    <p className="p-1 pb-2">Active</p>
                  </MenubarItem>
                  <MenubarItem
                    className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                    onSelect={() => setFilterOption("offline")}
                  >
                    <p className="p-1 pb-2">InActive</p>
                  </MenubarItem>
                  <MenubarSeparator />
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
        {/* LIST */}
        <div className="w-full px-4">
          <Table
            columns={columns}
            renderRow={renderRow}
            data={currentData} // Pass sorted data to the table
            onSort={(key: string) => requestSort(key as SortableKeys)} // Sorting function
          />
        </div>
        {/* PAGINATION */}
        <div className=" mt-4 flex items-center justify-center p-4 text-sm text-gray-500 md:justify-between">
          <PaginationUI paginationUI={paginationUI} />
        </div>
      </div>
    </div>
  );
};

export default Page;
