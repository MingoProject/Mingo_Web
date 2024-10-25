import React, { useState } from "react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DetailPost from "../forms/post/DetailPost";

interface IMedia {
  _id: string;
  url: string;
  type: "image" | "video";
  caption?: string;
  createdAt: Date;
  author: string;
  postId: string;
  likes: string[];
  comments: string[];
  shares: string[];
}

interface IUser {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
}

interface IComment {
  commentId: string;
  postId: string;
  author: IUser; // Thay đổi author thành IUser
  content: string;
  createdAt: Date;
  likes: IUser[]; // Likes của comment
}

const PostsCard = ({
  postId,
  author, // IUser object
  content,
  media,
  createdAt,
  likes, // IUser array
  comments, // IComment array
  shares, // IUser array
  location,
  privacy,
}: {
  postId: string;
  author: IUser; // Thay đổi author thành object IUser
  content: string;
  media: IMedia[];
  createdAt: Date;
  likes: IUser[]; // Likes là một mảng chứa đối tượng IUser
  comments: IComment[]; // Comments là một mảng IComment
  shares: IUser[]; // Shares là một mảng chứa đối tượng IUser
  location?: string;
  privacy: {
    type: string;
    allowedUsers?: IUser[];
  };
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="background-light700_dark300 h-auto rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
      <div className="ml-4 mt-3 flex items-center">
        <Image
          src={author.avatar || "/assets/images/default-avatar.jpg"} // Default avatar
          alt="Avatar"
          width={45}
          height={45}
          className="size-12 rounded-full object-cover"
        />
        <div>
          <p className="text-dark100_light500 ml-3 text-base">
            {author.fullname}
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
            {media.map((item, index) => (
              <SwiperSlide key={item._id}>
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={`Image ${index + 1}`}
                    width={250}
                    height={250}
                    className="h-[400px] w-auto object-cover"
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
            <Icon icon="ic:baseline-favorite-border" />
            <span>{likes.length} Likes</span>
          </div>
          <div className="flex items-center space-x-2" onClick={openModal}>
            <Icon icon="mingcute:message-4-line" />
            <span>{comments.length} Comments</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:share-outline" />
            <span>{shares.length} Shares</span>
          </div>
        </div>
        <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />
        <div className="text-dark100_light500 my-3">
          <span>Viết bình luận</span>
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
                placeholder="    Share something..."
                className="background-light600_dark200 ml-3 h-[40px] w-full rounded-full text-base"
                readOnly
              />
            </div>
          </div>
        </div>
        {/* Render Comments */}
        {/* <div className="mt-4">
          {comments.map((comment) => (
            <div
              key={comment.commentId}
              className="mb-2 flex items-start space-x-2"
            >
              <Image
                src={
                  comment.author.avatar || "/assets/images/default-avatar.jpg"
                }
                alt="Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-dark100_light500 font-semibold">
                  {comment.author.fullname}
                </p>
                <p className="text-dark100_light500">{comment.content}</p>
              </div>
            </div>
          ))}
        </div> */}
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
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default PostsCard;
