import { FriendResponseDTO } from "@/dtos/FriendDTO";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

interface UserSearchCardProps {
  user: FriendResponseDTO;
}

const UserSearchCard: React.FC<UserSearchCardProps> = ({ user }) => {
  console.log("user", user);
  return (
    <div className="background-light200_dark200 rounded-[10px] py-[15px] px-[13px] shadow-subtle w-full flex flex-col">
      <div className="flex gap-[10px] ">
        <Image
          src={user?.avatar || "/assets/images/capy.jpg"}
          alt="avatar"
          width={50}
          height={50}
          className="size-[50px] rounded-full object-cover"
        />
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-dark100_light100 text-[16px] font-normal">
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-2">
                {user.mutualFriends
                  ?.slice(0, 3)
                  .map((img, index) => (
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
              {user.mutualFriends?.length > 0 && (
                <p className="text-[14px] font-normal text-dark100_light100">
                  {user.mutualFriends?.length} mutual friends
                </p>
              )}
            </div>
          </div>
          {/* <div className="pl-[9px] pr-[5px] py-[7px] background-light400_dark400 rounded-full">
            <Icon
              icon="solar:user-plus-broken"
              className="text-primary-100 size-[20px]"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserSearchCard;
