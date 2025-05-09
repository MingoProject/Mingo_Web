import { FriendResponseDTO } from "@/dtos/FriendDTO";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SuggestedFriendCardProps {
  suggestedFriend: FriendResponseDTO;
}

const SuggestedFriendCard: React.FC<SuggestedFriendCardProps> = ({
  suggestedFriend,
}) => {
  return (
    <div className="background-light200_dark200 rounded-[10px] py-[15px] px-[13px] shadow-subtle w-full flex flex-col">
      <div className="flex gap-[10px] ">
        <Link href={`/profile/${suggestedFriend?._id || ""}`}>
          <Image
            src={suggestedFriend?.avatar || "/assets/images/capy.jpg"}
            alt="avatar"
            width={50}
            height={50}
            className="size-[50px] rounded-full object-cover"
          />
        </Link>

        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-dark100_light100 text-[16px] font-normal">
              <Link href={`/profile/${suggestedFriend?._id || ""}`}>
                <span className="font-medium cursor-pointer hover:underline">
                  {suggestedFriend?.firstName} {suggestedFriend?.lastName}
                </span>
              </Link>{" "}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-2">
                {suggestedFriend.mutualFriends.slice(0, 3).map((img, index) => (
                  <Image
                    key={index}
                    src={img.avatar ?? "/assets/images/capy.jpg"}
                    alt="mutual"
                    width={20}
                    height={20}
                    className="size-[20px] rounded-full border border-white"
                  />
                ))}
              </div>
              <p className="text-[14px] font-normal text-dark100_light100">
                {suggestedFriend.mutualFriends.length} mutual friends
              </p>
            </div>
          </div>
          <div className="pl-[9px] pr-[5px] py-[7px] background-light400_dark400 rounded-full">
            <Icon
              icon="solar:user-plus-broken"
              className="text-primary-100 size-[20px] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedFriendCard;
