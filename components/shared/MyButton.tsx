import React from "react";
import classNames from "classnames";
interface MyButtonProps {
  title: string;
  onClick: () => void;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  color?: string;
  paddingLeft?: string;
  paddingRight?: string;
  rounded?: string;
  borderWidth?: string;
  border: "border";
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: string;
  height?: string;
  textAlign?: string;
  fontFamily?: string;
  isShadow?: boolean;
  isActive?: boolean;
}

const MyButton: React.FC<MyButtonProps> = ({
  title,
  onClick,
  padding = "py-2 px-4",
  paddingTop = "py-2",
  backgroundColor = "bg-white",
  paddingBottom = "pb-2",
  color = "text-black",
  paddingLeft = "pl-4",
  paddingRight = "pr-4",
  rounded = "rounded-lg",
  borderWidth = "border-0",
  borderColor = "border-transparent",
  fontSize = "text-base",
  fontWeight = "font-normal",
  width = "w-full",
  height = "h-12",
  textAlign = "text-center",
  fontFamily = "font-sans",
  isShadow = false,
  isActive = false,
}) => {
  const activeBackgroundColor = isActive ? "bg-red-500" : backgroundColor;
  const activeTextColor = isActive ? "text-white" : color;
  return (
    <button
      onClick={onClick}
      className={classNames(
        `${padding} ${paddingTop} ${paddingBottom} ${paddingLeft} ${paddingRight}`,
        activeBackgroundColor,
        activeTextColor,
        rounded,
        borderWidth,
        borderColor,
        fontSize,
        fontWeight,
        textAlign,
        backgroundColor,
        fontFamily,
        width,
        height,
        "flex items-center justify-center", // Center the text
        { "shadow-lg": isShadow } // Conditional shadow
      )}
    >
      {title}
    </button>
  );
};

export default MyButton;
