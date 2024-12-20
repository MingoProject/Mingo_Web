import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/PostsCard";
import UserCard from "./UserCard";
import { fetchUsers } from "@/lib/services/user.service";
import { fetchPosts, getPostByPostId } from "@/lib/services/post.service";
import fetchDetailedPosts from "@/hooks/usePosts";

const RenderSearch = ({ activeTab, query, profile }: any) => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;

      try {
        const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);

        const detailedPosts = await Promise.all(
          posts.map(async (post) => await getPostByPostId(post._id))
        );
        // const detailedPosts = await fetchDetailedPosts(posts);
        // console.log(detailedPosts);

        const userResults = users.filter(
          (user) =>
            user.lastName.toLowerCase().includes(query.toLowerCase()) ||
            user.firstName.toLowerCase().includes(query.toLowerCase())
        );

        const postResults = detailedPosts.filter(
          (post) =>
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            userResults.some((user) => user._id === post.author._id)
        );

        const combinedResults =
          activeTab === "friends"
            ? userResults.map((user) => ({
                type: "user",
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
              }))
            : postResults.map((post) => ({
                type: "post",
                postId: post._id,
                author: post.author,
                content: post.content,
                media: post.media,
                createdAt: post.createdAt,
                likes: post.likes,
                comments: post.comments,
                shares: post.shares,
                location: post.location,
                privacy: post.privacy,
                tags: post.tags,
              }));

        setResults(combinedResults);
      } catch (error) {
        console.error("Error fetching data:", error);
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
            .filter((result) => result.type === "post")
            .map((post) => (
              <PostsCard
                key={post.postId}
                postId={post.postId}
                author={post.author}
                content={post.content}
                media={post.media}
                createdAt={post.createdAt}
                likes={post.likes || []}
                comments={post.comments || []}
                shares={post.shares || []}
                location={post.location}
                privacy={post.privacy}
                tags={post.tags}
                profile={profile}
              />
            ))
        )
      ) : (
        <div>
          {results
            .filter((result) => result.type === "user")
            .map((user) => (
              <UserCard
                key={user.userId}
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
