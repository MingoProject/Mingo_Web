import Image from "next/image";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
const TableSearch = ({
  onSearch,
}: {
  onSearch: (searchQuery: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <div className="flex h-[38px] flex-1 items-center gap-2 rounded-full border px-2 text-xs sm:w-auto">
      <Icon
        icon="solar:magnifer-linear"
        width={20}
        height={20}
        className="text-gray-500 dark:text-white"
      />
      <input
        type="text"
        placeholder=""
        value={searchQuery}
        onChange={handleSearch}
        className="text-dark100_light500 w-full bg-transparent p-2 text-[16px] outline-none"
      />
    </div>
  );
};

export default TableSearch;
