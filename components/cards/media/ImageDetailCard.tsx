import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createCommentMedia } from "@/lib/services/comment.service";
import CommentCard from "@/components/cards/comment/CommentCard";
import { createNotification } from "@/lib/services/notification.service";
import { getTimestamp } from "@/lib/utils";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ImageAction from "@/components/forms/personalPage/ImageAction";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import { UserBasicInfo, UserResponseDTO } from "@/dtos/UserDTO";
import { CommentResponseDTO } from "@/dtos/CommentDTO";

interface ImageDetailCardProps {
  image: MediaResponseDTO;
  onClose: () => void;
  profileUser: UserBasicInfo;
  profileBasic: UserBasicInfo;
  commentsData: CommentResponseDTO[];
  setCommentsData: React.Dispatch<React.SetStateAction<CommentResponseDTO[]>>;
}

const ImageDetailCard = ({
  image,
  onClose,
  profileUser,
  profileBasic,
  commentsData,
  setCommentsData,
}: ImageDetailCardProps) => {
  const [newComment, setNewComment] = useState<string>("");
  const [numberOfComments, setNumberOfComments] = useState(
    image.comments?.length
  );

  // console.log(image);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

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
        image._id
      );

      const currentTime = new Date();
      const enrichedComment: CommentResponseDTO = {
        ...newCommentData,
        author: {
          _id: profileBasic?._id,
          avatar: profileBasic?.avatar || "/assets/images/default-avatar.jpg",
          firstName: profileBasic?.firstName || "Anonymous",
          lastName: profileBasic?.lastName || "Anonymous",
        },
        createAt: currentTime,
        likes: [],
      };
      image.comments = [newCommentData._id, ...image.comments];

      setCommentsData((prev: any) => [enrichedComment, ...prev]);

      if (profileUser._id !== profileBasic._id) {
        const notificationParams = {
          senderId: profileBasic._id,
          receiverId: profileUser._id,
          type: "comment_media",
          mediaId: image._id,
        };

        await createNotification(notificationParams, token);
      }

      // setCommentsData((prev) => [newCommentData, ...prev]);
      setNumberOfComments(numberOfComments + 1);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
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
        <div className="block lg:flex gap-[20px]">
          <div className="w-full lg:w-1/2 flex flex-col gap-[15px]">
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
                    {image?.createAt && getTimestamp(image?.createAt)}
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
            <span>{image.caption}</span>
            <div className="flex w-full items-center justify-center">
              <Image
                src={image?.url || "/assets/images/placeholder.jpg"}
                alt="Image"
                width={300}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="">
              <ImageAction
                likes={image?.likes}
                mediaId={image?._id}
                numberOfComments={numberOfComments}
                shares={image?.shares}
                author={profileUser}
                profile={profileBasic}
              />
              <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />

              <div
                className=" my-4 h-80 overflow-y-scroll"
                style={{
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE và Edge
                }}
              >
                {commentsData?.length > 0 ? (
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
                            mediaId={image._id}
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

              <div className="flex w-full gap-[10px]">
                <Input
                  avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
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
  );
};

export default ImageDetailCard;
