// components/Button.tsx

import React from "react";

interface ButtonProps {
  title: string;
  color?: string;
  onClick?: () => void;
  size?: "small" | "large"; // small: w-auto + px, large: w-full
  fontColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  color = "bg-primary-100",
  onClick,
  size = "large",
  fontColor = "",
}) => {
  const sizeClass =
    size === "small" ? "w-auto px-[30px] py-[10px]" : "w-full py-[12px]";

  return (
    <button
      onClick={onClick}
      className={`text-[16px] font-medium whitespace-nowrap rounded-[12px] ${sizeClass} ${color} ${fontColor}`}
    >
      {title}
    </button>
  );
};

export default Button;
