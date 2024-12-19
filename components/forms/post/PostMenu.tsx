import { deletePost, savePost, unsavePost } from "@/lib/services/post.service";
import React, { useEffect, useRef, useState } from "react";
import EditPost from "./EditPost";
import { useAuth } from "@/context/AuthContext";
import ReportCard from "@/components/cards/ReportCard";

const PostMenu = ({
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
  onClose,
}: {
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
  onClose: () => void;
}) => {
  const menuRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { profile } = useAuth();
  const [isReport, setIsReport] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(userId);
    }
  }, []);

  const isPostOwner = (author: string) => {
    return author === userId;
  };

  const handleOpenEditPost = () => {
    setIsEditing(true);
  };

  const handleDeletePost = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await deletePost(postId, token);
      onClose();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  useEffect(() => {
    if (profile?.saveIds?.includes(postId)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [profile, postId]);

  const handleSavePost = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await savePost(postId, token);
      onClose();
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  const handleUnsavePost = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await unsavePost(postId, token);
      onClose();
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  return (
    <div
      ref={menuRef}
      className="background-light800_dark400 absolute mt-2 w-48 rounded-lg border shadow-lg"
    >
      {isPostOwner(author._id) ? (
        <>
          <button
            onClick={handleOpenEditPost}
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
          >
            Edit
          </button>
          {isEditing && (
            <EditPost postId={postId} onClose={() => setIsEditing(false)} />
          )}
          <button
            onClick={() => handleDeletePost(postId)}
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
          >
            Delete
          </button>
        </>
      ) : (
        <>
          {isSaved ? (
            <button
              onClick={() => handleUnsavePost(postId)}
              className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
            >
              Unsave post
            </button>
          ) : (
            <button
              onClick={() => handleSavePost(postId)}
              className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
            >
              Save post
            </button>
          )}
          <button
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
            onClick={() => setIsReport(true)}
          >
            Report
          </button>
        </>
      )}
      {isReport && (
        <ReportCard
          onClose={() => setIsReport(false)}
          type="post"
          entityId={postId}
          reportedId={author._id}
        />
      )}
    </div>
  );
};

export default PostMenu;
