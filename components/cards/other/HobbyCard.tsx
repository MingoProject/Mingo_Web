import React from "react";
import { Icon } from "@iconify/react";

interface HobbyCardProps {
  name: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

const HobbyCard: React.FC<HobbyCardProps> = ({
  name,
  icon,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer gap-[15px] items-center px-[15px] py-[10px] rounded-full
        ${isSelected ? "bg-primary-100 text-white" : "background-light400_dark400 text-dark100_light100"}
      `}
    >
      <Icon icon={icon} className="text-xl" />
      <span className="text-sm">{name}</span>
    </div>
  );
};

export default HobbyCard;
