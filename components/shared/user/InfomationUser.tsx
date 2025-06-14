import { formattedDate } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import UpdateInformation from "../../forms/user/UpdateInformation";
import { UserResponseDTO } from "@/dtos/UserDTO";
import TitleIcon from "@/components/ui/titleIcon";
import Tag from "@/components/ui/tag";

interface InfomationUserProps {
  user: UserResponseDTO;
  setProfileUser: any;
  isMe: boolean;
}

const InfomationUser = ({
  user,
  setProfileUser,
  isMe,
}: InfomationUserProps) => {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="w-[486px] ">
      <div className="ml-[5%] mt-4 block w-full ">
        <span className="text-dark100_light100 text-4 font-semibold">
          Information
        </span>
        <div className="flex flex-col gap-[15px] mt-[10px] p-5 background-light200_dark200 rounded-[10px] shadow-subtle">
          {user?.address && (
            <TitleIcon iconSrc="mynaui:location" content={user?.address} />
          )}
          {user?.job && (
            <TitleIcon iconSrc="basil:bag-outline" content={user?.job} />
          )}
          {user?.relationShip && (
            <TitleIcon
              iconSrc="solar:heart-outline"
              content={user?.relationShip}
            />
          )}
          {user?.birthDay && (
            <TitleIcon
              iconSrc="fluent-mdl2:birthday-cake"
              content={formattedDate(user?.birthDay)}
            />
          )}
          {user?.gender && (
            <TitleIcon
              iconSrc={user?.gender ? "ph:gender-male" : "ph:gender-female"}
              content={user?.gender ? "Male" : "Female"}
            />
          )}
          {user?.email && (
            <TitleIcon iconSrc="solar:letter-linear" content={user?.email} />
          )}
          {user?.attendDate && (
            <TitleIcon
              iconSrc="solar:calendar-linear"
              content={formattedDate(user?.attendDate)}
            />
          )}
          {user?.hobbies.length > 0 && (
            <div className="flex items-center gap-[10px]">
              <Icon icon="cbi:hobby" className="size-6 text-dark100_light100" />
              <div className="text-dark100_light100 flex flex-wrap gap-2">
                {user?.hobbies.map((hobby, index) => (
                  <div key={index}>
                    <Tag content={hobby} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex ml-auto items-center">
            {isMe && (
              <div className="p-[7px] background-light400_dark400 rounded-full">
                <Icon
                  icon="solar:pen-broken"
                  className="text-primary-100 size-[20px]"
                  onClick={() => setShowEdit(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <UpdateInformation
          user={user}
          setProfileUser={setProfileUser}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
};

export default InfomationUser;
