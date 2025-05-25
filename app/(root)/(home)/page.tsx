"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/post/PostCard";
import OpenCreatePost from "@/components/shared/post/OpenCreatePost";
import FilterPost from "@/components/forms/FilterPost";
import {
  fetchPosts,
  fetchRelevantPosts,
  fetchTrendingPosts,
} from "@/lib/services/post.service";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { useAuth } from "@/context/AuthContext";
import { UserBasicInfo } from "@/dtos/UserDTO";
import {
  getMyBffs,
  getMyFollowers,
  getMyFriends,
} from "@/lib/services/user.service";
import FriendRequestCard from "@/components/cards/friend/FriendRequestCard";
import Input from "@/components/ui/input";
import FriendCard from "@/components/cards/friend/FriendCardHome";
import { removeVietnameseTones } from "@/lib/utils";
import { suggestFriends } from "@/lib/services/friend.service";
import SuggestedFriendCard from "@/components/cards/friend/SuggestedFriendCard";
import { FriendResponseDTO } from "@/dtos/FriendDTO";

export default function Home() {
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [trendingPostsData, settrendingPostsData] = useState<PostResponseDTO[]>(
    []
  );

  const { profile } = useAuth();
  const [invitations, setInvitations] = useState<FriendResponseDTO[]>([]);
  // const [chats, setChats] = useState<any[]>([]);
  const [combinedFriends, setCombinedFriends] = useState<UserBasicInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestedFriends, setSuggestedFriends] = useState<any[]>([]);

  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };

  useEffect(() => {
    let isMounted = true;
    const loadPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await fetchRelevantPosts(token);
        if (isMounted) {
          setPostsData(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadTrendingPosts = async () => {
      try {
        const data = await fetchTrendingPosts();
        if (isMounted) {
          settrendingPostsData(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    loadTrendingPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const myFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const Followers: FriendResponseDTO[] = await getMyFollowers(userId);

        if (isMounted) {
          setInvitations(Followers.slice(0, 2)); // lấy 2 người đầu tiên
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
    const loadFriendsAndBffs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const [friendsData, bffsData] = await Promise.all([
          getMyFriends(userId),
          getMyBffs(userId),
        ]);

        const mergedList = [...bffsData, ...friendsData];

        if (isMounted) {
          setCombinedFriends(mergedList);
        }
      } catch (error) {
        console.error("Error loading friends and bffs:", error);
      }
    };

    loadFriendsAndBffs();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getSuggestFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const results = await suggestFriends(token);
        if (isMounted) {
          setSuggestedFriends(results);
        }
      } catch (error) {
        console.error("Error loading friends and bffs:", error);
      }
    };

    getSuggestFriends();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFriends = combinedFriends.filter((friend) =>
    removeVietnameseTones(`${friend.firstName} ${friend.lastName}`).includes(
      removeVietnameseTones(searchTerm)
    )
  );

  // const [selectedFilter, setSelectedFilter] =
  //   React.useState<string>("Mới nhất");
  // const [filteredPosts, setFilteredPosts] = useState<PostResponseDTO[]>([]);

  // useEffect(() => {
  //   let isMounted = true;
  //   const sortedPosts = [...postsData];
  //   if (selectedFilter === "Mới nhất") {
  //     sortedPosts.sort(
  //       (a, b) =>
  //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //     );
  //   } else if (selectedFilter === "Cũ nhất") {
  //     sortedPosts.sort(
  //       (a, b) =>
  //         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //     );
  //   } else if (selectedFilter === "Hot nhất") {
  //     sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
  //   }
  //   if (isMounted) {
  //     setFilteredPosts(sortedPosts);
  //   }

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [selectedFilter, postsData]);

  return (
    <div className="background-light800_dark400 mt-[20px] flex w-full pt-[70px] justify-between px-[16px]">
      <div className="background-light800_dark400 hidden w-[25%] lg:block">
        {profile && (
          <div className="flex flex-col gap-[25px]">
            <div className="mt-3 flex items-center gap-3">
              <Image
                src={profile?.avatar || "/assets/images/capy.jpg"}
                alt="Avatar"
                width={70}
                height={70}
                className="size-[70px] rounded-full object-cover"
              />
              <div className="text-dark100_light100 font-normal">
                <span className="text-[32px] block">
                  Hello {profile.lastName},
                </span>
                <span className="text-[16px] block">How are you today?</span>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="font-semibold text-[16px] text-dark100_light100">
                  Requests
                </span>
                <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
                  See all
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {suggestedFriends.length > 0 &&
                  suggestedFriends.map((suggestedFriend) => (
                    <SuggestedFriendCard suggestedFriend={suggestedFriend} />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="background-light800_dark400 w-[645px] flex flex-col gap-[15px] justify-center px-3 lg:w-[44%]">
        <OpenCreatePost me={profile} setPostsData={setPostsData} />

        <div className="background-light800_dark400 flex w-full flex-col gap-[15px]">
          {PostsCard.length === 0 ? (
            <NoResult
              title="No Result"
              description="No posts found"
              link="/"
              linkTitle="Reload"
            />
          ) : (
            [...postsData]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((post) => (
                <PostsCard
                  key={post._id}
                  post={post}
                  profileBasic={profileBasic}
                  setPostsData={setPostsData}
                />
              ))
          )}
        </div>
      </div>

      <div className="background-light800_dark400 flex-col gap-[25px] hidden items-center justify-center bg-light-600 px-1 md:block md:w-[45%] lg:w-[25%]">
        <div>
          <div className="mb-1 flex justify-between">
            <span className="font-semibold text-[16px] text-dark100_light100">
              Requests
            </span>
            <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
              See all
            </span>
          </div>
          <div>
            {invitations.length > 0 &&
              invitations.map((invitation) => (
                <FriendRequestCard
                  follower={invitation}
                  profileBasic={profileBasic}
                />
              ))}
          </div>
        </div>
        <div className="mt-[25px]">
          <div className="mb-1 flex justify-between">
            <span className="font-semibold text-[16px] text-dark100_light100">
              Friends
            </span>
            <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
              See all
            </span>
          </div>

          <div className="px-[13px] py-[15px] rounded-[10px] flex flex-col gap-[10px] background-light200_dark200">
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
            {filteredFriends.length > 0 &&
              filteredFriends.map((friend) => <FriendCard friend={friend} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
