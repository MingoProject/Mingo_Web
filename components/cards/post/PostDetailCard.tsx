import React, { useState } from "react";
import {
  createComment,
  getCommentByCommentId,
} from "@/lib/services/comment.service";
import CommentCard from "@/components/cards/comment/CommentCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createNotification } from "@/lib/services/notification.service";
import { getMediaByMediaId } from "@/lib/services/media.service";
import { PostResponseDTO } from "@/dtos/PostDTO";
import PostAction from "../../shared/post/PostAction";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import PostHeader from "@/components/shared/post/PostHeader";
import PostMedia from "@/components/shared/post/PostMedia";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ImageDetailCard from "../media/ImageDetailCard";
import VideoDetailCard from "../media/VideoDetailCard";

interface PostDetailCardProps {
  post: PostResponseDTO;
  onClose: () => void;
  profileBasic: UserBasicInfo;
  numberOfLikes: number;
  setNumberOfLikes: React.Dispatch<React.SetStateAction<number>>;
  isLiked: boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  commentsData: CommentResponseDTO[];
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setPostsData?: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}

const PostDetailCard = ({
  post,
  onClose,
  profileBasic,
  numberOfLikes,
  setNumberOfLikes,
  isLiked,
  setIsLiked,
  setNumberOfComments,
  numberOfComments,
  commentsData,
  setCommentsData,
  setPostsData,
}: PostDetailCardProps) => {
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
        post?._id
      );

      const currentTime = new Date();
      const enrichedComment: CommentResponseDTO = {
        ...newCommentData,
        author: {
          _id: profileBasic?._id,
          avatar: profileBasic?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profileBasic?.firstName || "Anonymous",
          lastName: profileBasic?.lastName || "Anonymous",
        },
        createAt: currentTime,
        likes: [],
      };
      post.comments = [newCommentData._id, ...post.comments];

      setCommentsData((prev: any) => [enrichedComment, ...prev]);

      if (post?.author._id !== profileBasic._id) {
        const notificationParams = {
          senderId: profileBasic._id,
          receiverId: post?.author._id,
          type: "comment",
          postId: post?._id,
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
        <div className="background-light200_dark200 max-h-[90vh] w-[645px] overflow-auto rounded-[10px] border shadow-lg dark:border-transparent dark:shadow-none custom-scrollbar">
          <div className="px-[24px] py-[21px] flex flex-col gap-[15px]">
            <div className="flex justify-end">
              <Icon
                icon="ic:round-close"
                className="size-[30px] text-primary-100"
                onClick={onClose}
              />
            </div>
            <PostHeader post={post} setPostsData={setPostsData} />
            <div className="">
              <p className="text-dark100_light100">{post?.content}</p>
            </div>
            {post?.location && (
              <div className=" flex text-primary-100 items-center">
                <Icon icon="mi:location" className="size-[16px]" />
                <span>
                  <span className="text-[12px] font-medium">{" - "}</span>

                  {post?.location}
                </span>
              </div>
            )}
            {post?.media && post?.media.length > 0 && (
              <PostMedia media={post.media} onMediaClick={handleClick} />
            )}
            <div className="flex flex-col gap-[15px] w-full">
              <PostAction
                post={post}
                userId={profileBasic?._id}
                numberOfLikes={numberOfLikes}
                setNumberOfLikes={setNumberOfLikes}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
                numberOfComments={numberOfComments}
              />

              <div className="flex flex-col gap-[10px]">
                {commentsData.length > 0 ? (
                  commentsData.map(
                    (comment: any) =>
                      comment.originalCommentId === null && (
                        <div
                          key={comment._id}
                          className="group mb-3 flex items-start"
                        >
                          <CommentCard
                            comment={comment}
                            setCommentsData={setCommentsData}
                            profileBasic={profileBasic}
                            author={post?.author}
                            postId={post?._id}
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
              <div className="flex w-full gap-[10px]">
                <Input
                  avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
                  placeholder="Write a comment"
                  readOnly={false}
                  cursor="text"
                  value={newComment}
                  onChange={handleInputChange}
                />
                <Button
                  title="Comment"
                  size="small"
                  onClick={handleAddComment}
                  color="bg-primary-100"
                  fontColor="text-dark100_light200"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedImage && (
        <ImageDetailCard
          image={selectedImage}
          onClose={() => {
            setSelectedImage(null);
            setIsDetailVisible(true);
          }}
          profileUser={post?.author}
          profileBasic={profileBasic}
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
        />
      )}
      {selectedVideo && (
        <VideoDetailCard
          video={selectedVideo}
          onClose={() => {
            setSelectedVideo(null);
            setIsDetailVisible(true); // Hiển thị lại PostDetailCard
          }}
          profileUser={post?.author}
          profileBasic={profileBasic}
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
        />
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 100, 100, 0.8);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(80, 80, 80, 1);
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(230, 230, 230, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default PostDetailCard;
