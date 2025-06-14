"use client";

import React from "react";
import { Icon } from "@iconify/react";

interface IconButtonProps {
  iconSrc: string;
  onClick?: () => void;
  color?: string;
  iconColor?: string;
  rounded?: string;
  padding?: string;
  iconSize?: string;
}

const IconButton = ({
  iconSrc,
  onClick,
  color = "text-primary-100",
  iconColor = "text-dark100_light100",
  rounded = "rounded-full",
  padding = "p-2",
  iconSize = "size-[24px]",
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={` inline-flex ${rounded} ${padding} transition ${color}`}
    >
      <Icon icon={iconSrc} className={`${iconSize} ${iconColor}`} />
    </button>
  );
};

export default IconButton;
