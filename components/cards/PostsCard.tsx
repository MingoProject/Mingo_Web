"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DetailPost from "../forms/post/DetailPost";
import { IUser } from "@/database/user.model";
import { IMedia } from "@/database/media.model";
import { IComment } from "@/database/comment.model";
import { CldImage } from "next-cloudinary";
import { dislikePost, likePost } from "@/lib/services/post.service";

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
  privacy,
}: {
  postId: string;
  author: IUser;
  content: string;
  media: IMedia[];
  createdAt: Date;
  likes: IUser[];
  comments: IComment[];
  shares: IUser[];
  location?: string;
  privacy: {
    type: string;
    allowedUsers?: IUser[];
  };
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(likes.length);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        console.log("userId", userId);
        console.log("likes", likes);
        const isUserLiked = likes.some((like) => like._id === userId);
        setIsLiked(isUserLiked);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
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
    <div className="background-light700_dark300 h-auto rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
      <div className="ml-4 mt-3 flex items-center">
        <Image
          src={author?.avatar ? author.avatar : "/assets/images/capy.jpg"}
          alt="Avatar"
          width={45}
          height={45}
          className="size-11 rounded-full"
        />
        {/* <Image
          src={"/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"}
          alt="Avatar"
          width={45}
          height={45}
          className="size-12 rounded-full object-cover"
        /> */}
        <div>
          <p className="text-dark100_light500 ml-3 text-base">
            {author?.firstName ? author.firstName : ""}
          </p>
          <span className="text-dark100_light500 ml-3 text-sm">
            {getTimestamp(createdAt)}
          </span>
        </div>
      </div>
      <div className="ml-4 mt-5">
        <p className="text-dark100_light500">{content}</p>
      </div>
      {media && media.length > 0 && (
        <div className="mx-5 mt-3 flex h-[400px] justify-around">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="h-[400px] w-[300px]"
          >
            {media.map((item) => (
              <SwiperSlide key={item.url}>
                {item.type === "image" ? (
                  <CldImage
                    src="media_folder/ravh8obj3hxq7ebhb47h" // Use this sample image or upload your own via the Media Explorer
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
            <span className="text-dark100_light500">{numberOfLikes} Likes</span>
          </div>
          <div className="flex items-center space-x-2" onClick={openModal}>
            <Icon
              icon="mingcute:message-4-line"
              className="text-dark100_light500"
            />
            <span className="text-dark100_light500">
              {comments.length} Comments
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:share-outline" className="text-dark100_light500" />
            <span className="text-dark100_light500">
              {shares.length} Shares
            </span>
          </div>
        </div>
        <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />
        <div className="text-dark100_light500 my-3">
          <span className="text-dark100_light500">Viết bình luận</span>
          <div className="mx-[1%] pl-4 pt-2">
            <div className="flex" onClick={openModal}>
              <div className="size-[40px] overflow-hidden rounded-full">
                <Image
                  src="/assets/images/default-avatar.jpg"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
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
          />
        )}
      </div>
    </div>
  );
};

export default PostsCard;
