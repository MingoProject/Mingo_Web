import { createNotification } from "@/lib/services/notification.service";
import { dislikePost, likePost } from "@/lib/services/post.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const Action = ({ likes, postId, comments, shares, author, profile }: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(likes.length);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const isUserLiked = likes.some((like: any) => like === userId);
        setIsLiked(isUserLiked);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [likes]);
  const handleLikePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await likePost(postId, token);
        setIsLiked(!isLiked);
        if (profile._id !== author._id) {
          const params = {
            senderId: profile._id,
            receiverId: author._id,
            type: "like",
            postId,
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

  const handleDislikePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await dislikePost(postId, token);

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
      await handleDislikePost();
      setNumberOfLikes((prev: any) => prev - 1);
    } else {
      await handleLikePost();
      setNumberOfLikes((prev: any) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div>
      <div className="text-dark100_light500 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon
            onClick={toggleLike}
            icon={
              isLiked ? "ic:baseline-favorite" : "ic:baseline-favorite-border"
            }
            className={
              isLiked
                ? "size-7 text-primary-100"
                : "text-dark100_light500 size-5"
            }
          />
          <span className="text-dark100_light500 ">{numberOfLikes} Likes</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon
            icon="mingcute:message-4-line"
            className="text-dark100_light500 size-5"
          />
          <span className="text-dark100_light500">
            {comments.length} Comments
          </span>
        </div>
        <div className="flex items-center space-x-2" onClick={handleShare}>
          <Icon
            icon="bitcoin-icons:link-filled"
            className="text-dark100_light500 size-7"
          />
          <span className="text-dark100_light500">{shares.length} Shares</span>
        </div>
      </div>
    </div>
  );
};

export default Action;
