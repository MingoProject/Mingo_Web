import React from "react";

const ChangePassword = () => {
  return (
    <div className="text-dark100_light500 flex h-full w-11/12 flex-col gap-8 pr-4 text-sm font-thin">
      <div className="flex w-full items-center gap-2 border-b border-gray-300">
        <input
          className="w-full bg-transparent px-2 focus:outline-none"
          placeholder="Mật khẩu cũ"
        ></input>
      </div>
      <div className="flex w-full items-center gap-2 border-b border-gray-300">
        <input
          className="w-full bg-transparent px-2 focus:outline-none"
          placeholder="Mật khẩu mới"
        ></input>
      </div>
      <div className="flex w-full items-center gap-2 border-b border-gray-300">
        <input
          className="w-full bg-transparent px-2 focus:outline-none "
          placeholder="Xác nhận mật khẩu mới"
        ></input>
      </div>
    </div>
  );
};

export default ChangePassword;
