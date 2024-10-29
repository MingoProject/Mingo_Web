// app/components/shared/search/UserCard.tsx
import React from "react";
import Image from "next/image";

interface UserCardProps {
  userId: string;
  name: string;
  username: string;
  avatar: string;
  onClick: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  name,
  username,
  avatar,
  onClick,
}) => {
  return (
    <div
      key={userId}
      onClick={() => onClick(userId)}
      style={{ cursor: "pointer" }}
      className="mb-4 flex items-center rounded-xl border p-3"
    >
      <Image
        src={avatar}
        alt={username}
        width={56}
        height={56}
        className="mr-2 size-14 rounded-full "
      />
      <div>
        <span className="text-dark100_light500 text-lg font-semibold">
          {name}
        </span>
        <h5 className="text-primary-100">
          <i>@{username}</i>
        </h5>
      </div>
    </div>
  );
};

export default UserCard;
