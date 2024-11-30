// app/components/shared/search/UserCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface UserCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  firstName,
  lastName,
  avatar,
}) => {
  return (
    <div
      key={userId}
      style={{ cursor: "pointer" }}
      className="mb-4 flex items-center rounded-xl border p-3"
    >
      <Link href={`/profile/${userId}`}>
        <Image
          src={avatar || "/assets/images/capy.jpg"}
          alt={lastName}
          width={56}
          height={56}
          className="mr-2 size-14 rounded-full object-cover "
        />
      </Link>

      <div>
        <span className="text-dark100_light500 text-lg font-semibold">
          {firstName} {lastName}
        </span>
        <h5 className="text-primary-100">{/* <i>@{username}</i> */}</h5>
      </div>
    </div>
  );
};

export default UserCard;
