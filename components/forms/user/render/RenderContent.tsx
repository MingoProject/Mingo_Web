import React, { useEffect, useState } from "react";
import PostsCard from "@/components/cards/post/PostCard";
import NoResult from "@/components/shared/NoResult";
import OpenCreatePost from "../../../shared/post/OpenCreatePost";
import RenderFriend from "./RenderFriend";
import FilterPost from "../../FilterPost";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { getMyPosts } from "@/lib/services/user.service";
import Images from "../../../shared/user/Images";
import Videos from "../../../shared/user/Videos";
import { UserBasicInfo, UserResponseDTO } from "@/dtos/UserDTO";

interface RenderContentProps {
  activeTab: "posts" | "friends" | "photos" | "videos" | string;
  profileUser: UserResponseDTO;
  profileBasic: UserBasicInfo;
  isMe: boolean;
}

const RenderContentPage = ({
  activeTab,
  profileUser,
  profileBasic,
  isMe,
}: RenderContentProps) => {
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    let isMounted = true;
    const myPosts = async () => {
      try {
        const data = await getMyPosts(profileUser._id);
        if (isMounted) {
          setPostsData(data.userPosts);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myPosts();
    return () => {
      isMounted = false;
    };
  }, [profileUser._id]);

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
      isMounted = false;
    };
  }, [selectedFilter, postsData]);

  switch (activeTab) {
    case "posts":
      return (
        <div className="">
          <div className="flex flex-col gap-[15px]">
            {isMe && (
              <OpenCreatePost me={profileBasic} setPostsData={setPostsData} />
            )}

            {/* <div className="my-2 flex items-center">
              <div className="ml-auto flex shrink-0 items-center pl-4">
                <p className="text-dark100_light500 mr-2">Filter: </p>
                <FilterPost
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                />
              </div>
            </div> */}
            <div className="background-light700_dark400  flex w-full flex-col gap-[15px]">
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
                    post={post}
                    profileBasic={profileBasic}
                    setPostsData={setFilteredPosts}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      );
    case "friends":
      return (
        <RenderFriend profileBasic={profileBasic} profileUser={profileUser} />
      );
    case "photos":
      return <Images profileBasic={profileBasic} profileUser={profileUser} />;
    case "videos":
      return <Videos profileBasic={profileBasic} profileUser={profileUser} />;
    default:
      return <div></div>;
  }
};

export default RenderContentPage;
