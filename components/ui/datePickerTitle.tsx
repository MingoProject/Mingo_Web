"use client";

import React from "react";
import { Icon } from "@iconify/react";

interface DatePickerTitleProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
}

const DatePickerTitle: React.FC<DatePickerTitleProps> = ({
  label,
  value,
  onChange,
  name,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[16px] text-dark100_light100 font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={onChange}
          name={name}
          className="w-full h-12 rounded-[12px] bg-transparent border border-[#CCCCCC] px-4 pr-10 py-2 text-dark100_light100 outline-none placeholder:text-dark300_light300"
        />
        {/* <Icon
          icon="mdi:calendar-month-outline"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none"
        /> */}
      </div>
    </div>
  );
};

export default DatePickerTitle;
