"use client";

import React from "react";
import { Icon } from "@iconify/react";

interface SelectTitleProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  name?: string;
  className?: string;
  placeholder?: string;
}

const SelectTitle: React.FC<SelectTitleProps> = ({
  label,
  value,
  onChange,
  options,
  name,
  className = "",
  placeholder,
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[16px] text-dark100_light100 font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full h-12 rounded-[12px] bg-transparent border border-[#CCCCCC] px-4 pr-10 text-dark100_light100 outline-none appearance-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Icon
          icon="mdi:chevron-down"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none"
        />
      </div>
    </div>
  );
};

export default SelectTitle;
