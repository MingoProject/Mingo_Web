// app/components/shared/search/RenderSearch.tsx
import React, { useEffect, useState } from "react";
import users from "@/fakeData/UsersData";
import posts from "@/fakeData/PostsData";
import { useRouter } from "next/navigation";
import NoResult from "@/components/shared/NoResult"; // Thêm import cho component NoResult
import PostsCard from "@/components/cards/PostsCard"; // Giả định bạn đã có component PostsCard
import Image from "next/image";

const RenderSearch = ({ activeTab, query }: any) => {
  const [results, setResults] = useState<any[]>([]); // Đổi thành mảng đối tượng để lưu thông tin kết quả
  const router = useRouter();

  useEffect(() => {
    if (query) {
      // Tìm kiếm người dùng và bài viết dựa trên query
      const userResults = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.fullname.toLowerCase().includes(query.toLowerCase())
      );

      const postResults = posts.filter(
        (post) =>
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          userResults.some((user) => user.userId === post.author) // Lấy thông tin tác giả
      );

      // Kết hợp kết quả người dùng và bài viết dựa trên activeTab
      const combinedResults =
        activeTab === "friends"
          ? userResults.map((user) => ({
              type: "user",
              name: user.fullname,
              username: user.username,
              avatar: user.avatar,
              userId: user.userId, // Thêm userId để sử dụng cho navigation
            }))
          : postResults.map((post) => ({
              type: "post",
              postId: post.postId,
              author: {
                _id: post.author || "unknown",
                fullname:
                  users.find((user) => user.userId === post.author)?.fullname ||
                  "Unknown",
                username:
                  users.find((user) => user.userId === post.author)?.username ||
                  "unknown",
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
    }
  }, [query, activeTab]);

  const handleUserClick = (userId: any) => {
    router.push(`/user/${userId}`); // Điều hướng đến trang người dùng
  };

  //   const handlePostClick = (postId) => {
  //     router.push(`/post/${postId}`); // Điều hướng đến trang bài viết
  //   };

  return (
    <div className="background-light700_dark400 flex w-full flex-col gap-6">
      {activeTab === "posts" ? ( // Kiểm tra nếu tab hiện tại là posts
        results.length === 0 ? ( // Kiểm tra chiều dài của results
          <NoResult
            title="No Result"
            description="No articles found"
            link="/"
            linkTitle="Trở lại"
          />
        ) : (
          results
            .filter((result) => result.type === "post") // Lọc chỉ lấy bài viết
            .map((post) => (
              <PostsCard
                key={post._id}
                postId={post.postId}
                author={
                  post.author || {
                    _id: "unknown",
                    fullname: "Unknown",
                    username: "unknown",
                  }
                } // Thay đổi author thành object IUser
                content={post.content}
                media={post.media}
                createdAt={post.createdAt}
                likes={post.likes || []} // Mảng chứa IUser
                comments={post.comments || []} // Mảng chứa IComment
                shares={post.shares || []} // Mảng chứa IUser
                location={post.location}
                privacy={post.privacy}
              />
            ))
        )
      ) : (
        // Hiển thị kết quả tìm kiếm cho người dùng nếu activeTab là friends
        <div>
          {results
            .filter((result) => result.type === "user")
            .map((user) => (
              <div
                key={user.userId}
                onClick={() => handleUserClick(user.userId)}
                style={{ cursor: "pointer" }}
                className="mb-4 flex items-center"
              >
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="mr-2 size-8 rounded-full"
                />
                <span>
                  {user.name} (@{user.username})
                </span>
              </div>
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
