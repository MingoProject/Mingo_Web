import React from "react";
import MyButton from "../shared/MyButton";
import {
  faCheck,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const HeaderWithButton = ({ title, type }: { title: string; type: number }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex w-full flex-col">
        <p className="text-[32px] text-light-500">{title}</p>
        <p className="text-[16px] text-primary-100">
          Let's check your update today!
        </p>
      </div>
      {type === 1 ? (
        <div className="flex gap-4">
          <MyButton
            title="Delete"
            backgroundColor="bg-red-500"
            color="text-white"
            icon={faTrashCan}
            iconPosition="left"
            width="w-[90px]"
            height="h-[35px]"
            fontSize="text-[14px]"
            fontWeight="font-medium"
          />
          <MyButton
            title="Cancel"
            backgroundColor="bg-gray-200"
            icon={faXmark}
            iconPosition="left"
            width="w-[90px]"
            height="h-[35px]"
            fontSize="text-[14px]"
            fontWeight="font-medium"
          />
        </div>
      ) : (
        <div className="flex gap-4">
          <MyButton title="Delete" />
          <MyButton
            title="Confirm"
            backgroundColor="bg-green-500"
            color="text-white"
            icon={faCheck}
            iconPosition="left"
            width="w-[90px]"
            height="h-[35px]"
            fontSize="text-[14px]"
            fontWeight="font-medium"
          />
          <MyButton
            title="Cancel"
            backgroundColor="bg-gray-200"
            icon={faXmark}
            iconPosition="left"
            width="w-[90px]"
            height="h-[35px]"
            fontSize="text-[14px]"
            fontWeight="font-medium"
          />
        </div>
      )}
    </div>
  );
};

export default HeaderWithButton;
