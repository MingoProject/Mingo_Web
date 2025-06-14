import Button from "@/components/ui/button";
import IconButton from "@/components/ui/iconButton";
import TextArea from "@/components/ui/textarea";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import {
  addReplyToComment,
  createReplyCommentMedia,
  createReplyCommentPost,
  dislikeComment,
  likeComment,
} from "@/lib/services/comment.service";
import { createNotification } from "@/lib/services/notification.service";
import { timeSinceMessage } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface CommentActionProps {
  comment: CommentResponseDTO;
  profileBasic: UserBasicInfo;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  postId?: string;
  mediaId?: string;
  author: UserBasicInfo;
  originalCommentId: string;
  setReplies: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  setCommentsData?: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
}
const CommentAction = ({
  comment,
  profileBasic,
  setNumberOfComments,
  numberOfComments,
  postId,
  mediaId,
  author,
  originalCommentId,
  setReplies,
  setCommentsData,
}: CommentActionProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [numberOfLikes, setNumberOfLikes] = useState(comment?.likes.length);
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
            originalCommentId: originalCommentId,
          },
          token,
          postId
        );
        if (newCommentData) {
          await addReplyToComment(originalCommentId, newCommentData._id, token);
        }

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
          parentId: {
            _id: comment?._id,
            avatar:
              comment?.author.avatar || "/assets/images/default-avatar.jpg",
            firstName: comment?.author.firstName || "Anonymous",
            lastName: comment?.author.lastName || "Anonymous",
          },
          originalCommentId: originalCommentId,
        };

        // setReplies((prev: CommentResponseDTO[]) => [enrichedComment, ...prev]);
        setReplies((prev: CommentResponseDTO[]) => [enrichedComment, ...prev]);

        comment.replies = [enrichedComment._id, ...(comment.replies || [])];

        if (setCommentsData) {
          setCommentsData((prevComments) =>
            prevComments.map((c) => {
              if (c._id === originalCommentId) {
                return {
                  ...c,
                  replies: [enrichedComment._id, ...(c.replies || [])],
                };
              }
              return c;
            })
          );
        }
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
            originalCommentId: originalCommentId,
          },
          token,
          mediaId
        );
        if (newCommentData) {
          await addReplyToComment(originalCommentId, newCommentData._id, token);
        }

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
          parentId: {
            _id: comment?._id,
            avatar:
              comment?.author.avatar || "/assets/images/default-avatar.jpg",
            firstName: comment?.author.firstName || "Anonymous",
            lastName: comment?.author.lastName || "Anonymous",
          },
          originalCommentId: originalCommentId,
        };

        // setReplies((prev: CommentResponseDTO[]) => [enrichedComment, ...prev]);
        setReplies((prev: CommentResponseDTO[]) => [enrichedComment, ...prev]);

        comment.replies = [enrichedComment._id, ...(comment.replies || [])];

        if (setCommentsData) {
          setCommentsData((prevComments) =>
            prevComments.map((c) => {
              if (c._id === originalCommentId) {
                return {
                  ...c,
                  replies: [enrichedComment._id, ...(c.replies || [])],
                };
              }
              return c;
            })
          );
        }
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
  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-[15px] cursor-pointer">
        <span className="text-dark100_light100 text-[12px] font-normal">
          {timeSinceMessage(comment.createAt)}
        </span>

        <div className="flex">
          <div
            className={`hover:underline text-[14px] ${
              isLiked ? "font-bold text-primary-100" : "text-dark100_light100"
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
        <div className="flex w-full gap-2">
          <div className="mt-2 w-full">
            <TextArea
              iconSrc="lets-icons:send-light"
              avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
              placeholder="Write a reply"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onClick={handleReplyComment}
            />
          </div>
          <div className="mt-3">
            <IconButton
              iconSrc="ic:round-close"
              onClick={() => setReplyingTo(null)}
              color="bg-primary-100"
              iconColor="text-dark100_light200"
              padding="p-[5px]"
              iconSize="size-[20px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentAction;
