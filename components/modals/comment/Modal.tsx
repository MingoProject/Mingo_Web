import ReportCard from "@/components/cards/ReportCard";
import ButtonClose from "@/components/ui/buttonClose";
import {
  deleteComment,
  deleteCommentMedia,
  deleteCommentReply,
  deleteCommentReplyMedia,
  updateComment,
} from "@/lib/services/comment.service";
import React, { useState, useEffect, useRef } from "react";

const CommentMenu = ({
  commentUserId,
  commentId,
  originalCommentId,
  content,
  commentsData,
  setCommentsData,
  handleCloseMenu,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
  repliesCount,
}: any) => {
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

  // const handleCloseEditComment = () => {
  //   setIsEditing(false);
  // };

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

  const handleDeleteComment = async (commentId: string, postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (postId) {
        if (originalCommentId === null) {
          await deleteComment(commentId, postId, token);
          setNumberOfComments(numberOfComments - (repliesCount + 1));
          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );
        } else {
          const childReplies = commentsData.filter(
            (comment: any) => comment.parentId === commentId
          );
          setCommentsData((prev: any) =>
            prev.filter(
              (comment: any) =>
                comment._id !== commentId &&
                !childReplies.some((child: any) => child._id === comment._id)
            )
          );
          await deleteCommentReply(commentId, postId, originalCommentId, token);
          setNumberOfComments(numberOfComments - (childReplies.length + 1));
        }
      } else {
        if (originalCommentId === null) {
          await deleteCommentMedia(commentId, mediaId, token);
          setNumberOfComments(numberOfComments - (repliesCount + 1));
          setCommentsData((prev: any) =>
            prev.filter((comment: any) => comment._id !== commentId)
          );
        } else {
          const childReplies = commentsData.filter(
            (comment: any) => comment.parentId === commentId
          );
          setCommentsData((prev: any) =>
            prev.filter(
              (comment: any) =>
                comment._id !== commentId &&
                !childReplies.some((child: any) => child._id === comment._id)
            )
          );
          await deleteCommentReplyMedia(
            commentId,
            mediaId,
            originalCommentId,
            token
          );
          setNumberOfComments(numberOfComments - (childReplies.length + 1));
        }
      }

      setCommentsData((prev: any) =>
        prev.filter((comment: any) => comment._id !== commentId)
      );
      handleCloseMenu();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute rounded-md mr-10 shadow-lg background-light800_dark400"
    >
      {isCommentOwner(commentUserId) ? (
        <>
          <button
            onClick={handleOpenEditComment}
            className="text-dark100_light500 w-full px-4 pb-1 pt-2 text-left text-sm "
          >
            Edit
          </button>

          {isEditing && (
            <div className="fixed inset-0 z-50 flex text-dark100_light500 items-center justify-center bg-black bg-opacity-50">
              <div className="background-light700_dark300 w-[400px] rounded-md p-4 shadow-lg">
                <h3 className="text-lg font-bold">Edit Comment</h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-transparent border border-gray-300 text-dark100_light500 mt-2 w-full rounded-md p-2"
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <ButtonClose
                    onClick={() => {
                      setIsEditing(false), handleCloseMenu();
                    }}
                  />
                  <button
                    onClick={() => handleEditComment(commentId, newComment)}
                    className="rounded-md bg-primary-100 px-3 py-1 text-sm text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => handleDeleteComment(commentId, postId)}
            className="text-dark100_light500 w-full px-4 pt-1 pb-2 text-left text-sm "
          >
            Delete
          </button>
        </>
      ) : (
        <button
          className="text-dark100_light500 w-full px-4 py-2 text-left text-sm "
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
