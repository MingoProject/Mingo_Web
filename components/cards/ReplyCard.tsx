import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getTimestamp } from "@/lib/utils";
import CommentMenu from "../forms/comment/Modal";
import {
  addReplyToComment,
  createReplyComment,
  dislikeComment,
  getCommentByCommentId,
  likeComment,
} from "@/lib/services/comment.service";

const ReplyCard = ({ reply, setReplies, type, profile, commentId }: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(reply.likes.length);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );

  const [detailsComment, setDetailsComment] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [parentComment, setParentComment] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDetailsComment = async () => {
      try {
        const details = await getCommentByCommentId(reply._id);
        console.log("details", details);
        if (isMounted) {
          setDetailsComment(details);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchDetailsComment();
    return () => {
      isMounted = false;
    };
  }, [reply._id]);

  useEffect(() => {
    let isMounted = true;
    const fetchDetailsComment = async () => {
      try {
        if (detailsComment?.parentId?._id) {
          const parent = await getCommentByCommentId(
            detailsComment?.parentId?._id
          );
          if (isMounted) {
            setParentComment(parent);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchDetailsComment();
    return () => {
      isMounted = false;
    };
  }, [detailsComment?.parentId?._id, parentComment]);

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
        await likeComment(reply._id, token);
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
        const isUserLiked = reply.likes.some(
          (like: any) => like._id === userId
        );
        setIsLiked(isUserLiked);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [reply.likes]);

  const handleDislikeComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await dislikeComment(reply._id, token);

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
      setNumberOfLikes(reply.likes.length - 1);
    } else {
      handleLikeComment();
      setNumberOfLikes(reply.likes.length + 1);
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
        { content: newComment, parentId: detailsComment._id },
        token
      );
      if (newCommentData) {
        await addReplyToComment(commentId, newCommentData._id, token);
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
      setReplies((prev: any) => [enrichedComment, ...prev]);

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
          src={
            detailsComment?.userId?.avatar
              ? detailsComment.userId.avatar
              : "/assets/images/capy.jpg"
          }
          alt={detailsComment?.userId?.avatar || "Default avatar"}
          width={40}
          height={40}
          className="size-11 rounded-full object-cover"
        />

        <div className="ml-3 flex-1">
          <p className="text-dark100_light500 flex items-center space-x-2 font-bold">
            <span>
              {detailsComment?.userId?.firstName || ""}{" "}
              {detailsComment?.userId?.lastName || ""}
            </span>
            {parentComment && (
              <>
                <Icon icon="raphael:arrowright" />
                <span>
                  {parentComment.userId.firstName || ""}{" "}
                  {parentComment.userId.lastName || ""}
                </span>
              </>
            )}
          </p>
          <div className="flex">
            <p className="text-dark100_light500 inline-block rounded-r-lg rounded-bl-lg border p-2">
              {detailsComment?.content ? detailsComment.content : ""}
            </p>
            <Icon
              icon="bi:three-dots"
              className="text-dark100_light500 ml-2 mt-3 hidden size-4 group-hover:inline"
              onClick={() => handleOpenMenu(detailsComment?._id)}
            />
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="text-gray-600">
              {detailsComment?.createAt
                ? getTimestamp(detailsComment.createAt)
                : ""}
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
                Like {numberOfLikes}
              </button>
            </div>

            <span className="mx-2">·</span>
            <button
              className="text-dark100_light500 hover:underline"
              onClick={() =>
                setReplyingTo(detailsComment?._id ? detailsComment._id : "")
              }
            >
              Reply
            </button>
          </div>
        </div>
        {replyingTo === detailsComment?._id && (
          <div className="mt-2 flex">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Write a reply..."
            />
            <button
              onClick={handleReplyComment}
              className="mt-2 text-primary-100 hover:underline"
            >
              Reply
            </button>
            <button
              className="text-primary-100"
              onClick={() => setReplyingTo(null)}
            >
              x
            </button>
          </div>
        )}

        {selectedCommentId === reply._id && (
          <div ref={menuRef}>
            <CommentMenu
              commentUserId={detailsComment.userId._id}
              commentId={detailsComment._id}
              content={detailsComment.content}
              setCommentsData={setReplies}
              handleCloseMenu={handleCloseMenu}
              type={type}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyCard;
