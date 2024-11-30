import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/PostsCard";
import UserCard from "./UserCard";
import { fetchUsers } from "@/lib/services/user.service";
import { fetchPosts } from "@/lib/services/post.service";
import fetchDetailedPosts from "@/hooks/usePosts";

const RenderSearch = ({ activeTab, query, profile }: any) => {
  const [results, setResults] = useState<any[]>([]);
  // const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        try {
          const users = await fetchUsers();

          const userResults = users.filter(
            (user) =>
              user.lastName.toLowerCase().includes(query.toLowerCase()) ||
              user.firstName.toLowerCase().includes(query.toLowerCase())
          );

          const posts = await fetchPosts();
          const detailedPosts = await fetchDetailedPosts(posts);

          const postResults = detailedPosts.filter(
            (post) =>
              post.content.toLowerCase().includes(query.toLowerCase()) ||
              userResults.some((user) => user._id === post.author._id)
          );

          const combinedResults =
            activeTab === "friends"
              ? userResults.map((user) => ({
                  type: "user",
                  userId: user._id, // Sử dụng user._id để gán đúng giá trị userId
                  firstName: user.firstName,
                  lastName: user.lastName,
                  avatar: user.avatar,
                }))
              : postResults.map((post) => ({
                  type: "post",
                  postId: post.postId,
                  author: {
                    _id: post.author._id || "unknown",
                    firstName:
                      users.find((user) => user._id === post.author._id)
                        ?.firstName || "Unknown",
                    lastName:
                      users.find((user) => user._id === post.author._id)
                        ?.lastName || "unknown",
                    avatar:
                      users.find((user) => user._id === post.author._id)
                        ?.avatar || "unknown",
                  },
                  content: post.content,
                  media: post.media,
                  createdAt: post.createdAt,
                  likes: post.likes || [],
                  comments: post.comments || [],
                  shares: post.shares || [],
                  location: post.location,
                  privacy: post.privacy,
                }));

          setResults(combinedResults);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [query, activeTab]);

  return (
    <div className="background-light700_dark400 flex w-full flex-col gap-6">
      {activeTab === "posts" ? (
        results.length === 0 ? (
          <NoResult
            title="No Result"
            description="No articles found"
            link="/"
            linkTitle="Trở lại"
          />
        ) : (
          results
            .filter((result) => result.type === "post") // Filter posts
            .map((post) => (
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
        )
      ) : (
        <div>
          {results
            .filter((result) => result.type === "user") // Filter users
            .map((user) => (
              <UserCard
                key={user.userId} // Sử dụng userId đã được ánh xạ đúng
                userId={user.userId}
                firstName={user.firstName}
                lastName={user.lastName}
                avatar={user.avatar}
              />
            ))}
          {results.filter((result) => result.type === "user").length === 0 && (
            <NoResult
              title="No Result"
              description="No users found"
              link="/"
              linkTitle="Trở lại"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RenderSearch;
