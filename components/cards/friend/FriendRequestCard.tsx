import FriendRequestAction from "@/components/forms/friend/FriendRequestAction";
import { FriendResponseDTO } from "@/dtos/FriendDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import Image from "next/image";
import React from "react";

interface FriendRequestCardProps {
  follower: FriendResponseDTO;
  profileBasic: UserBasicInfo;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  follower,
  profileBasic,
}) => {
  return (
    <div className="background-light200_dark200 rounded-[10px] py-[15px] px-[13px] shadow-subtle w-full flex flex-col">
      <div className="flex gap-[10px] ">
        <Image
          src={follower?.avatar || "/assets/images/capy.jpg"}
          alt="avatar"
          width={50}
          height={50}
          className="size-[50px] rounded-full object-cover"
        />
        <div>
          <span className="text-dark100_light100 text-[16px] font-normal">
            <span className="font-medium">
              {follower?.firstName} {follower?.lastName}
            </span>{" "}
            sent you friend request
          </span>
          {follower.mutualFriends.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-2">
                {follower.mutualFriends.slice(0, 3).map((img, index) => (
                  <Image
                    key={index}
                    src={img.avatar ?? "/assets/images/capy.jpg"}
                    alt="mutual"
                    width={20}
                    height={20}
                    className=" size-[20px] rounded-full border border-white"
                  />
                ))}
              </div>
              <p className="text-[14px] font-normal text-dark100_light100">
                {follower.mutualFriends.length} mutual friends
              </p>
            </div>
          )}

          <div className="mt-2">
            <FriendRequestAction
              senderId={follower._id}
              receiverId={profileBasic._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;
