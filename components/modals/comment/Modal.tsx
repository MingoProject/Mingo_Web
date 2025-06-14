import ReportCard from "@/components/cards/ReportCard";
import Button from "@/components/ui/button";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import {
  deleteComment,
  deleteCommentMedia,
  deleteCommentReply,
  deleteCommentReplyMedia,
  updateComment,
} from "@/lib/services/comment.service";
import React, { useState, useEffect, useRef } from "react";

interface CommentMenuProps {
  commentUserId: string;
  commentId: string;
  originalCommentId: string;
  content: string;
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  handleCloseMenu: () => void;
  postId?: string;
  mediaId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
  setParentCommentsData?: React.Dispatch<
    React.SetStateAction<CommentResponseDTO[]>
  >;
  repliesCount?: number;
}

const CommentMenu = ({
  commentUserId,
  commentId,
  originalCommentId,
  content,
  setCommentsData,
  handleCloseMenu,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
  repliesCount,
  setParentCommentsData,
}: CommentMenuProps) => {
  const [newComment, setNewComment] = useState(content); // Khởi tạo giá trị mặc định là content
  const [isEditing, setIsEditing] = useState(false);
  const menuRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [isReport, setIsReport] = useState(false);

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
            ? { ...comment, content: newComment }
            : comment
        )
      );
      // console.log(commentsData);

      handleCloseMenu();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (postId) {
        if (originalCommentId === null) {
          // Xóa comment gốc
          await deleteComment(commentId, postId, token);

          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );
          if (repliesCount)
            setNumberOfComments(numberOfComments - (repliesCount + 1));
        } else {
          // Xóa comment reply (POST)
          await deleteCommentReply(commentId, postId, originalCommentId, token);

          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );

          // cập nhật comment gốc trong danh sách cha
          if (setParentCommentsData) {
            setParentCommentsData((prev: any) =>
              prev.map((comment: any) => {
                if (comment._id === originalCommentId) {
                  return {
                    ...comment,
                    replies: comment.replies.filter(
                      (id: string) => id !== commentId
                    ),
                  };
                }
                return comment;
              })
            );
          }
          setNumberOfComments(numberOfComments - 1);
        }
      } else {
        if (originalCommentId === null) {
          // Xóa comment gốc (MEDIA)
          if (mediaId) {
            await deleteCommentMedia(commentId, mediaId, token);
          }

          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );
          if (repliesCount)
            setNumberOfComments(numberOfComments - (repliesCount + 1));
        } else {
          if (mediaId) {
            await deleteCommentReplyMedia(
              commentId,
              mediaId,
              originalCommentId,
              token
            );
          }

          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );

          if (setParentCommentsData) {
            setParentCommentsData((prev: any) =>
              prev.map((comment: any) => {
                if (comment._id === originalCommentId) {
                  return {
                    ...comment,
                    replies: comment.replies.filter(
                      (id: string) => id !== commentId
                    ),
                  };
                }
                return comment;
              })
            );
          }

          setNumberOfComments(numberOfComments - 1);
        }
      }

      handleCloseMenu();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute rounded-md mr-10 shadow-lg background-light400_dark400"
    >
      {isCommentOwner(commentUserId) ? (
        <>
          <button
            onClick={handleOpenEditComment}
            className="text-dark100_light100 w-full px-4 py-2 text-left text-sm "
          >
            Edit
          </button>

          {isEditing && (
            <div className="fixed inset-0 z-50 flex text-dark100_light500 items-center justify-center bg-black bg-opacity-50">
              <div className="background-light200_dark200 w-[400px] rounded-md p-4 shadow-lg">
                <h3 className="text-lg font-semibold text-dark100_light100">
                  Edit Comment
                </h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-transparent border border-light-300 dark:border-dark-300 text-dark100_light100 mt-2 w-full rounded-md p-2"
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    title="Close"
                    size="small"
                    color="transparent"
                    border="border border-border-100"
                    fontColor="text-dark100_light100"
                    onClick={() => {
                      setIsEditing(false), handleCloseMenu();
                    }}
                  />
                  <Button
                    title="Save"
                    size="small"
                    onClick={() => handleEditComment(commentId, newComment)}
                  />
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => handleDeleteComment()}
            className="text-dark100_light100 w-full px-4 pt-1 pb-2 text-left text-sm "
          >
            Delete
          </button>
        </>
      ) : (
        <button
          className="text-dark100_light100 w-full px-4 py-2 text-left text-sm "
          onClick={() => setIsReport(true)}
        >
          Report
        </button>
      )}
      {isReport && (
        <ReportCard
          onClose={() => setIsReport(false)}
          type="comment"
          entityId={commentId}
          reportedId={commentUserId}
          postId={postId}
        />
      )}
    </div>
  );
};

export default CommentMenu;
