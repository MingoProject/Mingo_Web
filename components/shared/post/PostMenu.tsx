import { deletePost, savePost, unsavePost } from "@/lib/services/post.service";
import React, { useEffect, useRef, useState } from "react";
import EditPost from "../../forms/post/EditPost";
import { useAuth } from "@/context/AuthContext";
import ReportCard from "@/components/cards/ReportCard";
import { PostResponseDTO } from "@/dtos/PostDTO";
import DropdownMenu, { DropdownItem } from "@/components/ui/dropdownMenu";

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
  const [isReport, setIsReport] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    setIsSaved(profile?.saveIds?.includes(post._id) ?? false);
  }, [profile, post._id]);

  const isPostOwner = post.author._id === userId;

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await deletePost(post._id, token);
      setPostsData?.((prev: any) =>
        prev.filter((p: PostResponseDTO) => p._id !== post._id)
      );
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleSavePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await savePost(post._id, token);
    } catch (err) {
      console.error("Failed to save post:", err);
    }
  };

  const handleUnsavePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await unsavePost(post._id, token);
    } catch (err) {
      console.error("Failed to unsave post:", err);
    }
  };

  const getMenuItems = (): DropdownItem[] => {
    if (isPostOwner) {
      return [
        {
          label: "Edit",
          onClick: () => setIsEditing(true),
          autoClose: false,
        },
        {
          label: "Delete",
          onClick: handleDeletePost,
        },
      ];
    } else {
      return [
        {
          label: isSaved ? "Unsave post" : "Save post",
          onClick: isSaved ? handleUnsavePost : handleSavePost,
        },
        {
          label: "Report",
          onClick: () => setIsReport(true),
          autoClose: false,
        },
      ];
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <DropdownMenu items={getMenuItems()} onClose={onClose} />

      {isEditing && (
        <EditPost
          postId={post._id}
          onClose={() => setIsEditing(false)}
          setPostsData={setPostsData}
        />
      )}

      {isReport && (
        <ReportCard
          onClose={() => setIsReport(false)}
          type="post"
          entityId={post._id}
          reportedId={post.author._id}
        />
      )}
    </div>
  );
};

export default PostMenu;
