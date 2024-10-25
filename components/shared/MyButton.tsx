import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface MyButtonProps {
  title: string;
  onClick?: () => void;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  color?: string;
  paddingLeft?: string;
  paddingRight?: string;
  rounded?: string;
  borderWidth?: string;
  border?: "border";
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
  icon?: IconDefinition; // New prop for FontAwesome icon
  iconPosition?: "left" | "right"; // Option for icon position
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
  icon,
  iconPosition = "left", // Default position for icon
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
        "flex items-center justify-center", // Center the text and icon
        { "shadow-lg": isShadow } // Conditional shadow
      )}
    >
      {icon && iconPosition === "left" && (
        <FontAwesomeIcon icon={icon} className="mr-2" /> // Icon on the left
      )}
      <span>{title}</span>
      {icon && iconPosition === "right" && (
        <FontAwesomeIcon icon={icon} className="ml-2" /> // Icon on the right
      )}
    </button>
  );
};

export default MyButton;
