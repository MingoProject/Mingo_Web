import {
  deleteComment,
  deleteCommentMedia,
  updateComment,
} from "@/lib/services/comment.service";
import React, { useState, useEffect, useRef } from "react";

const CommentMenu = ({
  commentUserId,
  commentId,
  content,
  setCommentsData,
  handleCloseMenu,
  type,
}: any) => {
  const [newComment, setNewComment] = useState(content); // Khởi tạo giá trị mặc định là content
  const [isEditing, setIsEditing] = useState(false);
  const menuRef = useRef(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      setNewComment(content);
    }
  }, [isEditing, content]);

  const handleOpenEditComment = () => {
    setIsEditing(true);
  };

  const handleCloseEditComment = () => {
    setIsEditing(false);
  };

  const isCommentOwner = (commentUserId: string) => {
    return commentUserId === userId;
  };

  const handleEditComment = async (
    commentId: string,
    updatedContent: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token || !updatedContent.trim()) return;

    try {
      const updatedComment = await updateComment(
        { content: updatedContent },
        commentId,
        token
      );
      setCommentsData((prev: any) =>
        prev.map((comment: any) =>
          comment._id === commentId
            ? { ...comment, content: updatedComment.content }
            : comment
        )
      );
      handleCloseMenu();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string, type: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (type === "mediaId") {
        // Xóa bình luận
        await deleteCommentMedia(commentId, type, token);
      } else if (type === "postId") {
        await deleteComment(commentId, type, token); // Wait for the deletion
      }

      setCommentsData(
        (prev: any) => prev.filter((comment: any) => comment._id !== commentId) // Remove deleted comment from state
      );
      handleCloseMenu();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div
      ref={menuRef}
      className="background-light800_dark400 mt-2 w-48 rounded-lg border shadow-lg"
    >
      {isCommentOwner(commentUserId) ? (
        <>
          <button
            onClick={handleOpenEditComment}
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
          >
            Sửa
          </button>
          {isEditing && (
            <div className="absolute mt-20">
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)} // Cập nhật giá trị khi người dùng sửa
                  className="background-light800_dark400 text-dark100_light500 w-full rounded-xl p-2"
                />
                <button
                  onClick={() => handleEditComment(commentId, newComment)}
                  className="rounded-md bg-primary-100 px-3 py-1 text-sm text-white"
                >
                  Lưu
                </button>
                <button
                  onClick={handleCloseEditComment}
                  className="text-dark100_light500 ml-2 rounded-md bg-gray-300 px-3 py-1 text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => handleDeleteComment(commentId, type)}
            className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200"
          >
            Xóa
          </button>
          <button className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200">
            Báo cáo
          </button>
        </>
      ) : (
        <button className="text-dark100_light500 w-full px-4 py-1 text-left text-sm hover:bg-gray-200">
          Báo cáo
        </button>
      )}
    </div>
  );
};

export default CommentMenu;
