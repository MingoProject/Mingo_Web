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
        <tr className="text-dark100_light500 text-left text-lg md:text-base">
          {columns.map((col) => (
            <th
              key={col.accessor}
              className={`text-dark100_light500 relative p-2 text-lg md:p-4 ${col.className || ""}`}
            >
              <div className="flex items-center">
                <span className="text-dark100_light500  text-base">
                  {" "}
                  {/* Thay đổi cỡ chữ tại đây */}
                  {col.header}
                </span>
                <button
                  className="text-dark100_light500 inline-flex items-center px-2"
                  onClick={() => onSort(col.accessor)}
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
