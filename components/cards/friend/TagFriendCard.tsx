import React from "react";
import Image from "next/image";

interface TagFriendCardProps {
  avatar: string;
  firstName: string;
  lastName: string;
  onClick: () => void;
}

const TagFriendCard: React.FC<TagFriendCardProps> = ({
  avatar,
  firstName,
  lastName,
  onClick,
}) => {
  return (
    <div className="text-dark100_light100 flex gap-[8px] items-center px-[15px] py-[10px] rounded-full background-light400_dark400">
      <Image
        src={avatar || "/assets/images/capy.jpg"}
        width={20}
        height={20}
        alt="avatar"
        className="rounded-full mr-2"
      />
      <span className="text-[14px] font-medium">
        {firstName} {lastName}
      </span>
      <button onClick={onClick} className="ml-2 text-xs">
        ✖
      </button>
    </div>
  );
};

export default TagFriendCard;
