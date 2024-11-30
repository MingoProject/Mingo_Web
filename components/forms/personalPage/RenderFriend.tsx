import React, { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { UserResponseDTO } from "@/dtos/UserDTO";
import {
  getMyBffs,
  getMyBlocks,
  getMyFollowings,
  getMyFriends,
} from "@/lib/services/user.service";
import Link from "next/link";

const FriendList = ({ friends }: any) => (
  <div className="grid grid-cols-2 gap-4">
    {friends.map((friend: any, index: number) => (
      <div
        key={index}
        className="text-dark100_light500 flex w-3/5 items-center"
      >
        <Link href={`/profile/${friend._id}`}>
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
        </Link>

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
  const [bffs, setBffs] = useState<UserResponseDTO[]>([]);
  const [followings, setFollowings] = useState<UserResponseDTO[]>([]);
  const [blocks, setBlocks] = useState<UserResponseDTO[]>([]);

  useEffect(() => {
    const myFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyFriends(userId);
        setFriends(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myFriends();
  }, []);

  useEffect(() => {
    const myBffs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyBffs(userId);
        setBffs(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myBffs();
  }, []);

  useEffect(() => {
    const myFollowings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyFollowings(userId);
        setFollowings(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myFollowings();
  }, []);

  useEffect(() => {
    const myBlocks = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyBlocks(userId);
        setBlocks(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myBlocks();
  }, []);
  const getFriendsList = () => {
    switch (activeTabFriend) {
      case "friend":
        return friends;
      case "bestfriend":
        return bffs;
      case "followed":
        return followings;
      case "blocked":
        return blocks;
      default:
        return [];
    }
  };

  return <FriendList friends={getFriendsList()} />;
};

export default RenderFriend;
