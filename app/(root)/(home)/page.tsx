"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/PostsCard";
import OpenCreatePost from "@/components/forms/OpenCreatePost";
import FilterPost from "@/components/forms/FilterPost";
import Hashtag from "@/components/forms/home/Hashtag";
import { fetchPosts } from "@/lib/services/post.service";
import fetchDetailedPosts from "@/hooks/usePosts";
import { PostResponseDTO } from "@/dtos/PostDTO";

// export interface UserResponseDTO {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   nickName: string;
//   phoneNumber: string;
//   email: string;
//   role: string[];
//   avatar: string;
//   background: string;
//   gender: boolean;
//   address: string;
//   job: string;
//   hobbies: string[];
//   bio: string;
//   point: number;
//   relationShip: string;
//   birthDay: Date;
//   attendDate: Date;
//   flag: boolean;
//   friendIds: String[];
//   bestFriendIds: String[];
//   blockedIds: String[];
//   createAt: Date;
//   createBy: String;
// }

// export interface CommentResponseDTO {
//   _id: string;
//   userId: String;
//   content: string;
//   createdTime: Date;
//   parentId?: String;
//   replies?: CommentResponseDTO[];
//   createBy: String;
//   createAt: Date;
// }

// export interface PostResponseDTO {
//   _id: string;
//   content: string;
//   media?: String[];
//   url?: string;
//   createdAt: Date;
//   author: UserResponseDTO;
//   shares: String[];
//   likes: String[];
//   comments: CommentResponseDTO[];
//   location?: string;
//   privacy: {
//     type: string;
//     allowedUsers?: String[];
//   };
//   likedIds: String[];
//   flag: boolean;
// }

export default function Home() {
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    const fetchPostsData = async () => {
      const detailedPosts = await fetchDetailedPosts(posts); // Sử dụng hàm chuyển đổi
      setPostsData(detailedPosts);
    };

    if (posts.length > 0) {
      fetchPostsData();
    }
  }, [posts]);

  const [selectedFilter, setSelectedFilter] =
    React.useState<string>("Mới nhất");
  const [filteredPosts, setFilteredPosts] = useState<PostResponseDTO[]>([]); // Khởi tạo là mảng rỗng
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user") || "{}";
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const sortedPosts = [...postsData]; // Sắp xếp bài viết nếu có
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

  return (
    <div className="background-light800_dark400 mt-7 flex w-full pt-20">
      <div className="background-light800_dark400 hidden w-2/5 pl-[2%] lg:block">
        <h1 className="text-dark100_light500 text-2xl">Hello Huỳnh,</h1>
        <h2 className="text-primary-100">How are you today?</h2>
        <div className="mt-3 flex items-center">
          <Image
            src="/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"
            alt="Avatar"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="text-dark100_light500 ml-3 text-xl">Huỳnh</p>
        </div>
      </div>

      <div className="background-light800_dark400 w-[700px] justify-center px-3">
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
        <div className="background-light800_dark400 flex w-full flex-col gap-6">
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
              />
            ))
          )}
        </div>
      </div>

      <div className="background-light800_dark400 hidden w-2/5 items-center justify-center bg-light-600 px-1 md:block">
        <Hashtag />
      </div>
    </div>
  );
}
