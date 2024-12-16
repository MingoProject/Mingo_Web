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
import Invitations from "./Invitations";

const FriendList = ({
  friends,
  setActiveTabFriend,
  activeTabFriend,
  searchTerm,
  setSearchTerm,
  setOpenInvitations,
}: any) => (
  <div className="mx-[8%] ">
    <div className="flex w-full items-center">
      <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
        Friends
      </div>

      <div className=" ml-[30%] flex grow">
        {" "}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="background-light800_dark300 text-dark100_light500 w-11/12 rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div
        onClick={() => setOpenInvitations(true)}
        className="flex h-[39px] w-[150px] items-center justify-center rounded-lg border border-primary-100 bg-primary-100 text-white"
      >
        Lời mời kết bạn
      </div>
    </div>
    <div className="mt-5">
      <div className="mb-4 flex space-x-4">
        <button
          className={`w-20 rounded-lg p-2 ${activeTabFriend === "friend" ? "bg-primary-100 text-white" : "background-light800_dark300 text-light-500 dark:text-white"}`}
          onClick={() => setActiveTabFriend("friend")}
        >
          Friend
        </button>
        <button
          className={`w-32 rounded-lg p-2 ${activeTabFriend === "bestfriend" ? "bg-primary-100 text-white" : "background-light800_dark300 text-light-500 dark:text-white "}`}
          onClick={() => setActiveTabFriend("bestfriend")}
        >
          Best Friend
        </button>
        <button
          className={`w-24 rounded-lg p-2 ${activeTabFriend === "followed" ? "bg-primary-100 text-white" : "background-light800_dark300 text-light-500 dark:text-white "}`}
          onClick={() => setActiveTabFriend("followed")}
        >
          Following
        </button>
        <button
          className={`w-24 rounded-lg p-2 ${activeTabFriend === "blocked" ? "bg-primary-100 text-white" : "background-light800_dark300 text-light-500 dark:text-white"}`}
          onClick={() => setActiveTabFriend("blocked")}
        >
          Blocked
        </button>
      </div>

      <div className="mx-[5%] mt-10">
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

              <div className="mb-1 ml-2 font-bold">
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

const RenderFriend = () => {
  const [friends, setFriends] = useState<UserResponseDTO[]>([]);
  const [bffs, setBffs] = useState<UserResponseDTO[]>([]);
  const [followings, setFollowings] = useState<UserResponseDTO[]>([]);
  const [blocks, setBlocks] = useState<UserResponseDTO[]>([]);
  const [activeTabFriend, setActiveTabFriend] = useState("friend");
  const [searchTerm, setSearchTerm] = useState("");
  const [openInvitations, setOpenInvitations] = useState(false);

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
    const list =
      activeTabFriend === "friend"
        ? friends
        : activeTabFriend === "bestfriend"
          ? bffs
          : activeTabFriend === "followed"
            ? followings
            : activeTabFriend === "blocked"
              ? blocks
              : [];

    // Lọc danh sách theo searchTerm
    return list.filter((friend) =>
      friend.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
        setOpenInvitations={setOpenInvitations}
      />
      {openInvitations && (
        <Invitations onClose={() => setOpenInvitations(false)} />
      )}
    </>
  );
};

export default RenderFriend;
