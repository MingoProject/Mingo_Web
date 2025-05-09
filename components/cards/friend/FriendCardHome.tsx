import { UserBasicInfo } from "@/dtos/UserDTO";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FriendCardProps {
  friend: UserBasicInfo;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  return (
    <div>
      <div className="flex gap-[20px] items-center my-[7px]">
        <Link href={`/profile/${friend?._id || ""}`}>
          <Image
            src={friend?.avatar || "/assets/images/capy.jpg"}
            alt="avatar"
            width={40}
            height={40}
            className="size-[40px] rounded-full object-cover"
          />
        </Link>

        <div>
          <span className="text-dark100_light100 text-[16px] font-normal">
            <Link href={`/profile/${friend?._id || ""}`}>
              <span className="font-medium cursor-pointer hover:underline">
                {friend?.firstName} {friend?.lastName}
              </span>
            </Link>{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
