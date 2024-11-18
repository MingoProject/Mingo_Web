import React, { useEffect, useState } from "react";
import fakeFriends from "../../../fakeData/FriendsData";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { UserResponseDTO } from "@/dtos/UserDTO";
import { getMyFriends } from "@/lib/services/user.service";

const FriendList = ({ friends }: any) => (
  <div className="grid grid-cols-2 gap-4">
    {friends.map((friend: any, index: number) => (
      <div
        key={index}
        className="text-dark100_light500 flex w-3/5 items-center"
      >
        <Image
          width={80}
          height={80}
          src={
            friend?.avatar ||
            "/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"
          }
          alt={friend.lastName}
          className="mb-2 size-20 rounded-full object-cover"
        />
        <div className="mb-1 ml-2 font-bold">{friend.lastName}</div>
        <Icon
          icon="mdi:dots-horizontal"
          className="text-dark100_light500 ml-auto size-6"
        />
      </div>
    ))}
  </div>
);

const RenderFriend = ({ activeTabFriend }: any) => {
  const [friends, setFriends] = useState<UserResponseDTO[]>([]);

  useEffect(() => {
    const myFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyFriends(userId);
        setFriends(data);
        console.log(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myFriends();
  }, []);
  const getFriendsList = () => {
    switch (activeTabFriend) {
      case "all":
        return friends;
      case "bestfriend":
        return fakeFriends;
      case "followed":
        return fakeFriends;
      case "blocked":
        return fakeFriends;
      default:
        return [];
    }
  };

  return <FriendList friends={getFriendsList()} />;
};

export default RenderFriend;
