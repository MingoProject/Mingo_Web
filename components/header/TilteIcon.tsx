import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const TilteIcon = ({
  title,
  icon,
}: {
  title: string;
  icon?: IconDefinition;
}) => {
  return (
    <div className="w-full pt-4 pb-2 border-b border-border-color flex items-center justify-start gap-2">
      {icon && <FontAwesomeIcon icon={icon} />}{" "}
      {/* Render icon chỉ khi tồn tại */}
      <span className="text-[24px] font-sans">{title}</span>
    </div>
  );
};

export default TilteIcon;
