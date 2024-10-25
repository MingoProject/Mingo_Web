import React from "react";
import fakeFriends from "../../../fakeData/FriendsData";

import { Icon } from "@iconify/react";
import Image from "next/image";

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
          src={friend.image}
          alt={friend.name}
          className="mb-2 size-20 rounded-full object-cover"
        />
        <div className="mb-1 ml-2 font-bold">{friend.name}</div>
        <Icon
          icon="mdi:dots-horizontal"
          className="text-dark100_light500 ml-auto size-6"
        />
      </div>
    ))}
  </div>
);

const RenderFriend = ({ activeTabFriend }: any) => {
  const getFriendsList = () => {
    switch (activeTabFriend) {
      case "all":
        return fakeFriends;
      case "recently":
        // Implement logic for recently friends if needed
        return fakeFriends; // Replace with filtered recently friends
      case "followed":
        // Implement logic for followed friends if needed
        return fakeFriends; // Replace with filtered followed friends
      case "blocked":
        // Implement logic for blocked friends if needed
        return fakeFriends; // Replace with filtered blocked friends
      default:
        return [];
    }
  };

  return <FriendList friends={getFriendsList()} />;
};

export default RenderFriend;
