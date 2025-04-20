import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import CommentMenu from "../../forms/comment/Modal";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import CommentAction from "./CommentAction";

interface ReplyCardProps {
  reply: CommentResponseDTO;
  setReplies: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
  replies: CommentResponseDTO[];
  profileBasic: UserBasicInfo;
  commentId: string;
  author: UserBasicInfo;
  postId?: string;
  mediaId?: string;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
  numberOfComments: number;
}

const ReplyCard = ({
  reply,
  setReplies,
  replies,
  profileBasic,
  commentId,
  author,
  postId,
  mediaId,
  setNumberOfComments,
  numberOfComments,
}: ReplyCardProps) => {
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <div className="w-full">
      <div className="flex gap-[10px]">
        <Image
          src={reply.author?.avatar || "/assets/images/capy.jpg"}
          alt={reply.author?.avatar}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />

        <div className=" w-full">
          <p className="text-dark100_light100 text-[16px] flex items-center gap-1 font-medium">
            <span>
              {reply?.author?.firstName || ""} {reply?.author?.lastName || ""}
            </span>
            {reply?.parentId?._id !== reply?.originalCommentId && (
              <>
                <Icon icon="raphael:arrowright" />
                <span>
                  {reply?.parentId?.firstName || ""}{" "}
                  {reply?.parentId?.lastName || ""}
                </span>
              </>
            )}
          </p>
          <div className="flex">
            <p className="text-dark100_light100 text-[16px] font-normal inline-block rounded-r-[20px] rounded-bl-[20px] px-[15px] py-[10px] background-light400_dark400">
              {reply?.content ? reply.content : ""}
            </p>
            <Icon
              icon="bi:three-dots"
              className="text-dark100_light100 ml-2 mt-3 hidden size-4 group-hover:inline"
              onClick={(e) =>
                handleOpenMenu(reply?._id, e.currentTarget as SVGSVGElement)
              }
            />
            {selectedCommentId === reply._id && (
              <div
                ref={menuRef}
                className="absolute z-50 shadow-lg rounded-md"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                }}
              >
                <CommentMenu
                  commentUserId={reply.author._id}
                  commentId={reply._id}
                  originalCommentId={reply.originalCommentId}
                  content={reply.content}
                  commentsData={replies}
                  setCommentsData={setReplies}
                  handleCloseMenu={handleCloseMenu}
                  postId={postId}
                  mediaId={mediaId}
                  setNumberOfComments={setNumberOfComments}
                  numberOfComments={numberOfComments}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-[15px]">
            <CommentAction
              comment={reply}
              setNumberOfComments={setNumberOfComments}
              numberOfComments={numberOfComments}
              profileBasic={profileBasic}
              postId={postId}
              mediaId={mediaId}
              author={author}
              originalCommentId={commentId}
              setReplies={setReplies}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
