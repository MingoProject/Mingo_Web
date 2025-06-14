// components/Button.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface TitleIconProps {
  iconSrc: string;
  content: string;
  className?: string;
}

const TitleIcon: React.FC<TitleIconProps> = ({
  iconSrc,
  content,
  className,
}) => {
  return (
    <div
      className={`text-dark100_light100 flex gap-[15px] items-center ${className}`}
    >
      <Icon icon={iconSrc} className="size-6" />
      <span className="text-4 font-normal">{content}</span>
    </div>
  );
};

export default TitleIcon;
