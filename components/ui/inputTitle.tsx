"use client";

import React from "react";

interface InputTitleProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
}

const InputTitle: React.FC<InputTitleProps> = ({
  label,
  placeholder = "",
  type = "text",
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
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent h-12 rounded-[12px] border border-[#CCCCCC] px-4 py-2 text-dark100_light100 outline-none placeholder:text-dark300_light300"
      />
    </div>
  );
};

export default InputTitle;
