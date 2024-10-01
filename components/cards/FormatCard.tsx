import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "../ui/button";

const Format = ({
  onClose,
  label,
  content,
  userName,
}: {
  onClose: () => void;
  label: string;
  content: string;
  userName: string;
}) => {
  return (
    // Add the return statement here
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background mờ - khi nhấn vào nền mờ thì đóng component */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="no-scrollbar background-light700_dark300 text-dark100_light500 relative z-10 h-[28vh] w-[30vw] overflow-y-auto rounded-md shadow-lg">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none  p-2 px-4 text-center text-lg">
              {label}
            </span>
            <FontAwesomeIcon
              onClick={onClose}
              icon={faXmark}
              className="mb-2 cursor-pointer"
            />
          </div>
          <div className="flex h-32 items-center justify-center gap-1 text-base">
            <p>Xác nhận {content}</p>
            <p> {userName}</p>
          </div>
          <div className="text-dark100_light500 flex items-center justify-between px-8 py-4">
            <Button
              onClick={onClose}
              className="h-[35px] w-32 bg-white shadow-md dark:border dark:bg-transparent"
            >
              Hủy
            </Button>
            <Button className="h-[35px] w-32  bg-primary-100 text-white shadow-md ">
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Format;
