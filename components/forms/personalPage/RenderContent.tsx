import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostsCard from "@/components/cards/PostsCard";
import NoResult from "@/components/shared/NoResult";
import OpenCreatePost from "../post/OpenCreatePost";
import RenderFriend from "./RenderFriend";
import FilterPost from "../FilterPost";
import { PostResponseDTO } from "@/dtos/PostDTO";
import fetchDetailedPosts from "@/hooks/usePosts";
import {
  getMyBffs,
  getMyFriends,
  getMyPosts,
} from "@/lib/services/user.service";
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
  const [friends, setFriends] = useState<any[]>();

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

  const [selectedFilter, setSelectedFilter] = React.useState<string>("Newest");
  const [filteredPosts, setFilteredPosts] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    let isMounted = true;
    const sortedPosts = [...postsData];
    if (selectedFilter === "Newest") {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (selectedFilter === "Oldest") {
      sortedPosts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (selectedFilter === "Most popular") {
      sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
    }
    if (isMounted) {
      setFilteredPosts(sortedPosts);
    }

    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [selectedFilter, postsData]);

  useEffect(() => {
    let isMounted = true;
    const fetchFriends = async () => {
      try {
        const friendsData = await getMyFriends(profileUser._id);
        const bffsData = await getMyBffs(profileUser._id);
        const combinedFriends = [...bffsData, ...friendsData];

        const uniqueFriends = combinedFriends.filter(
          (friend, index, self) =>
            index === self.findIndex((f) => f._id === friend._id)
        );

        if (isMounted) {
          setFriends(uniqueFriends);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();

    return () => {
      isMounted = false;
    };
  }, [profileUser._id]);

  switch (activeTab) {
    case "posts":
      return (
        <div className="mx-[2%] flex pt-6 lg:mx-[15%]">
          <div className="hidden w-5/12 pt-6 lg:block">
            <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Friends
            </div>
            <ul className="mt-5 space-y-4">
              {friends &&
                friends.map((friend, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <Image
                      width={48}
                      height={48}
                      src={
                        friend?.avatar ||
                        "https://i.pinimg.com/736x/f5/69/55/f569552914826d73dc72048b8ef7aa45.jpg"
                      }
                      alt={friend.lastName}
                      className="size-12 rounded-full object-cover"
                    />
                    <span className="text-dark100_light500 font-medium">
                      {friend.firstName} {friend.lastName}
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
                    setPostsData={setFilteredPosts}
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
