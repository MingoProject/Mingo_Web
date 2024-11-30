import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getTimestamp } from "@/lib/utils";
import CommentMenu from "../forms/comment/Modal";
import { dislikeComment, likeComment } from "@/lib/services/comment.service";

const CommentCard = ({ comment, setCommentsData, type }: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(comment.likes.length);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );

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
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const isUserLiked = comment.likes.some(
          (like: any) => like._id === userId
        );
        setIsLiked(isUserLiked);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
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
            <span className="text-gray-600">
              {getTimestamp(comment.createAt)}
            </span>

            <span className="mx-2 text-gray-600">·</span>

            <div className="flex">
              <button
                className={`hover:underline ${
                  isLiked
                    ? "font-bold text-primary-100"
                    : "text-dark100_light500"
                }`}
                onClick={toggleLike}
              >
                Thích {numberOfLikes}
              </button>
            </div>

            <span className="mx-2">·</span>
            <button className="text-dark100_light500 hover:underline">
              Trả lời
            </button>
          </div>
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
