import React from "react";

interface NameCardProps {
  name: string;
}

const NameCard: React.FC<NameCardProps> = ({ name }) => {
  return (
    <div className="bg-primary-100 py-[10px] px-10 w-fit rounded-r-[15px]">
      <span className="text-dark100_light100 font-semibold text-[16px]">
        {name}
      </span>
    </div>
  );
};

export default NameCard;
