import React, { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import Image from "next/image";
import {
  getMyBffs,
  getMyBlocks,
  getMyFollowers,
  getMyFollowings,
  getMyFriends,
} from "@/lib/services/user.service";
import Link from "next/link";
import Input from "@/components/ui/input";
import Tab from "@/components/ui/tab";
import { FriendResponseDTO } from "@/dtos/FriendDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";

interface RenderFriendProps {
  profileUser: UserBasicInfo;
}

const FriendList = ({
  friends,
  setActiveTabFriend,
  activeTabFriend,
  searchTerm,
  setSearchTerm,
}: any) => (
  <div className="flex flex-col gap-[15px]">
    <div className="flex w-full items-center">
      <div>
        <Input
          iconSrc="iconoir:search"
          placeholder="search"
          readOnly={false}
          cursor="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
    <div className="flex flex-col gap-[15px]">
      <div className="flex space-x-2">
        <Tab
          content="Friend"
          isActive={activeTabFriend === "friend"}
          onClick={() => setActiveTabFriend("friend")}
        />
        <Tab
          content="Best Friend"
          isActive={activeTabFriend === "bestfriend"}
          onClick={() => setActiveTabFriend("bestfriend")}
        />
        <Tab
          content="Follower"
          isActive={activeTabFriend === "follower"}
          onClick={() => setActiveTabFriend("follower")}
        />
        <Tab
          content="Following"
          isActive={activeTabFriend === "following"}
          onClick={() => setActiveTabFriend("following")}
        />
        <Tab
          content="Blocked"
          isActive={activeTabFriend === "blocked"}
          onClick={() => setActiveTabFriend("blocked")}
        />
      </div>

      <div className="">
        <div className="grid grid-cols-2 gap-4">
          {friends.map((friend: any, index: number) => (
            <div
              key={index}
              className="text-dark100_light100 flex w-3/5 items-center"
            >
              <Link href={`/profile/${friend._id}`}>
                <Image
                  width={50}
                  height={50}
                  src={
                    friend?.avatar ||
                    "/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"
                  }
                  alt={friend.lastName}
                  className="mb-2 size-[50px] rounded-full object-cover"
                />
              </Link>

              <div className="mb-1 ml-2 font-medium text-4">
                {friend.firstName} {friend.lastName}
              </div>
              <Icon
                icon="mdi:dots-horizontal"
                className="text-dark100_light500 ml-auto size-6"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RenderFriend = ({ profileUser }: RenderFriendProps) => {
  const [friends, setFriends] = useState<FriendResponseDTO[]>([]);
  const [bffs, setBffs] = useState<FriendResponseDTO[]>([]);
  const [followings, setFollowings] = useState<FriendResponseDTO[]>([]);
  const [blocks, setBlocks] = useState<FriendResponseDTO[]>([]);
  const [followers, setFollowers] = useState<FriendResponseDTO[]>([]);
  const [activeTabFriend, setActiveTabFriend] = useState("friend");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const myFriends = async () => {
      try {
        const data = await getMyFriends(profileUser._id);
        if (isMounted) {
          setFriends(data);
        }
      } catch (error) {
        console.error("Error loading friends:", error);
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
        const data = await getMyBffs(profileUser._id);
        if (isMounted) {
          setBffs(data);
        }
      } catch (error) {
        console.error("Error loading bffs:", error);
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
        const data = await getMyFollowings(profileUser._id);
        if (isMounted) {
          setFollowings(data);
        }
      } catch (error) {
        console.error("Error loading followings:", error);
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
        const data = await getMyBlocks(profileUser._id);
        if (isMounted) {
          setBlocks(data);
        }
      } catch (error) {
        console.error("Error loading blockeds:", error);
      }
    };
    myBlocks();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const myFollowers = async () => {
      try {
        const data = await getMyFollowers(profileUser._id);
        if (isMounted) {
          setFollowers(data);
        }
      } catch (error) {
        console.error("Error loading followers:", error);
      }
    };
    myFollowers();
    return () => {
      isMounted = false;
    };
  }, []);

  const getFriendsList = () => {
    const list =
      activeTabFriend === "friend"
        ? friends
        : activeTabFriend === "bestfriend"
          ? bffs
          : activeTabFriend === "following"
            ? followings
            : activeTabFriend === "blocked"
              ? blocks
              : activeTabFriend === "follower"
                ? followers
                : [];

    return list.filter(
      (friend) =>
        friend.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      <FriendList
        friends={getFriendsList()}
        setActiveTabFriend={setActiveTabFriend}
        activeTabFriend={activeTabFriend}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  );
};

export default RenderFriend;
