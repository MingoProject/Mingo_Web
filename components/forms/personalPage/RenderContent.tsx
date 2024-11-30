import React, { useEffect, useState } from "react";
import fakeFriends from "../../../fakeData/FriendsData";
import Image from "next/image";
import PostsCard from "@/components/cards/PostsCard";
import NoResult from "@/components/shared/NoResult";
import OpenCreatePost from "../post/OpenCreatePost";
import RenderFriend from "./RenderFriend";
import FilterPost from "../FilterPost";
import { PostResponseDTO } from "@/dtos/PostDTO";
import fetchDetailedPosts from "@/hooks/usePosts";
import { getMyPosts } from "@/lib/services/user.service";
import Images from "./Images";
import Videos from "./Videos";

const RenderContentPage = ({
  activeTab,
  profile,
}: {
  activeTab: string;
  profile: any;
}) => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [activeTabFriend, setActiveTabFriend] = useState("all");
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId); // Chỉ gọi setUserId nếu giá trị không phải null
      }
    } catch (error) {
      console.error("Error loading userId:", error);
    }
  }, []);

  useEffect(() => {
    const myPosts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyPosts(userId);
        setPosts(data.userPosts);
        console.log("myposts", data.userPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myPosts();
  }, []);

  useEffect(() => {
    const fetchPostsData = async () => {
      if (posts && posts.length > 0) {
        // Ensure post is defined before checking length
        const detailedPosts = await fetchDetailedPosts(posts); // Sử dụng hàm chuyển đổi
        setPostsData(detailedPosts);
      }
    };

    fetchPostsData();
  }, [posts]);

  const [selectedFilter, setSelectedFilter] =
    React.useState<string>("Mới nhất");
  const [filteredPosts, setFilteredPosts] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    const sortedPosts = [...postsData];
    if (selectedFilter === "Mới nhất") {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (selectedFilter === "Cũ nhất") {
      sortedPosts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (selectedFilter === "Hot nhất") {
      sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
    }
    setFilteredPosts(sortedPosts);
  }, [selectedFilter, postsData]);

  // if (loading) return <div className="mt-96">Loading...</div>;
  // if (error) return <div className="mt-96">Error: {error}</div>;

  switch (activeTab) {
    case "posts":
      return (
        <div className="mx-[2%] flex pt-6 lg:mx-[15%]">
          <div className="hidden w-5/12 pt-6 lg:block">
            <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Friends
            </div>
            <ul className="mt-5 space-y-4">
              {fakeFriends.map((friend, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <Image
                    width={48}
                    height={48}
                    src={friend.image}
                    alt={friend.name}
                    className="size-12 rounded-full"
                  />
                  <span className="text-dark100_light500 font-medium">
                    {friend.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-7/12">
            <OpenCreatePost />
            <div className="my-2 flex items-center">
              <div className="ml-auto flex shrink-0 items-center pl-4">
                <p className="text-dark100_light500 mr-2">Filter: </p>
                <FilterPost
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                />
              </div>
            </div>
            <div className="background-light700_dark400  flex w-full flex-col gap-6">
              {filteredPosts.length === 0 ? (
                <NoResult
                  title="No Result"
                  description="No articles found"
                  link="/"
                  linkTitle="Trở lại"
                />
              ) : (
                filteredPosts.map((post) => (
                  <PostsCard
                    key={post._id}
                    postId={post._id}
                    author={post.author}
                    content={post.content}
                    media={post.media}
                    createdAt={post.createdAt}
                    likes={post.likes || []}
                    comments={post.comments || []}
                    shares={post.shares || []}
                    location={post.location}
                    privacy={post.privacy}
                    profile={profile}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      );
    case "friends":
      return (
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
                className="background-light800_dark300 w-11/12 rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex h-[39px] w-[150px] items-center justify-center rounded-lg border border-primary-100 bg-primary-100 text-white">
              Lời mời kết bạn
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-4 flex space-x-4">
              <button
                className={`w-20 rounded-lg p-2 ${activeTabFriend === "all" ? "bg-primary-100 text-white" : "background-light800_dark300 text-light-500 dark:text-white"}`}
                onClick={() => setActiveTabFriend("all")}
              >
                All
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
              <RenderFriend activeTabFriend={activeTabFriend} />
            </div>
          </div>
        </div>
      );
    case "photos":
      return <Images userId={userId} />;
    case "videos":
      return <Videos userId={userId} />;
    default:
      return <div>Chọn một mục để hiển thị nội dung</div>;
  }
};

export default RenderContentPage;
