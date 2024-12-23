// app/components/shared/search/UserCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface UserCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  nickName: string;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  firstName,
  lastName,
  avatar,
  nickName,
}) => {
  return (
    <div
      key={userId}
      style={{ cursor: "pointer" }}
      className=" flex items-center rounded-xl border p-3 dark:border-gray-800"
    >
      <Link href={`/profile/${userId}`}>
        <Image
          src={avatar || "/assets/images/capy.jpg"}
          alt={lastName}
          width={40}
          height={40}
          className="mr-2 size-10 rounded-full object-cover "
        />
      </Link>

      <div>
        <span className="text-dark100_light500 text-lg font-medium">
          {firstName} {lastName}
        </span>
        <h5 className="text-primary-100">{nickName && <i>@{nickName}</i>}</h5>
      </div>
    </div>
  );
};

export default UserCard;
