import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import CommentMenu from "../../forms/comment/Modal";
import {
  addReplyToComment,
  createReplyCommentMedia,
  createReplyCommentPost,
  dislikeComment,
  likeComment,
} from "@/lib/services/comment.service";
import ReplyCard from "../ReplyCard";
import { createNotification } from "@/lib/services/notification.service";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";

interface CommentCardProps {
  comment: CommentResponseDTO;
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  profileBasic: UserBasicInfo;
  author: UserBasicInfo;
  postId?: string;
  mediaId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
}
const CommentCard = ({
  comment,
  setCommentsData,
  profileBasic,
  author,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
}: CommentCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(comment?.likes.length);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<string[] | undefined>([]);
  const [newComment, setNewComment] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, left: rect.left });
    }
  }, [menuRef]);

  const toggleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  useEffect(() => {
    let isMounted = true;
    try {
      if (isMounted) {
        setReplies(comment?.replies);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    return () => {
      isMounted = false;
    };
  }, [comment.replies]);

  const handleOpenMenu = (commentId: string, iconRef: HTMLDivElement) => {
    setSelectedCommentId(commentId);
    const rect = iconRef.getBoundingClientRect();
    setPosition({
      top: rect.bottom,
      left: rect.left,
    });
  };

  const handleCloseMenu = () => {
    setSelectedCommentId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLikeComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await likeComment(comment._id, token);
        setIsLiked(!isLiked);
        if (profileBasic._id !== comment.author._id) {
          const params = {
            senderId: profileBasic._id,
            receiverId: comment.author._id,
            type: "like_comment",
            commentId: comment._id,
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };
          await createNotification(params, token);
        }
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const isUserLiked = comment.likes.some(
          (like: any) => like._id === userId
        );
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
  }, [comment.likes]);

  const handleDislikeComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await dislikeComment(comment._id, token);

        setIsLiked(!isLiked);
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
  };

  const toggleLike = async () => {
    if (isLiked) {
      await handleDislikeComment();
      setNumberOfLikes((prev: any) => prev - 1);
    } else {
      await handleLikeComment();
      setNumberOfLikes((prev: any) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleReplyComment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!newComment.trim() || !replyingTo) {
      console.warn("Comment cannot be empty or no comment to reply to");
      return;
    }

    try {
      setNewComment("");
      setReplyingTo(null);
      if (postId) {
        const newCommentData = await createReplyCommentPost(
          {
            content: newComment,
            parentId: comment._id,
            originalCommentId: comment._id,
          },
          token,
          postId
        );
        if (newCommentData) {
          await addReplyToComment(replyingTo, newCommentData._id, token);
        }

        const currentTime = new Date();
        const isoStringWithOffset = currentTime
          .toISOString()
          .replace("Z", "+00:00");

        const enrichedComment = {
          ...newCommentData,
          userId: {
            _id: profileBasic?._id,
            avatar: profileBasic?.avatar || "/assets/images/default-avatar.jpg",
            firstName: profileBasic?.firstName || "Anonymous",
            lastName: profileBasic?.lastName || "Anonymous",
          },
          createAt: isoStringWithOffset,
        };

        setReplies((prev) => [enrichedComment, ...prev]);

        if (comment.author._id !== profileBasic._id) {
          const notificationParams = {
            senderId: profileBasic._id,
            receiverId: comment.author._id,
            type: "reply_comment",
            commentId: comment._id,
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };

          await createNotification(notificationParams, token);
        }
        if (author._id !== profileBasic._id) {
          const notificationParams2 = {
            senderId: profileBasic._id,
            receiverId: author._id,
            type: "comment",
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };

          await createNotification(notificationParams2, token);
        }
      } else {
        const newCommentData = await createReplyCommentMedia(
          {
            content: newComment,
            parentId: comment._id,
            originalCommentId: comment._id,
          },
          token,
          mediaId
        );
        if (newCommentData) {
          await addReplyToComment(replyingTo, newCommentData._id, token);
        }

        const currentTime = new Date();
        const isoStringWithOffset = currentTime
          .toISOString()
          .replace("Z", "+00:00");

        const enrichedComment = {
          ...newCommentData,
          userId: {
            _id: profileBasic?._id,
            avatar: profileBasic?.avatar || "/assets/images/default-avatar.jpg",
            firstName: profileBasic?.firstName || "Anonymous",
            lastName: profileBasic?.lastName || "Anonymous",
          },
          createAt: isoStringWithOffset,
          originalCommentId: comment._id,
        };

        setReplies((prev) => [enrichedComment, ...prev]);

        if (comment.author._id !== profileBasic._id) {
          const notificationParams = {
            senderId: profileBasic._id,
            receiverId: comment.author._id,
            type: "reply_comment",
            commentId: comment._id,
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };

          await createNotification(notificationParams, token);
        }

        if (author._id !== profileBasic._id) {
          const notificationParams2 = {
            senderId: profileBasic._id,
            receiverId: author._id,
            type: "comment",
            ...(postId && { postId }),
            ...(mediaId && { mediaId }),
          };

          await createNotification(notificationParams2, token);
        }
      }
      setNumberOfComments(numberOfComments + 1);
    } catch (error) {
      console.error("Failed to reply to comment:", error);
    }
  };

  function timeSinceMessage(timestamp: Date | string) {
    const now = new Date();
    const messageTimestamp = new Date(timestamp);
    const diffInMs = now.getTime() - messageTimestamp.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} days ago`;
    if (diffInHours > 0) return `${diffInHours} hours ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minutes ago`;
    return `${diffInSeconds} seconds ago`;
  }

  return (
    <div className="w-full">
      <div className="flex gap-[10px]">
        <Image
          src={comment.author?.avatar || "/assets/images/capy.jpg"}
          alt={comment.author?.avatar}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />

        <div className=" w-full">
          <p className="text-dark100_light100 text-[16px] font-medium">
            {comment.author.firstName} {comment.author.lastName}
          </p>
          <div className="flex">
            <p className="text-dark100_light100 text-[16px] font-normal inline-block rounded-r-[20px] rounded-bl-[20px] px-[15px] py-[10px] background-light400_dark400">
              {comment.content}
            </p>
            <Icon
              icon="bi:three-dots"
              className="text-dark100_light500 ml-2 mt-3 hidden size-4 group-hover:inline"
              onClick={(e) =>
                handleOpenMenu(comment._id, e.currentTarget as SVGSVGElement)
              }
            />
            {selectedCommentId === comment._id && (
              <div
                ref={menuRef}
                className="absolute z-50  shadow-lg rounded-md"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                }}
              >
                <CommentMenu
                  commentUserId={comment.author?._id}
                  commentId={comment._id}
                  originalCommentId={comment.originalCommentId}
                  content={comment.content}
                  setCommentsData={setCommentsData}
                  handleCloseMenu={handleCloseMenu}
                  postId={postId}
                  mediaId={mediaId}
                  setNumberOfComments={setNumberOfComments}
                  numberOfComments={numberOfComments}
                  repliesCount={replies?.length}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-[15px]">
            <span className="text-dark100_light100 text-[12px] font-normal">
              {timeSinceMessage(comment.createAt)}
            </span>

            <div className="flex">
              <div
                className={`hover:underline text-[14px] ${
                  isLiked
                    ? "font-bold text-primary-100"
                    : "text-dark100_light100"
                }`}
                onClick={toggleLike}
              >
                Like {numberOfLikes}
              </div>
            </div>

            <span className="text-dark100_light100">·</span>
            <div
              className="text-dark100_light100 hover:underline text-[14px]"
              onClick={() => setReplyingTo(comment._id)}
            >
              Reply
            </div>
          </div>

          {replyingTo === comment._id && (
            <div className="flex w-full">
              <div className="mt-2 flex w-full rounded-xl border border-gray-200">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-md bg-transparent p-2 text-dark100_light500"
                  placeholder="Write a reply..."
                />
                <Icon
                  onClick={handleReplyComment}
                  className="mr-2 mt-4 text-primary-100"
                  icon="iconoir:send"
                  width="24"
                  height="24"
                />
              </div>
              <button
                className="ml-2 text-2xl text-primary-100"
                onClick={() => setReplyingTo(null)}
              >
                <Icon
                  icon="ic:round-close"
                  width="22"
                  height="22"
                  className="text-primary-100"
                />
              </button>
            </div>
          )}

          {replies && replies?.length > 0 && (
            <p
              className="mb-1 cursor-pointer text-primary-100"
              onClick={toggleShowReplies}
            >
              {replies?.length} replies
            </p>
          )}

          {showReplies &&
            replies?.map((reply: any) => (
              <div key={reply._id} className="group mb-3 flex items-start">
                <ReplyCard
                  reply={reply}
                  setReplies={setReplies}
                  replies={replies}
                  profile={profileBasic}
                  commentId={comment._id}
                  author={author}
                  postId={postId}
                  mediaId={mediaId}
                  setNumberOfComments={setNumberOfComments}
                  numberOfComments={numberOfComments}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
