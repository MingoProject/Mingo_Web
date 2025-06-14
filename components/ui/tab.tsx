import React from "react";

interface TabProps {
  content: string;
  isActive: boolean;
  onClick?: () => void;
}

const Tab: React.FC<TabProps> = ({ content, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`items-center px-[15px] py-[10px] rounded-full cursor-pointer flex justify-center w-fit ${isActive ? "bg-primary-100 text-dark100_light100" : "background-light400_dark400 text-dark300_light300"} `}
    >
      <span className="text-[14px] font-medium">{content}</span>
    </div>
  );
};

export default Tab;
