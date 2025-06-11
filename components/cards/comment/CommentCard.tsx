import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import CommentMenu from "../../modals/comment/Modal";
import ReplyCard from "./ReplyCard";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import CommentAction from "./CommentAction";
import { getCommentByCommentId } from "@/lib/services/comment.service";

interface CommentCardProps {
  comment: CommentResponseDTO;
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  profileBasic: UserBasicInfo;
  author: UserBasicInfo;
  postId?: string;
  mediaId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
}
const CommentCard = ({
  comment,
  setCommentsData,
  profileBasic,
  author,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
}: CommentCardProps) => {
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );

  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentResponseDTO[]>([]);

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, left: rect.left });
    }
  }, [menuRef]);

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

  const toggleShowReplies = async () => {
    const nextShow = !showReplies;
    setShowReplies(nextShow);

    if (
      nextShow &&
      Array.isArray(comment.replies) &&
      comment.replies.length > 0
    ) {
      try {
        const detailsComments: CommentResponseDTO[] = await Promise.all(
          comment.replies.map(async (replyId: string) => {
            return await getCommentByCommentId(replyId);
          })
        );
        setReplies(detailsComments);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
  };

  const handleOpenMenu = (commentId: string, iconRef: HTMLDivElement) => {
    setSelectedCommentId(commentId);
    const rect = iconRef.getBoundingClientRect();
    setPosition({
      top: rect.bottom,
      left: rect.left,
    });
  };

  const handleCloseMenu = () => {
    setSelectedCommentId(null);
  };

  return (
    <div className="w-full">
      <div className="flex gap-[10px]">
        <Image
          src={comment.author?.avatar || "/assets/images/capy.jpg"}
          alt={comment.author?.avatar}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />

        <div className=" w-full">
          <p className="text-dark100_light100 text-[16px] font-medium">
            {comment.author.firstName} {comment.author.lastName}
          </p>
          <div className="flex">
            <p className="text-dark100_light100 text-[16px] font-normal inline-block rounded-r-[20px] rounded-bl-[20px] px-[15px] py-[10px] background-light400_dark400">
              {comment.content}
            </p>
            <Icon
              icon="bi:three-dots"
              className="text-dark100_light100 ml-2 mt-3 hidden size-4 group-hover:inline"
              onClick={(e) =>
                handleOpenMenu(comment._id, e.currentTarget as SVGSVGElement)
              }
            />
            {selectedCommentId === comment._id && (
              <div
                ref={menuRef}
                className="absolute z-50  shadow-lg rounded-md"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                }}
              >
                <CommentMenu
                  commentUserId={comment.author?._id}
                  commentId={comment._id}
                  originalCommentId={comment.originalCommentId}
                  content={comment.content}
                  setCommentsData={setCommentsData}
                  handleCloseMenu={handleCloseMenu}
                  postId={postId}
                  mediaId={mediaId}
                  setNumberOfComments={setNumberOfComments}
                  numberOfComments={numberOfComments}
                  repliesCount={replies?.length}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-[15px]">
            <CommentAction
              comment={comment}
              setNumberOfComments={setNumberOfComments}
              numberOfComments={numberOfComments}
              profileBasic={profileBasic}
              postId={postId}
              mediaId={mediaId}
              author={author}
              originalCommentId={comment._id}
              setReplies={setReplies}
            />
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <p
              className="mb-1 cursor-pointer text-primary-100"
              onClick={toggleShowReplies}
            >
              {comment.replies.length} replies
            </p>
          )}

          {showReplies &&
            replies?.map((reply: any) => (
              <div key={reply._id} className="group mb-3 flex items-start">
                <ReplyCard
                  reply={reply}
                  setReplies={setReplies}
                  replies={replies}
                  profileBasic={profileBasic}
                  commentId={comment._id}
                  author={author}
                  postId={postId}
                  mediaId={mediaId}
                  setNumberOfComments={setNumberOfComments}
                  numberOfComments={numberOfComments}
                  setCommentsData={setCommentsData}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
