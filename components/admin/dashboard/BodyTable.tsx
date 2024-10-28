"use client";
import React, { useState } from "react";
import Table from "./Table";
import Link from "next/link";
import { format } from "date-fns";
import Done from "@/components/cards/Done";
import InProgress from "@/components/cards/InProgress";
import Chart from "./Chart";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Report = {
  id: number;
  createdUser: string;
  reportedUser: string;
  createDate: Date;
  status: number;
};

const reports: Report[] = [
  {
    id: 1,
    createdUser: "user123",
    reportedUser: "user456",
    createDate: new Date("2024-01-15T08:30:00Z"),
    status: 0, // 0: pending
  },
  {
    id: 2,
    createdUser: "user789",
    reportedUser: "user012",
    createDate: new Date("2024-02-20T12:45:00Z"),
    status: 1, // 1: resolved
  },
  {
    id: 3,
    createdUser: "user345",
    reportedUser: "user678",
    createDate: new Date("2024-03-10T14:15:00Z"),
    status: 0,
  },
  {
    id: 4,
    createdUser: "user456",
    reportedUser: "user789",
    createDate: new Date("2024-04-05T09:00:00Z"),
    status: 2, // 2: rejected
  },
  {
    id: 5,
    createdUser: "user012",
    reportedUser: "user123",
    createDate: new Date("2024-05-18T16:30:00Z"),
    status: 0,
  },
  {
    id: 6,
    createdUser: "user678",
    reportedUser: "user234",
    createDate: new Date("2024-06-21T11:20:00Z"),
    status: 1,
  },
  {
    id: 7,
    createdUser: "user234",
    reportedUser: "user345",
    createDate: new Date("2024-07-15T13:10:00Z"),
    status: 0,
  },
  {
    id: 8,
    createdUser: "user890",
    reportedUser: "user567",
    createDate: new Date("2024-08-30T17:00:00Z"),
    status: 1,
  },
  {
    id: 9,
    createdUser: "user567",
    reportedUser: "user890",
    createDate: new Date("2024-09-10T10:50:00Z"),
    status: 1,
  },
  {
    id: 10,
    createdUser: "user456",
    reportedUser: "user123",
    createDate: new Date("2024-10-12T19:25:00Z"),
    status: 0,
  },
];

const columns = [
  { header: "Created User", accessor: "createdUser" },
  {
    header: "Reported User",
    accessor: "reportedUser",
    className: "hidden md:table-cell",
  },
  {
    header: "Created Date",
    accessor: "createDate",
    className: "hidden lg:table-cell",
  },
  { header: "Status", accessor: "status" },
];

const BodyTable = () => {
  const renderRow = (item: Report) => (
    <tr
      key={item.id}
      className="text-dark100_light500 my-4 border-t border-gray-300 text-xs  md:text-sm "
    >
      <td className="break-words p-2 text-base md:px-4">
        <Link href={`/course/${item.id}`}>
          <h3>{item.createdUser}</h3>
          <p className=" text-gray-500">#00{item.id}</p>
        </Link>
      </td>
      <td className="hidden px-4 py-2 md:table-cell">{item.reportedUser}</td>
      <td className="hidden px-4 py-2 lg:table-cell">
        {format(item.createDate, "dd/MM/yyyy")}
      </td>
      <td className="px-4 py-2 ">{item.status ? <Done /> : <InProgress />}</td>
    </tr>
  );

  type SortableKeys =
    | "id"
    | "createdUser"
    | "reportedUser"
    | "createDate"
    | "status";

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });

  const getValueByKey = (item: (typeof reports)[0], key: SortableKeys) => {
    switch (key) {
      case "createdUser":
        return item.createdUser;
      case "reportedUser":
        return item.reportedUser;
      case "createDate":
        return item.createDate;
      case "status":
        return item.status;
      default:
        return "";
    }
  };

  const sorted = [...reports].sort((a, b) => {
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

  return (
    <div className="text-dark100_light500 mr-10 mt-4 flex h-80  w-full rounded-[10px] border p-4 shadow-md">
      <div className="w-2/3">
        <p className="flex items-center gap-4 border-b border-gray-300 pb-1">
          <FontAwesomeIcon
            icon={faBell}
            className="text-dark100_light500 mb-2"
          />
          <span className="text-dark100_light500 text-[20px]">
            Recent reports
          </span>
        </p>
        <div className="no-scrollbar size-full h-60 overflow-auto">
          <Table
            columns={columns}
            renderRow={renderRow}
            data={sorted} // Pass sorted data to the table
            onSort={(key: string) => requestSort(key as SortableKeys)} // Sorting function
          />
        </div>
      </div>

      <div className=" w-1/3 p-4 py-0">
        <Chart />
      </div>
    </div>
  );
};

export default BodyTable;
