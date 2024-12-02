import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getTimestamp } from "@/lib/utils";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import fetchDetailedComments from "@/hooks/useComments";
import { createComment } from "@/lib/services/comment.service";
import Action from "./Action";
import CommentCard from "@/components/cards/CommentCard";

interface DetailPostProps {
  postId: string;
  author: any;
  content: string;
  media: any[] | undefined;
  createdAt: Date;
  likes: any[];
  comments: any[];
  shares: any[];
  location?: string;
  privacy: {
    type: string;
    allowedUsers?: any[];
  };
  onClose: () => void;
}

const DetailPost = ({
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
  onClose,
}: DetailPostProps) => {
  const [commentsData, setCommentsData] = useState<CommentResponseDTO[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  useEffect(() => {
    const fetchCommentsData = async () => {
      const detailedPosts = await fetchDetailedComments(comments);

      setCommentsData(detailedPosts);
    };

    if (comments.length > 0) {
      fetchCommentsData();
    }
  }, [comments]);

  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!newComment.trim()) {
      console.warn("Comment cannot be empty");
      return;
    }

    try {
      const newCommentData = await createComment(
        { content: newComment },
        token,
        postId
      );

      setCommentsData((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="background-light700_dark300 max-h-[90vh] w-[700px] overflow-auto rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
        <div className="p-4">
          <div className="ml-4 mt-3 flex items-center">
            <Image
              src={author?.avatar ? author.avatar : "/assets/images/capy.jpg"}
              alt="Avatar"
              width={45}
              height={45}
              className="size-11 rounded-full object-cover"
            />
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

          <div className="mx-10 my-5">
            <Action
              likes={likes}
              postId={postId}
              comments={comments}
              shares={shares}
            />
            <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />

            <div className="my-4">
              {commentsData.length > 0 ? (
                commentsData.map((comment) => (
                  <div
                    key={comment._id}
                    className="group mb-3 flex items-start"
                  >
                    <CommentCard
                      comment={comment}
                      setCommentsData={setCommentsData}
                      postId={postId}
                    />
                  </div>
                ))
              ) : (
                <p className="text-dark100_light500">No comments yet.</p>
              )}
            </div>

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
                placeholder="Write a comment..."
                className="background-light800_dark400 text-dark100_light500 ml-3 h-[40px] w-full rounded-full pl-3 text-base"
                value={newComment}
                onChange={handleInputChange}
              />
              <button
                onClick={handleAddComment}
                className="rounded-full bg-primary-100 p-2 px-5 text-white"
              >
                Đăng
              </button>
            </div>
          </div>

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
