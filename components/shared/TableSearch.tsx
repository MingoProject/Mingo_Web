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
    <div className="flex-1 h-[38px] ml-4 flex sm:w-auto items-center gap-2 text-xs rounded-full px-2 border-2">
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
        className="w-full p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
