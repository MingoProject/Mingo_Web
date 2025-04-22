import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Image from "next/image";

interface TagModalProps {
  tags: { _id: string; firstName: string }[];
  isOpen: boolean;
  onClose: () => void;
}

const TagModal: React.FC<TagModalProps> = ({ tags, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="background-light700_dark300 text-dark100_light500 w-full max-w-md rounded-lg p-5 shadow-lg">
        <div className="flex">
          <h2 className="mb-3 text-lg font-semibold">Tagged People</h2>
          <Icon
            icon="ic:round-close"
            className="ml-auto size-6"
            onClick={onClose}
          />
        </div>

        <ul className="space-y-2">
          {tags.map((tag: any) => (
            <li
              key={tag._id}
              className="flex cursor-pointer items-center"
              onClick={() => (window.location.href = `/profile/${tag._id}`)} // Điều hướng đến trang cá nhân
            >
              <Image
                src={tag?.avatar ? tag.avatar : "/assets/images/capy.jpg"}
                alt="Avatar"
                width={45}
                height={45}
                className="mr-2 size-8 rounded-full object-cover"
              />
              {tag.firstName} {tag.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TagModal;
