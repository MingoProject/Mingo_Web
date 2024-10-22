"use client";
import { useEffect, useState } from "react";
import Headers from "@/components/course/Headers";
import Pagination from "@/components/course/Pagination";
import Table from "@/components/course/Table";
import TableSearch from "@/components/course/TableSearch";
import { Button } from "@/components/ui/button";
import { courseTeacherData } from "@/lib/course/data";
import Active from "@/components/shared/button/Active";
import Off from "@/components/shared/button/Off";
import { format } from "date-fns";
import Image from "next/image";
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
import PaginationUI from "@/components/teacher/Pagination";
import { PaginationProps } from "@/types/pagination";
import { teacherDataTable } from "@/constants/teacher";

type Time = {
  day: string;
  startTime: string; // "HH:MM" định dạng 24 giờ
  endTime: string; // "HH:MM" định dạng 24 giờ
};

type Course = {
  id: number;
  courseName: string;
  startDate: Date; // Định dạng chuỗi để chứa ngày như "YYYY-MM-DD"
  endDate: Date; // Kiểu Date để chứa ngày kết thúc
  time: Time[]; // Mảng của kiểu Time chứa thông tin về các thời gian
  status: number; // Có thể là trạng thái hoạt động, ví dụ: 1 = Active, 2 = Inactive
};

const columns = [
  { header: "Course Name", accessor: "courseName" },
  {
    header: "Start Date",
    accessor: "startDate",
    className: "hidden md:table-cell",
  },
  {
    header: "End Date",
    accessor: "endDate",
    className: "hidden lg:table-cell",
  },
  { header: "Time", accessor: "time" },
  { header: "Status", accessor: "status", className: "hidden lg:table-cell" },
];

const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  //Sorted
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });
  type SortableKeys = "id" | "courseName" | "startDate" | "endDate";

  const getValueByKey = (
    item: (typeof courseTeacherData)[0],
    key: SortableKeys
  ) => {
    switch (key) {
      case "courseName":
        return item.courseName;
      case "startDate":
        return item.startDate;
      case "endDate":
        return item.endDate;
      default:
        return "";
    }
  };
  const sorted = [...courseTeacherData].sort((a, b) => {
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
      item.courseName.toLowerCase().includes(lowerCaseQuery) ||
      format(item.startDate, "dd/MM/yyyy")
        .toLowerCase()
        .includes(lowerCaseQuery) ||
      format(item.endDate, "dd/MM/yyyy").toLowerCase().includes(lowerCaseQuery);

    // Lọc theo giá trị bộ lọc được chọn
    const matchesFilter =
      (filterOption === "online" && item.status === 1) ||
      (filterOption === "offline" && item.status === 0) ||
      !filterOption; // Không có bộ lọc nào được chọn thì hiển thị tất cả

    return matchesSearch && matchesFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(courseTeacherData.length / rowsPerPage);
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
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderRow = (item: Course) => (
    <tr
      key={item.id}
      className="border-t border-gray-300 my-4 text-sm  dark:text-dark-360 "
    >
      <td className="px-4 py-2" key={item.id}>
        <Link href={`/course-teacher/${item.id}`}>
          <h3>{item.courseName}</h3>
          <p className="text-xs text-gray-500">#00{item.id}</p>
        </Link>
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.id}>
        {format(item.startDate, "dd/MM/yyyy")}
      </td>
      <td className="px-4 py-2 hidden md:table-cell" key={item.id}>
        {format(item.startDate, "dd/MM/yyyy")}
      </td>
      <td key={item.id}>
        {item.time.map((it) => (
          <p>
            {it.day}, {it.startTime}-{it.endTime}
          </p>
        ))}
      </td>
      <td className="px-4 py-2 hidden lg:table-cell" key={item.id}>
        {item.status ? <Active /> : <Off />}
      </td>
    </tr>
  );
  return (
    <div className="w-full h-full flex flex-col p-4">
      <Headers />
      <div className="w-full rounded-md shadow-md mt-4 dark:bg-light-300">
        {/* TOP */}
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
                    className=" flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                    onSelect={() => setFilterOption("number")}
                  >
                    <p className="p-1 pt-2">Số lượng học sinh</p>
                  </MenubarItem>
                  <MenubarItem
                    className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                    onSelect={() => setFilterOption("online")}
                  >
                    <p className="p-1 pb-2">Học sinh online</p>
                  </MenubarItem>
                  <MenubarItem
                    className="flex w-full cursor-pointer items-center justify-start px-2 text-center hover:bg-primary-100 hover:text-white"
                    onSelect={() => setFilterOption("offline")}
                  >
                    <p className="p-1 pb-2">Học sinh offline</p>
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
        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalResult={totalResult}
          rowPage={rowsPerPage}
        /> */}
        <div className="p-4 mt-4 text-sm flex items-center justify-center md:justify-between text-gray-500 dark:text-dark-360">
          <PaginationUI paginationUI={paginationUI} />
        </div>
      </div>
    </div>
  );
};

export default page;
