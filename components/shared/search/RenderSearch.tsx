import React, { useEffect, useState } from "react";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/post/PostCard";
import UserCard from "../../cards/user/UserSearchCard";
import { fetchUsers } from "@/lib/services/user.service";
import { fetchPosts } from "@/lib/services/post.service";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { PostResponseDTO } from "@/dtos/PostDTO";
import UserSearchCard from "../../cards/user/UserSearchCard";
interface RenderSearchProps {
  activeTab: "all" | "posts" | "users";
  query: string | null;
  profileBasic: UserBasicInfo;
}
const RenderSearch = ({
  activeTab,
  query,
  profileBasic,
}: RenderSearchProps) => {
  console.log("profileBasic", profileBasic);
  const [results, setResults] = useState<any[]>([]);
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [userDisplayCount, setUserDisplayCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;

      const userId = localStorage.getItem("userId") || "{}";
      console.log(userId);

      try {
        const [users, posts] = await Promise.all([
          fetchUsers(userId),
          fetchPosts(),
        ]);

        setPostsData(posts);
        const userResults = users.filter(
          (user) =>
            user.lastName.toLowerCase().includes(query.toLowerCase()) ||
            user.firstName.toLowerCase().includes(query.toLowerCase())
        );

        const postResults = postsData.filter(
          (post) =>
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            userResults.some((user) => user._id === post.author._id)
        );

        const combinedResults =
          activeTab === "users"
            ? userResults.map((user) => ({
                type: "user",
                user,
              }))
            : activeTab === "posts"
              ? postResults.map((post) => ({
                  type: "post",
                  post,
                }))
              : [
                  ...userResults.map((user) => ({
                    type: "user",
                    user,
                  })),
                  ...postResults.map((post) => ({
                    type: "post",
                    post,
                  })),
                ];

        setResults(combinedResults);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [query, activeTab]);

  return (
    <div className="background-light700_dark400 flex w-full flex-col gap-6">
      {activeTab === "posts" &&
        (results.length === 0 ? (
          <NoResult
            title="No Result"
            description="No articles found"
            link="/"
            linkTitle="Back"
          />
        ) : (
          results
            .filter((result) => result.type === "post")
            .map((post) => (
              <PostsCard
                post={post.post}
                profileBasic={profileBasic}
                setPostsData={setPostsData}
              />
            ))
        ))}

      {activeTab === "users" &&
        (results.length === 0 ? (
          <NoResult
            title="No Result"
            description="No users found"
            link="/"
            linkTitle="Back"
          />
        ) : (
          results
            .filter((result) => result.type === "user")
            .map((user) => <UserSearchCard user={user.user} />)
        ))}

      {activeTab === "all" && (
        <>
          {results
            .filter((result) => result.type === "user")
            .slice(0, userDisplayCount)
            .map((user) => (
              <UserSearchCard user={user.user} />
            ))}

          {results.filter((result) => result.type === "user").length >
            userDisplayCount && (
            <button
              onClick={() => setUserDisplayCount((prevCount) => prevCount + 5)}
              className="text-dark100_light500"
            >
              More
            </button>
          )}

          {results
            .filter((result) => result.type === "post")
            .map((post) => (
              <PostsCard
                post={post.post}
                profileBasic={profileBasic}
                setPostsData={setPostsData}
              />
            ))}

          {results.length === 0 && (
            <NoResult
              title="No Result"
              description="No results found"
              link="/"
              linkTitle="Back"
            />
          )}
        </>
      )}
    </div>
  );
};

export default RenderSearch;
