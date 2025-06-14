import React from "react";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  autoClose?: boolean; // Nếu false, không gọi onClose sau khi click
}

interface DropdownMenuProps {
  items: DropdownItem[];
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, onClose }) => {
  return (
    <div className="absolute right-0 top-6 z-50 w-48 rounded-[10px] background-light400_dark400 shadow-md">
      {items.map((item, index) => (
        <button
          key={index}
          className="block w-full px-4 py-2 text-left text-sm text-dark100_light100 rounded-[10px] hover:bg-primary-100 hover:text-white"
          onClick={() => {
            item.onClick();
            if (item.autoClose !== false) onClose(); // chỉ gọi onClose nếu không bị chặn
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default DropdownMenu;
