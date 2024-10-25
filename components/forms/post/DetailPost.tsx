import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getTimestamp } from "@/lib/utils";

interface IMedia {
  _id: string;
  url: string;
  type: "image" | "video";
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
  author: string;
  content: string;
  createdAt: Date;
  likes: string[];
}

interface DetailPostProps {
  postId: string;
  author: IUser;
  avatar?: string;
  content: string;
  media: IMedia[];
  likes: IUser[];
  comments: IComment[];
  shares: IUser[];
  createdAt: Date;
  onClose: () => void;
}

const DetailPost = ({
  postId,
  author,
  avatar,
  content,
  media,
  likes,
  comments,
  shares,
  createdAt,
  onClose,
}: DetailPostProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="background-light700_dark300 max-h-[90vh] w-[700px] overflow-auto rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
        <div className="p-4">
          {/* Header */}
          <div className="ml-4 mt-3 flex items-center">
            <Image
              src={avatar || "/assets/images/default-avatar.jpg"} // Default avatar
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full object-cover"
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

          {/* Content */}
          <div className="ml-4 mt-5">
            <p className="text-dark100_light500">{content}</p>
          </div>

          {/* Media (Images/Video) */}
          {media && media.length > 0 && (
            <div className="mt-3 flex h-[400px] w-full justify-around">
              <Swiper spaceBetween={10} slidesPerView={1}>
                {media.map((item, index) => (
                  <SwiperSlide key={index}>
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

          {/* Likes, Comments, Shares */}
          <div className="mx-10 my-5">
            <div className="text-dark100_light500 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon icon="ic:baseline-favorite-border" />
                <span>{likes.length} Likes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon icon="mingcute:message-4-line" />
                <span>{comments.length} Comments</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:share-outline" />
                <span>{shares.length} Shares</span>
              </div>
            </div>
            <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />

            {/* Render Comments */}
            <div className="my-4">
              {comments.length > 0 ? (
                comments.map((cmt) => (
                  <div key={cmt.commentId} className="mb-3 flex items-start">
                    <Image
                      src={avatar || "/assets/images/default-avatar.jpg"} // Avatar for comments
                      alt={cmt.author}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="font-bold">{cmt.author}</p>
                      <p>{cmt.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            {/* Comment Input */}
            <div className="flex">
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
                className="background-light600_dark200 ml-3 h-[40px] w-full rounded-full text-base"
              />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-5 w-full text-center text-primary-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
