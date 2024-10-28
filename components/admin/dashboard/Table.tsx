import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import sortIcon from "@iconify/icons-mi/sort";

const Table = ({
  columns,
  renderRow,
  data,
  onSort,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
  onSort: (key: string) => void; // Accept string as SortableKey
}) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className=" text-left text-xs md:text-sm">
          {columns.map((col) => (
            <th
              key={col.accessor}
              className={`relative p-2 md:p-4 ${col.className || ""}`}
            >
              <div className="flex items-center">
                <span>{col.header}</span>
                <button
                  className=" inline-flex items-center px-2"
                  onClick={() => onSort(col.accessor)} // Pass column key for sorting
                >
                  <Icon
                    icon={sortIcon}
                    className="text-dark100_light500"
                    width={18}
                    height={18}
                  />
                </button>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
};

export default Table;
