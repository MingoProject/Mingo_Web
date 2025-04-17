import Button from "@/components/ui/button";
import { UserBasicInfo } from "@/dtos/UserDTO";
import Image from "next/image";
import React from "react";

interface FriendCardProps {
  friend: UserBasicInfo;
  //   mutualFriends: number;
  //   mutualFriendAvatars: string[];
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  //   mutualFriends,
  //   mutualFriendAvatars,
  //   onAccept,
  //   onDecline,
}) => {
  return (
    <div>
      <div className="flex gap-[20px] items-center my-[7px]">
        <Image
          src={friend?.avatar || "/assets/images/capy.jpg"}
          alt="avatar"
          width={40}
          height={40}
          className="size-[40px] rounded-full object-cover"
        />
        <div>
          <span className="text-dark100_light100 text-[16px] font-normal">
            <span className="font-medium">
              {friend?.firstName} {friend?.lastName}
            </span>{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
