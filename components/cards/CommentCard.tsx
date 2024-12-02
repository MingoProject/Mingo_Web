import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getTimestamp } from "@/lib/utils";
import CommentMenu from "../forms/comment/Modal";
import {
  addReplyToComment,
  createReplyComment,
  dislikeComment,
  likeComment,
} from "@/lib/services/comment.service";
import ReplyCard from "./ReplyCard";

const CommentCard = ({ comment, setCommentsData, type, profile }: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(comment.likes.length);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const [showReplies, setShowReplies] = useState(false); // Trạng thái hiển thị replies
  const [replies, setReplies] = useState([]);
  const [newComment, setNewComment] = useState("");

  const toggleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  useEffect(() => {
    let isMounted = true;
    try {
      if (isMounted) {
        setReplies(comment.replies);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    return () => {
      isMounted = false;
    };
  }, [comment.replies]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleOpenMenu = (commentId: string) => {
    setSelectedCommentId(commentId);
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

  const toggleLike = () => {
    if (isLiked) {
      handleDislikeComment();
      setNumberOfLikes(comment.likes.length - 1);
    } else {
      handleLikeComment();
      setNumberOfLikes(comment.likes.length + 1);
    }
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
      const newCommentData = await createReplyComment(
        { content: newComment },
        token
      );
      if (newCommentData) {
        await addReplyToComment(replyingTo, newCommentData._id, token);
      }

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
      setCommentsData((prev: any) => [enrichedComment, ...prev]);

      setNewComment("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to reply to comment:", error);
    }
  };

  return (
    <div>
      <div className="flex">
        <Image
          src={comment.userId.avatar || "/assets/images/capy.jpg"}
          alt={comment.userId.avatar}
          width={40}
          height={40}
          className="size-11 rounded-full object-cover"
        />

        <div className="ml-3 flex-1">
          <p className="text-dark100_light500 font-bold">
            {comment.userId.firstName} {comment.userId.lastName}
          </p>
          <div className="flex">
            <p className="text-dark100_light500 inline-block rounded-r-lg rounded-bl-lg border p-2">
              {comment.content}
            </p>
            <Icon
              icon="bi:three-dots"
              className="text-dark100_light500 ml-2 mt-3 hidden size-4 group-hover:inline"
              onClick={() => handleOpenMenu(comment._id)}
            />
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="mx-2 text-gray-600">
              {getTimestamp(comment.createAt)}
            </span>

            <div className="flex">
              <button
                className={`hover:underline ${
                  isLiked
                    ? "font-bold text-primary-100"
                    : "text-dark100_light500"
                }`}
                onClick={toggleLike}
              >
                Like {numberOfLikes}
              </button>
            </div>

            <span className="mx-2">·</span>
            <button
              className="text-dark100_light500 hover:underline"
              onClick={() => setReplyingTo(comment._id)}
            >
              Reply
            </button>
          </div>

          {/* Input trả lời */}
          {replyingTo === comment._id && (
            <div className="mt-2 flex">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full rounded-md border p-2"
                placeholder="Write a reply..."
              />
              <button
                onClick={handleReplyComment}
                className="mx-2 mt-3 h-10 rounded-lg bg-primary-100 p-2 text-white hover:underline"
              >
                Reply
              </button>
              <button
                className="text-2xl text-primary-100"
                onClick={() => setReplyingTo(null)}
              >
                x
              </button>
            </div>
          )}

          {replies.length > 0 && (
            <p
              className="mb-1 cursor-pointer text-primary-100"
              onClick={toggleShowReplies}
            >
              Có {replies.length} phản hồi
            </p>
          )}

          {showReplies &&
            replies.map((reply: any) => (
              <div key={reply._id} className="group mb-3 flex items-start">
                <ReplyCard
                  reply={reply}
                  setReplies={setReplies}
                  type={type}
                  profile={profile}
                  commentId={comment._id}
                />
              </div>
            ))}
        </div>

        {selectedCommentId === comment._id && (
          <div ref={menuRef}>
            <CommentMenu
              commentUserId={comment.userId._id}
              commentId={comment._id}
              content={comment.content}
              setCommentsData={setCommentsData}
              handleCloseMenu={handleCloseMenu}
              type={type}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
