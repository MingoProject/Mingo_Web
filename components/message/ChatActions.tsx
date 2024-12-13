import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

function ChatActions({
  onDelete,
  onRevoke,
}: {
  onDelete: () => void;
  onRevoke: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Icon ba chấm */}
      <Icon
        icon="ph:dots-three-vertical-bold"
        className="text-dark100_light500 ml-auto size-5"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Menu bật lên */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-fit  bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            className="block w-full text-center px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
            onClick={() => {
              onDelete();
              setIsMenuOpen(false);
            }}
          >
            Delete
          </button>

          <button
            className="block w-full text-center px-4 py-2 rounded-md text-sm text-blue-600 hover:bg-blue-50"
            onClick={() => {
              onRevoke();
              setIsMenuOpen(false);
            }}
          >
            Revoke
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatActions;
