"use client";
import React from "react";
import MyButton from "../shared/MyButton";

const TotalCard = ({
  title,
  amount,
  plus,
}: {
  title: string;
  amount: number;
  plus: number;
}) => {
  const handleSeeDeatail = () => {};
  return (
    <div className="flex h-56 w-44 flex-col items-center justify-between rounded-[10px] border p-4 shadow-md">
      <div className="flex w-full flex-col items-center gap-3">
        <p className="text-[20px] font-medium text-light-500">Total {title}</p>
        <p className="text-[20px] font-bold text-light-500">{amount}</p>
        <p className="text-[14px] text-primary-100">
          + {plus} {title.toLowerCase()} today
        </p>
      </div>

      <MyButton
        title="See detail"
        border="border"
        onClick={handleSeeDeatail}
        backgroundColor="bg-primary-100"
        color="text-white"
        fontSize="text-[18px]"
        width="w-40"
        height="h-[40px]"
      />
    </div>
  );
};

export default TotalCard;
