import { PostResponseDTO } from "@/dtos/PostDTO";
import { createNotification } from "@/lib/services/notification.service";
import { dislikePost, likePost } from "@/lib/services/post.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
interface PostActionProps {
  post: PostResponseDTO;
  userId: string;
  numberOfLikes: number;
  setNumberOfLikes: React.Dispatch<React.SetStateAction<number>>;
  isLiked: boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
  numberOfComments: number;
}
const PostAction = ({
  post,
  userId,
  numberOfLikes,
  setNumberOfLikes,
  isLiked,
  setIsLiked,
  numberOfComments,
}: PostActionProps) => {
  const handleLikePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await likePost(post?._id, token);
        setIsLiked(!isLiked);
        if (userId !== post?.author._id) {
          const params = {
            senderId: userId,
            receiverId: post?.author._id,
            type: "like",
            postId: post?._id,
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
        await dislikePost(post?._id, token);

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
    const postUrl = `${window.location.origin}/post/${post?._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div>
      <div className="text-dark100_light100 flex items-center justify-between">
        <div className="flex gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <Icon
              onClick={toggleLike}
              icon={isLiked ? "ph:heart-fill" : "ph:heart"}
              className={
                isLiked
                  ? "size-[30px] text-primary-100"
                  : "text-dark100_light100 size-[30px]"
              }
            />
            <span className="text-dark100_light100 text-[16px] font-normal">
              {numberOfLikes} Likes
            </span>
          </div>
          <div className="flex items-center gap-[10px]">
            <Icon
              icon="iconamoon:comment"
              className="text-dark100_light100 size-[30px]"
            />
            <span className="text-dark100_light100 text-[16px] font-normal">
              {numberOfComments} Comments
            </span>
          </div>
        </div>

        <div className="flex items-center gap-[10px]" onClick={handleShare}>
          <Icon
            icon="bitcoin-icons:link-filled"
            className="text-dark100_light100 size-[30px]"
          />
          <span className="text-dark100_light100 text-[16px] font-normal">
            {post?.shares.length} Shares
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostAction;
