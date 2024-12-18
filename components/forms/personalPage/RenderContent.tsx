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
  profileUser,
  me,
  isMe,
}: {
  activeTab: string;
  profileUser: any;
  me: any;
  isMe: boolean;
}) => {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);

  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    let isMounted = true;
    const myPosts = async () => {
      try {
        const data = await getMyPosts(profileUser._id);
        if (isMounted) {
          setPosts(data.userPosts);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myPosts();
    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [profileUser._id]);

  useEffect(() => {
    let isMounted = true;
    const fetchPostsData = async () => {
      if (posts && posts.length > 0) {
        // Ensure post is defined before checking length
        const detailedPosts = await fetchDetailedPosts(posts); // Sử dụng hàm chuyển đổi

        if (isMounted) {
          setPostsData(detailedPosts);
        }
      }
    };

    fetchPostsData();
    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [posts]);

  const [selectedFilter, setSelectedFilter] =
    React.useState<string>("Mới nhất");
  const [filteredPosts, setFilteredPosts] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    let isMounted = true;
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
    if (isMounted) {
      setFilteredPosts(sortedPosts);
    }

    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
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
            {isMe && <OpenCreatePost me={me} />}

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
                    tags={post.tags || []}
                    privacy={post.privacy}
                    profile={me}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      );
    case "friends":
      return <RenderFriend />;
    case "photos":
      return <Images me={me} profileUser={profileUser} />;
    case "videos":
      return <Videos me={me} profileUser={profileUser} />;
    default:
      return <div>Chọn một mục để hiển thị nội dung</div>;
  }
};

export default RenderContentPage;
