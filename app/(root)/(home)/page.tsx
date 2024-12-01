"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/PostsCard";
import OpenCreatePost from "@/components/forms/post/OpenCreatePost";
import FilterPost from "@/components/forms/FilterPost";
import Hashtag from "@/components/forms/home/Hashtag";
import { fetchPosts } from "@/lib/services/post.service";
import fetchDetailedPosts from "@/hooks/usePosts";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        if (isMounted) {
          setPosts(data);
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
    const fetchPostsData = async () => {
      const detailedPosts = await fetchDetailedPosts(posts); // Sử dụng hàm chuyển đổi
      console.log(detailedPosts);
      if (isMounted) {
        setPostsData(detailedPosts);
      }
    };

    if (posts.length > 0) {
      fetchPostsData();
    }
    return () => {
      isMounted = false;
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
      isMounted = false;
    };
  }, [selectedFilter, postsData]);

  return (
    <div className="background-light800_dark400 mt-7 flex w-full pt-20">
      <div className="background-light800_dark400 hidden w-2/5 pl-[2%] lg:block">
        {profile && (
          <>
            <h1 className="text-dark100_light500 text-2xl">
              Hello {profile.lastName},
            </h1>
            <h2 className="text-primary-100">How are you today?</h2>
            <div className="mt-3 flex items-center">
              <Image
                src={profile?.avatar || "/assets/images/capy.jpg"}
                alt="Avatar"
                width={45}
                height={45}
                className="size-16 rounded-full object-cover"
              />
              <p className="text-dark100_light500 ml-3 text-xl">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="background-light800_dark400 w-[700px] justify-center px-3">
        <OpenCreatePost me={profile} />
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
                tags={post.tags || []}
                privacy={post.privacy}
                profileUser={profile}
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
