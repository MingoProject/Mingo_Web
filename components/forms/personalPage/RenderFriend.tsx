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
    let isMounted = true;
    const myFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyFriends(userId);
        if (isMounted) {
          setFriends(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myFriends();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const myBffs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyBffs(userId);
        if (isMounted) {
          setBffs(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myBffs();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const myFollowings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyFollowings(userId);
        if (isMounted) {
          setFollowings(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myFollowings();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const myBlocks = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyBlocks(userId);
        if (isMounted) {
          setBlocks(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myBlocks();
    return () => {
      isMounted = false;
    };
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
