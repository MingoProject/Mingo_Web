// components/Button.tsx

import React from "react";

interface ButtonProps {
  title: string;
  color?: string;
  onClick?: () => void;
  size?: "small" | "large"; // small: w-auto + px, large: w-full
  fontColor?: string;
  border?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  color = "bg-primary-100",
  onClick,
  size = "large",
  fontColor = "text-dark100_light200",
  border = "",
}) => {
  const sizeClass =
    size === "small" ? "w-auto px-[30px] py-[10px]" : "w-full py-[12px]";

  return (
    <button
      onClick={onClick}
      className={`text-[16px] ${border} font-medium dar whitespace-nowrap rounded-[12px] ${sizeClass} ${color} ${fontColor}`}
    >
      {title}
    </button>
  );
};

export default Button;
