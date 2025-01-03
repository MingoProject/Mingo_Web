import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { getTimestamp } from "@/lib/utils";
import {
  createComment,
  getCommentByCommentId,
} from "@/lib/services/comment.service";
import Action from "./Action";
import CommentCard from "@/components/cards/CommentCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createNotification } from "@/lib/services/notification.service";
import { CldImage } from "next-cloudinary";
import DetailsImage from "../personalPage/DetailsImage";
import DetailsVideo from "../personalPage/DetailsVideo";
import { getMediaByMediaId } from "@/lib/services/media.service";
import Link from "next/link";

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
  const [commentsMediaData, setCommentsMediaData] = useState<any[]>([]);

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

          avatar: profile?.avatar || "/assets/images/capy.jpg",
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

  const handleClick = async (item: any) => {
    console.log(item.type);
    try {
      if (item.type === "image") {
        const data = await getMediaByMediaId(item._id);
        const detailsComments = await Promise.all(
          data.comments.map(async (comment: any) => {
            return await getCommentByCommentId(comment);
          })
        );
        setSelectedImage(data);
        console.log("image", data);
        setCommentsMediaData(detailsComments);
        console.log("comment", detailsComments);
      } else {
        const data = await getMediaByMediaId(item._id);
        const detailsComments = await Promise.all(
          data.comments.map(async (comment: any) => {
            return await getCommentByCommentId(comment);
          })
        );
        setSelectedVideo(data);
        setCommentsMediaData(detailsComments);
      }

      setIsDetailVisible(false);
    } catch (error) {
      console.error("Error loading image details:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      {isDetailVisible && (
        <div className="background-light700_dark300 max-h-[90vh] w-[700px] overflow-auto rounded-md border shadow-lg dark:border-transparent dark:shadow-none custom-scrollbar">
          <div className="p-4">
            <div className="flex">
              <div className="ml-4 mt-3 flex items-center">
                <Link href={`/profile/${author?._id || null}`}>
                  <Image
                    src={
                      author?.avatar ? author.avatar : "/assets/images/capy.jpg"
                    }
                    alt="Avatar"
                    width={45}
                    height={45}
                    className="size-11 rounded-full object-cover"
                  />
                </Link>
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
              <div className=" mx-5 mt-3 flex h-auto justify-around">
                <Swiper
                  cssMode={true}
                  navigation={true}
                  mousewheel={true}
                  keyboard={true}
                  modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                  className="h-auto w-[400px] flex justify-center items-center"
                >
                  {media.map((item, index) => (
                    <SwiperSlide key={item.url + index}>
                      {item.type === "image" ? (
                        <>
                          <CldImage
                            src={item.url} // Use this sample image or upload your own via the Media Explorer
                            width="500" // Transform the image: auto-crop to square aspect_ratio
                            height="500"
                            alt=""
                            className="h-[250px] w-[250px] mx-auto"
                            crop={{
                              type: "auto",
                              source: true,
                            }}
                            onClick={() => handleClick(item)}
                          />
                        </>
                      ) : (
                        <>
                          <video
                            width={250}
                            height={250}
                            className="h-[250px] mx-auto"
                            controls
                            onClick={() => handleClick(item)}
                          >
                            <source src={item.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </>
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
                <div className="w-[10%] overflow-hidden rounded-full">
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
                  className="background-light800_dark400 text-dark100_light500 ml-3 h-[40px] w-full rounded-full px-4 text-base"
                  value={newComment}
                  onChange={handleInputChange}
                />
                <button
                  onClick={handleAddComment}
                  className="rounded-md bg-primary-100 px-3 py-1 text-sm ml-2 text-white"
                >
                  Add
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
            setIsDetailVisible(true);
          }}
          profileUser={author}
          me={profile}
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
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
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
        />
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px; /* Độ rộng của thanh cuộn */
          height: 6px; /* Độ cao của thanh cuộn ngang */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 100, 100, 0.8); /* Màu của thanh cuộn */
          border-radius: 10px; /* Bo góc */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(80, 80, 80, 1); /* Màu khi hover */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(230, 230, 230, 0.5); /* Màu nền track */
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default DetailPost;
