import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getTimestamp } from "@/lib/utils";
import fetchDetailedComments from "@/hooks/useComments";
import { createComment } from "@/lib/services/comment.service";
import Action from "./Action";
import CommentCard from "@/components/cards/CommentCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createNotification } from "@/lib/services/notification.service";
import { getCommentsByPostId } from "@/lib/services/post.service";

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
  tags: any[];
  onClose: () => void;
  profile: any;
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
  tags,
  onClose,
  profile,
}: DetailPostProps) => {
  const [getComments, setGetComments] = useState<any[]>([]);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  useEffect(() => {
    let isMounted = true;
    const getComments = async () => {
      const detailedComments = await getCommentsByPostId(postId);
      if (isMounted) {
        setGetComments(detailedComments);
      }
    };

    getComments();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  useEffect(() => {
    let isMounted = true;
    const fetchCommentsData = async () => {
      const detailedComments = await fetchDetailedComments(getComments);
      if (isMounted) {
        setCommentsData(detailedComments);
      }
    };

    if (getComments.length > 0) {
      fetchCommentsData();
    }
    return () => {
      isMounted = false;
    };
  }, [getComments]);

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

      const enrichedComment = {
        ...newCommentData,
        userId: {
          _id: profile?._id,
          avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profile?.firstName || "Anonymous",
          lastName: profile?.lastName || "Anonymous",
          createAt: "Now",
        },
      };

      // Cập nhật state commentsData
      setCommentsData((prev) => [enrichedComment, ...prev]);

      if (author._id !== profile._id) {
        const notificationParams = {
          senderId: profile._id,
          receiverId: author._id,
          type: "comment",
          postId,
        };

        await createNotification(notificationParams, token);
      }
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="background-light700_dark300 max-h-[90vh] w-[700px] overflow-auto rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
        <div className="p-4">
          <div className="flex">
            <div className="ml-4 mt-3 flex items-center">
              <Image
                src={
                  author?.avatar
                    ? author.avatar
                    : "/assets/images/default-avatar.jpg"
                }
                alt="Avatar"
                width={45}
                height={45}
                className="size-11 rounded-full object-cover"
              />
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

            <button
              onClick={onClose}
              className="ml-auto mt-5 pl-2 text-3xl text-primary-100"
            >
              x
            </button>
          </div>

          <div className="ml-4 mt-5">
            <p className="text-dark100_light500">{content}</p>
          </div>

          {media && media.length > 0 && (
            <div className="mx-auto ml-5 flex h-[400px] w-full justify-center">
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
              comments={commentsData}
              shares={shares}
              author={author}
              profile={profile}
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
                      profile={profile}
                      author={author}
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
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
