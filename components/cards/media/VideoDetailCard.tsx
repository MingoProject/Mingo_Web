import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  createCommentMedia,
  getCommentByCommentId,
} from "@/lib/services/comment.service";
import CommentCard from "@/components/cards/comment/CommentCard";
import { createNotification } from "@/lib/services/notification.service";
import { getTimestamp } from "@/lib/utils";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import ImageAction from "@/components/forms/personalPage/ImageAction";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface VideoDetailCardProps {
  video: MediaResponseDTO;
  onClose: () => void;
  profileUser: UserBasicInfo;
  profileBasic: UserBasicInfo;
  commentsData: CommentResponseDTO[];
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
}

const VideoDetailCard = ({
  video,
  onClose,
  profileUser,
  profileBasic,
  commentsData,
  setCommentsData,
}: VideoDetailCardProps) => {
  // const [commentsData, setCommentsData] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [numberOfComments, setNumberOfComments] = useState(
    video.comments?.length
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCommentsData = async () => {
      const detailsComments = await Promise.all(
        video?.comments.map(async (comment: any) => {
          return await getCommentByCommentId(comment);
        })
      );

      if (isMounted) {
        setCommentsData(detailsComments);
      }
      // console.log(detailsComments);
    };

    if (video?.comments.length > 0) {
      fetchCommentsData();
    }
    return () => {
      isMounted = false;
    };
  }, [video?.comments]);

  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    if (!newComment.trim()) {
      console.warn("Comment cannot be empty");
      return;
    }

    try {
      const newCommentData = await createCommentMedia(
        { content: newComment },
        token,
        video._id
      );

      const currentTime = new Date();
      const isoStringWithOffset = currentTime
        .toISOString()
        .replace("Z", "+00:00");
      console.log(
        "Current Time (new Date()):",
        currentTime.toISOString().replace("Z", "+00:00")
      );
      const enrichedComment = {
        ...newCommentData,
        userId: {
          _id: profileBasic?._id,
          avatar: profileBasic?.avatar || "/assets/images/capy.jpg",
          firstName: profileBasic?.firstName || "Anonymous",
          lastName: profileBasic?.lastName || "Anonymous",
        },
        createAt: isoStringWithOffset,
      };

      // Cập nhật state commentsData
      setCommentsData((prev: any) => [enrichedComment, ...prev]);

      if (profileUser._id !== profileBasic._id) {
        const notificationParams = {
          senderId: profileBasic._id,
          receiverId: profileUser._id,
          type: "comment_media",
          mediaId: video._id,
        };

        await createNotification(notificationParams, token);
      }

      setNumberOfComments(numberOfComments + 1);
      // setCommentsData((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleClose = async () => {
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="background-light200_dark200 flex flex-col gap-5 text-dark100_light100 z-50 max-h-screen w-[90%] overflow-y-auto rounded-[10px] p-6 shadow-lg md:w-4/5 lg:w-[70%]">
        <div className="flex justify-end">
          <Icon
            icon="ic:round-close"
            className="size-[30px] text-primary-100"
            onClick={onClose}
          />
        </div>
        <div className="block lg:flex">
          <div className="w-full lg:w-1/2">
            <div className=" flex items-center">
              <div className="flex items-center gap-[10px]">
                <Link href={`/profile/${profileUser._id}`}>
                  <Image
                    src={profileUser?.avatar || "/assets/images/capy.jpg"}
                    alt="Avatar"
                    width={45}
                    height={45}
                    className="size-11 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <p className="text-dark100_light100  text-[16px] font-medium">
                    {profileUser?.firstName || ""} {profileUser?.lastName || ""}
                  </p>
                  <span className="text-dark100_light100 text-[12px] font-normal">
                    {video?.createAt && getTimestamp(video?.createAt)}
                  </span>
                </div>
              </div>
              {/* <div className="ml-auto">
                <Icon
                  icon="tabler:dots"
                  className="text-dark100_light500 cursor-pointer"
                />
              </div> */}
            </div>
            <span>{video.caption}</span>
            <div className="mt-8 flex w-full items-center justify-center">
              <div className=" mx-auto flex h-64 w-full items-center justify-center">
                <video width={400} height={400} controls>
                  <source src={video?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="mx-10 my-5">
              <ImageAction
                likes={video?.likes}
                mediaId={video?._id}
                numberOfComments={numberOfComments}
                shares={video?.shares}
                author={profileUser}
                profile={profileBasic}
              />
              <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />

              <div
                className="my-4 h-80 overflow-y-scroll"
                style={{
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE và Edge
                }}
              >
                {commentsData.length > 0 ? (
                  commentsData.map(
                    (comment: any) =>
                      comment.parentId === null && (
                        <div
                          key={comment._id}
                          className="group mb-3 flex items-start"
                        >
                          <CommentCard
                            comment={comment}
                            setCommentsData={setCommentsData}
                            mediaId={video._id}
                            author={profileUser}
                            profileBasic={profileBasic}
                            setNumberOfComments={setNumberOfComments}
                            numberOfComments={numberOfComments}
                          />
                        </div>
                      )
                  )
                ) : (
                  <p className="text-dark100_light500">No comments yet.</p>
                )}
              </div>

              <div className="flex">
                <div className="flex w-full gap-[10px]">
                  <Input
                    avatarSrc={
                      profileBasic?.avatar || "/assets/images/capy.jpg"
                    }
                    placeholder="Write a comment"
                    readOnly={false}
                    cursor="text"
                    value={newComment}
                    onChange={handleInputChange}
                  />
                  <Button
                    title="Comment"
                    size="small"
                    onClick={handleAddComment}
                    color="bg-primary-100"
                    fontColor="text-dark100_light200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailCard;
