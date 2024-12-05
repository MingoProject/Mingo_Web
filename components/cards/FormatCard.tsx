import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "../ui/button";

// Cập nhật thêm prop `onConfirmDelete`
const Format = ({
  onClose,
  label,
  content,
  userName,
  onConfirmDelete, // Prop mới để xử lý xóa
}: {
  onClose: () => void;
  label: string;
  content: string;
  userName: string;
  onConfirmDelete?: () => void; // Hàm xử lý xóa
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="no-scrollbar background-light700_dark300 text-dark100_light500 relative z-10 h-[28vh] w-[50vw] overflow-y-auto rounded-md shadow-lg md:w-[30vw]">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none  p-2 px-4 text-center  text-sm md:text-base">
              {label}
            </span>
            <FontAwesomeIcon
              onClick={onClose}
              icon={faXmark}
              className="mb-2 cursor-pointer"
            />
          </div>
          <div className="flex h-32 items-center justify-center gap-1  text-xs md:text-sm">
            <p className="px-4">
              Xác nhận {content} <span>{userName}</span>
            </p>
          </div>
          <div className="text-dark100_light500 flex items-center justify-between gap-4 px-8 py-4">
            <Button
              onClick={onClose}
              className="h-[35px] w-32 bg-white text-xs shadow-md dark:border dark:bg-transparent md:text-sm"
            >
              Hủy
            </Button>
            <Button
              onClick={onConfirmDelete} // Gọi hàm xóa khi nhấn Xác nhận
              className="h-[35px] w-32  bg-primary-100 text-xs text-white shadow-md  md:text-sm"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Format;
