import { deletePost, savePost, unsavePost } from "@/lib/services/post.service";
import React, { useEffect, useRef, useState } from "react";
import EditPost from "./EditPost";
import { useAuth } from "@/context/AuthContext";
import ReportCard from "@/components/cards/ReportCard";
import { PostResponseDTO } from "@/dtos/PostDTO";

interface PostMenuProps {
  post: PostResponseDTO;
  onClose: () => void;
  setPostsData?: (data: any) => void;
}
const PostMenu = ({ post, onClose, setPostsData }: PostMenuProps) => {
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
      setPostsData?.((prevPosts: any) =>
        prevPosts.filter((post: any) => post._id !== postId)
      );
      onClose();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  useEffect(() => {
    if (profile?.saveIds?.includes(post?._id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [profile, post?._id]);

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
      className="background-light800_dark400 absolute mt-2 w-48 rounded-md border shadow-lg"
    >
      {isPostOwner(post?.author._id) ? (
        <>
          <button
            onClick={handleOpenEditPost}
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm "
          >
            Edit
          </button>
          {isEditing && (
            <EditPost
              postId={post?._id}
              onClose={() => setIsEditing(false)}
              setPostsData={setPostsData}
            />
          )}
          <button
            onClick={() => handleDeletePost(post?._id)}
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm "
          >
            Delete
          </button>
        </>
      ) : (
        <>
          {isSaved ? (
            <button
              onClick={() => handleUnsavePost(post?._id)}
              className="text-dark100_light500 w-full px-4 py-1 text-left text-sm "
            >
              Unsave post
            </button>
          ) : (
            <button
              onClick={() => handleSavePost(post?._id)}
              className="text-dark100_light500 w-full px-4 py-1 text-left text-sm "
            >
              Save post
            </button>
          )}
          <button
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm "
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
          entityId={post?._id}
          reportedId={post?.author._id}
        />
      )}
    </div>
  );
};

export default PostMenu;
