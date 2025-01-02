import React from "react";

interface ButtonCloseProps {
  onClick: () => void;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-dark100_light500 py-2 rounded-md px-3 background-light800_dark400 hover:bg-gray-300 focus:outline-none"
      aria-label="Close"
    >
      Close
    </button>
  );
};

export default ButtonClose;
