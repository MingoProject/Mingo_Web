import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getTimestamp } from "@/lib/utils";
import { createComment } from "@/lib/services/comment.service";
import Action from "./Action";
import CommentCard from "@/components/cards/CommentCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createNotification } from "@/lib/services/notification.service";
import { CldImage } from "next-cloudinary";
import DetailsImage from "../personalPage/DetailsImage";
import DetailsVideo from "../personalPage/DetailsVideo";

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
  likesCount: any;
  setLikesCount: any;
  isLiked: any;
  setIsLiked: any;
  setNumberOfComments: any;
  numberOfComments: any;
  commentsData: any;
  setCommentsData: any;
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
  likesCount,
  setLikesCount,
  isLiked,
  setIsLiked,
  setNumberOfComments,
  numberOfComments,
  commentsData,
  setCommentsData,
}: DetailPostProps) => {
  const [newComment, setNewComment] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

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
      const currentTime = new Date();
      const isoStringWithOffset = currentTime
        .toISOString()
        .replace("Z", "+00:00");
      console.log(
        "Current Time (new Date()):",
        currentTime.toISOString().replace("Z", "+00:00")
      );

      const enrichedComment = {
        ...newCommentData,
        userId: {
          _id: profile?._id,
          avatar: profile?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profile?.firstName || "Anonymous",
          lastName: profile?.lastName || "Anonymous",
        },
        createAt: isoStringWithOffset,
      };

      // Cập nhật state commentsData
      setCommentsData((prev: any) => [enrichedComment, ...prev]);

      if (author._id !== profile._id) {
        const notificationParams = {
          senderId: profile._id,
          receiverId: author._id,
          type: "comment",
          postId,
        };

        await createNotification(notificationParams, token);
      }
      setNumberOfComments(numberOfComments + 1);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {isDetailVisible && (
        <div className="background-light700_dark300 max-h-[90vh] w-[700px] overflow-auto rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
          <div className="p-4">
            <div className="flex">
              <div className="ml-4 mt-3 flex items-center">
                <Image
                  src={
                    author?.avatar ? author.avatar : "/assets/images/capy.jpg"
                  }
                  alt="Avatar"
                  width={45}
                  height={45}
                  className="size-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-dark100_light500 ml-3 text-base">
                    {author?.firstName ? author.firstName : ""}
                    {tags?.length > 0 && (
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
                <Icon
                  icon="ic:round-close"
                  width="28"
                  height="28"
                  className="text-primary-100"
                />
              </button>
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
                          src={item.url}
                          width="500"
                          height="500"
                          alt=""
                          crop={{
                            type: "auto",
                            source: true,
                          }}
                          onClick={() => {
                            setSelectedImage(item);
                            setIsDetailVisible(false);
                          }}
                        />
                      ) : (
                        <video
                          width={250}
                          height={250}
                          controls
                          onClick={() => {
                            setSelectedVideo(item);
                            setIsDetailVisible(false);
                          }}
                        >
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
                author={author}
                profile={profile}
                likesCount={likesCount}
                setLikesCount={setLikesCount}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
                numberOfComments={numberOfComments}
              />
              <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />

              <div className="my-4">
                {commentsData.length > 0 ? (
                  commentsData.map(
                    (comment: any) =>
                      comment.parentId === null && (
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
                            setNumberOfComments={setNumberOfComments}
                            numberOfComments={numberOfComments}
                          />
                        </div>
                      )
                  )
                ) : (
                  <p className="text-dark100_light500">No comments yet.</p>
                )}
              </div>
              <div className="flex">
                <div className="size-[40px] overflow-hidden rounded-full">
                  <Image
                    src={
                      profile?.avatar
                        ? profile.avatar
                        : "/assets/images/capy.jpg"
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
                  className="ml-1 rounded-full bg-primary-100 p-2 px-5 text-white"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedImage && (
        <DetailsImage
          image={selectedImage}
          onClose={() => {
            setSelectedImage(null);
            setIsDetailVisible(true); // Hiển thị lại DetailPost
          }}
          profileUser={author}
          me={profile}
        />
      )}
      {selectedVideo && (
        <DetailsVideo
          video={selectedVideo}
          onClose={() => {
            setSelectedVideo(null);
            setIsDetailVisible(true); // Hiển thị lại DetailPost
          }}
          profileUser={author}
          me={profile}
        />
      )}
    </div>
  );
};

export default DetailPost;
