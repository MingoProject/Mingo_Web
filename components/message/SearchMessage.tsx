"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import MessageSearch from "./MessageSearch";

const SearchMessage = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="h-10 w-full border-b border-gray-200 px-4 flex items-center">
        <Icon
          onClick={onCancel}
          icon="formkit:arrowleft"
          width={20}
          height={20}
          className="text-gray-500 dark:text-white"
        />
        <p className="text-lg text-center w-full">Tìm kiếm</p>
      </div>
      <div className="w-full px-4 ">
        <div className="ml-4 mt-4 flex h-[33px] flex-1 items-center gap-2 rounded-full border-2 px-2 text-xs sm:w-auto lg:ml-0">
          <Icon
            icon="solar:magnifer-linear"
            width={20}
            height={20}
            className="text-gray-500 dark:text-white"
          />
          <input
            type="text"
            placeholder=""
            className="w-full bg-transparent p-2 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchMessage;
