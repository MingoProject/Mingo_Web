import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createCommentMedia } from "@/lib/services/comment.service";
import CommentCard from "@/components/cards/CommentCard";
import fetchDetailedComments from "@/hooks/useComments";
import ImageAction from "./ImageAction";
import { createNotification } from "@/lib/services/notification.service";
import { getTimestamp } from "@/lib/utils";

// import { getTimestamp } from "@/lib/utils";

const DetailsVideo = ({ video, onClose, profileUser, me }: any) => {
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCommentsData = async () => {
      const detailedComments = await fetchDetailedComments(video.comments);
      if (isMounted) {
        setCommentsData(detailedComments);
      }
    };

    if (video.comments.length > 0) {
      fetchCommentsData();
    }
    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [video.comments]);

  useEffect(() => {
    console.log(commentsData);
  });

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
      const enrichedComment = {
        ...newCommentData,
        userId: {
          _id: me?._id,
          avatar: me?.avatar || "/assets/images/capy.jpg",
          firstName: me?.firstName || "Anonymous",
          lastName: me?.lastName || "Anonymous",
          createAt: "Now",
        },
      };

      // Cập nhật state commentsData
      setCommentsData((prev) => [enrichedComment, ...prev]);

      if (profileUser._id !== me._id) {
        const notificationParams = {
          senderId: me._id,
          receiverId: profileUser._id,
          type: "comment_media",
          mediaId: video._id,
        };

        await createNotification(notificationParams, token);
      }

      // setCommentsData((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="background-light700_dark300 text-dark100_light500 z-50 max-h-screen w-[90%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg md:w-4/5 lg:w-[70%]">
        <div className="block lg:flex">
          <div className="w-3/5">
            <div className="ml-4 mt-3 flex items-center">
              <div className="flex items-center">
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
                  <p className="text-dark100_light500 ml-3 text-base">
                    {profileUser?.firstName || ""}
                  </p>
                  <span className="text-dark100_light500 ml-3 text-sm">
                    {getTimestamp(video.createAt)}
                  </span>
                </div>
              </div>
              <div className="ml-auto pb-2 pr-4">
                <Icon
                  icon="tabler:dots"
                  className="text-dark100_light500 cursor-pointer"
                />
              </div>
            </div>
            <div className="mt-8 flex w-full items-center justify-center">
              <div className=" mx-auto flex h-64 w-full items-center justify-center">
                <video width={400} height={400} controls>
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <div className="mx-10 my-5">
              <ImageAction
                likes={video.likes}
                mediaId={video._id}
                comments={video.comments}
                shares={video.shares}
                author={profileUser}
                profile={me}
              />
              <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />

              <div className="my-4 h-80 overflow-y-scroll">
                {commentsData.length > 0 ? (
                  commentsData.map((comment) => (
                    <div
                      key={comment._id}
                      className="group mb-3 flex items-start"
                    >
                      <CommentCard
                        comment={comment}
                        setCommentsData={setCommentsData}
                        mediaId={video._id}
                        profile={me}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-dark100_light500">No comments yet.</p>
                )}
              </div>

              <div className="flex">
                <div className="w-16 overflow-hidden rounded-full">
                  <Image
                    src={me?.avatar ? me.avatar : "/assets/images/capy.jpg"}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="background-light800_dark400 text-dark100_light500 ml-3 h-[40px] w-full rounded-full pl-3 text-base"
                  value={newComment}
                  onChange={handleInputChange}
                />
                <button
                  onClick={handleAddComment}
                  className="ml-1 rounded-full bg-primary-100 p-2 px-5 text-white"
                >
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-end space-x-2">
          <Button className="bg-gray-300 text-black" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailsVideo;
