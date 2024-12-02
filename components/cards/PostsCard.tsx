"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DetailPost from "../forms/post/DetailPost";
import { CldImage } from "next-cloudinary";
import { dislikePost, likePost } from "@/lib/services/post.service";
import Link from "next/link";
import PostMenu from "../forms/post/PostMenu";

const PostsCard = ({
  postId,
  author,
  content,
  media,
  createdAt,
  likes,
  comments,
  shares,
  location,
  tags,
  privacy,
  profile,
}: {
  postId: string;
  author: any;
  content: string;
  media: any[] | undefined;
  createdAt: Date;
  likes: any[];
  comments: any[];
  shares: any[];
  location?: string;
  tags: any[];
  privacy: {
    type: string;
    allowedUsers?: any[];
  };
  profile: any;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(likes.length);
  const [menuModal, setMenuModal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        console.log("userId", userId);
        console.log("likes", likes);
        const isUserLiked = likes.some((like) => like._id === userId);
        if (isMounted) {
          setIsLiked(isUserLiked);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [likes]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLikePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await likePost(postId, token);
        setIsLiked(!isLiked);
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const handleDislikePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await dislikePost(postId, token);

        setIsLiked(!isLiked);
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const toggleLike = () => {
    if (isLiked) {
      handleDislikePost();
      setNumberOfLikes(likes.length - 1);
    } else {
      handleLikePost();
      setNumberOfLikes(likes.length + 1);
    }
  };

  return (
    <div className="background-light700_dark300 h-auto w-full rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
      <div className="ml-4 mt-3 flex items-center">
        <div className="flex items-center">
          <Link href={`/profile/${author._id}`}>
            <Image
              src={author?.avatar ? author.avatar : "/assets/images/capy.jpg"}
              alt="Avatar"
              width={45}
              height={45}
              className="size-11 rounded-full object-cover"
            />
          </Link>
          <div>
            <p className="text-dark100_light500 ml-3 text-base">
              {author?.firstName ? author.firstName : ""}
              {tags.length > 0 && (
                <span>
                  <span className="">{" with "}</span>

                  {tags.map((tag, index) => (
                    <span key={tag._id}>
                      {tag.firstName}
                      {index < tags.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              )}
              {location && (
                <div className="flex">
                  <Icon icon="mi:location" className="" />
                  <span>
                    <span className="">{" - "}</span>

                    {location}
                  </span>
                </div>
              )}
            </p>
            <span className="text-dark100_light500 ml-3 text-sm">
              {getTimestamp(createdAt)}
            </span>
          </div>
        </div>
        <div className="ml-auto pb-2 pr-4">
          <Icon
            icon="tabler:dots"
            onClick={() => setMenuModal(true)}
            className="text-dark100_light500"
          />
        </div>
        <div ref={menuRef}>
          {menuModal && (
            <PostMenu
              postId={postId}
              author={author}
              content={content}
              media={media}
              createdAt={createdAt}
              likes={likes || []}
              comments={comments || []}
              shares={shares || []}
              location={location}
              privacy={privacy}
              onClose={() => setMenuModal(false)}
            />
          )}
        </div>
      </div>
      <div className="ml-4 mt-5">
        <p className="text-dark100_light500">{content}</p>
      </div>
      {media && media.length > 0 && (
        <div className="mx-5 mt-3 flex h-auto justify-around">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="h-auto w-[300px]"
          >
            {media.map((item) => (
              <SwiperSlide key={item.url}>
                {item.type === "image" ? (
                  <CldImage
                    src={item.url} // Use this sample image or upload your own via the Media Explorer
                    width="500" // Transform the image: auto-crop to square aspect_ratio
                    height="500"
                    alt=""
                    crop={{
                      type: "auto",
                      source: true,
                    }}
                  />
                ) : (
                  <video width={250} height={250} controls>
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="mx-10 my-5">
        <div className="text-dark100_light500 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon
              onClick={toggleLike}
              icon={
                isLiked ? "ic:baseline-favorite" : "ic:baseline-favorite-border"
              }
              className={isLiked ? "text-primary-100" : "text-dark100_light500"}
            />
            <div className="flex">
              <span className="text-dark100_light500">{numberOfLikes}</span>
              <p className="text-dark100_light500 ml-1 hidden md:block">
                Likes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2" onClick={openModal}>
            <Icon
              icon="mingcute:message-4-line"
              className="text-dark100_light500"
            />
            <div className="flex">
              <span className="text-dark100_light500">{comments.length}</span>
              <p className="text-dark100_light500 ml-1 hidden md:block">
                Comments
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:share-outline" className="text-dark100_light500" />
            <div className="flex">
              <span className="text-dark100_light500">{shares.length}</span>
              <p className="text-dark100_light500 ml-1 hidden md:block">
                Shares
              </p>
            </div>
          </div>
        </div>
        <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />
        <div className="text-dark100_light500 my-3">
          <span className="text-dark100_light500">Comment</span>
          <div className="mx-[1%] pl-4 pt-2">
            <div className="flex" onClick={openModal}>
              <div className="w-12 overflow-hidden rounded-full">
                <Image
                  src={
                    profile?.avatar ? profile.avatar : "/assets/images/capy.jpg"
                  }
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
              </div>
              <input
                type="text"
                placeholder="    Write a comment..."
                className="background-light800_dark400 text-dark100_light500 ml-3 h-[40px] w-full rounded-full text-base"
                readOnly
              />
            </div>
          </div>
        </div>
        {isModalOpen && (
          <DetailPost
            postId={postId}
            author={author}
            content={content}
            media={media}
            createdAt={createdAt}
            likes={likes}
            comments={comments}
            shares={shares}
            privacy={privacy}
            onClose={closeModal}
            profile={profile}
          />
        )}
      </div>
    </div>
  );
};

export default PostsCard;
