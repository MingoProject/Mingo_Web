import { useAuth } from "@/context/AuthContext";
import { FriendResponseDTO } from "@/dtos/FriendDTO";
import { requestAddFriend } from "@/lib/services/friend.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface SuggestedFriendCardProps {
  suggestedFriend: FriendResponseDTO;
  setSuggestedFriends: React.Dispatch<
    React.SetStateAction<FriendResponseDTO[]>
  >;
}

const SuggestedFriendCard: React.FC<SuggestedFriendCardProps> = ({
  suggestedFriend,
  setSuggestedFriends,
}) => {
  const [isRequested, setIsRequested] = useState(false);
  const { profile } = useAuth();
  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !profile?._id) return;

      await requestAddFriend(
        {
          sender: profile._id,
          receiver: suggestedFriend._id,
        },
        token
      );

      setIsRequested(true);
      setSuggestedFriends((prev) =>
        prev.filter((f) => f._id !== suggestedFriend._id)
      );
    } catch (error) {
      console.error("Add friend failed:", error);
    }
  };
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
          <div
            className="pl-[9px] pr-[5px] py-[7px] background-light400_dark400 rounded-full cursor-pointer"
            onClick={handleAddFriend}
          >
            {isRequested ? (
              <Icon
                icon="mingcute:user-follow-2-line"
                width={24}
                height={24}
                className="text-green-500"
              />
            ) : (
              <Icon
                icon="solar:user-plus-broken"
                width={20}
                height={20}
                className="text-primary-100"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedFriendCard;
