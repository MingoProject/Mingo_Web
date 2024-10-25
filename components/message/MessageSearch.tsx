import React from "react";
import { Icon } from "@iconify/react";
const MessageSearch = () => {
  return (
    <div className="text-dark100_light500 background-light700_dark300 mt-4 flex h-[30px] flex-1  items-center gap-2 rounded-full border-2 px-2 text-xs sm:w-auto md:ml-4 md:h-[38px] lg:ml-0 ">
      <Icon
        icon="solar:magnifer-linear"
        width={20}
        height={20}
        className="text-dark100_light500 "
      />
      <input
        type="text"
        placeholder=""
        className="w-full bg-transparent outline-none md:p-2"
      />
    </div>
  );
};

export default MessageSearch;
