"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

interface InputProps {
  iconSrc?: string;
  avatarSrc?: string;
  placeholder?: string;
  readOnly?: boolean;
  cursor?: string; // "text" | "pointer" | "default" | v.v.
  onClick?: () => void;
}

const Input = ({
  iconSrc,
  avatarSrc,
  placeholder = "",
  readOnly = false,
  cursor = "text",
  onClick,
}: InputProps) => {
  return (
    <div className="flex gap-[9px] items-center">
      {avatarSrc && (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={avatarSrc || "/assets/images/capy.jpg"}
            alt="Avatar"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        </div>
      )}
      <div
        className={`flex items-center background-light400_dark400 rounded-full px-[20px] py-[12px] w-full `}
        onClick={onClick}
      >
        {iconSrc && (
          <Icon icon={iconSrc} className="size-[24px] mr-2 opacity-60" />
        )}
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full h-[17px] bg-transparent outline-none text-dark300_light300 text-[16px] font-normal cursor-${cursor}`}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default Input;
