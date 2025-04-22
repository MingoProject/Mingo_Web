"use client";

import DetailsImage from "@/components/forms/personalPage/DetailsImage";
import DetailsVideo from "@/components/forms/personalPage/DetailsVideo";
import { useAuth } from "@/context/AuthContext";
import { NotificationResponseDTO } from "@/dtos/NotificationDTO";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { getCommentByCommentId } from "@/lib/services/comment.service";
import { getMediaByMediaId } from "@/lib/services/media.service";
import { getPostByPostId } from "@/lib/services/post.service";
import { getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RenderContentNotification from "../../shared/notification/RenderContentNotification";
import FriendRequestAction from "@/components/shared/friend/FriendRequestAction";
import BffRequestAction from "@/components/shared/friend/BffRequestAction";
import PostDetailCard from "../post/PostDetailCard";

interface NotificationCardProps {
  notification: NotificationResponseDTO;
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationResponseDTO[]>
  >;
}

const NotificationCard = ({
  notification,
  setNotifications,
}: NotificationCardProps) => {
  const [post, setPost] = useState<any>();
  const [image, setImage] = useState<any>();
  const [video, setVideo] = useState<any>();
  const [openDetailPost, setOpenDetailPost] = useState(false);
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [openDetailVideo, setOpenDetailVideo] = useState(false);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const { profile } = useAuth();

  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };
  const fetchComments = async (commentIds: string[]) => {
    return await Promise.all(commentIds.map(getCommentByCommentId));
  };

  const fetchAndHandleMedia = async (mediaId: string) => {
    const data = await getMediaByMediaId(mediaId);
    const comments = await fetchComments(data.comments);
    const userId = localStorage.getItem("userId");
    setIsLiked(userId ? data.likes.includes(userId) : false);

    if (data.type === "image") {
      setImage(data);
      setOpenDetailImage(true);
    } else {
      setVideo(data);
      setOpenDetailVideo(true);
    }

    setCommentsData(comments);
    setNumberOfLikes(data.likes.length);
    setNumberOfComments(data.comments.length);
  };

  const fetchAndHandlePost = async (postId: string) => {
    const data = await getPostByPostId(postId);
    const comments = await fetchComments(data.comments);
    const userId = localStorage.getItem("userId");
    setIsLiked(userId ? data.likes.includes(userId) : false);
    setPost(data);
    setCommentsData(comments);
    setNumberOfLikes(data.likes.length);
    setNumberOfComments(data.comments.length);
    setOpenDetailPost(true);
  };

  const handleClick = async (notification: any) => {
    try {
      switch (notification.type) {
        case "like":
        case "comment":
        case "tags":
          if (notification.postId) {
            await fetchAndHandlePost(notification.postId);
          }
          break;

        case "like_media":
        case "comment_media":
          if (notification.mediaId) {
            await fetchAndHandleMedia(notification.mediaId);
          }
          break;

        case "like_comment":
        case "reply_comment":
          if (notification.postId) {
            await fetchAndHandlePost(notification.postId);
          } else if (notification.mediaId) {
            await fetchAndHandleMedia(notification.mediaId);
          }
          break;

        default:
          console.log("Notification type not handled:", notification.type);
          break;
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  return (
    <div className="flex p-2 gap-[10px]">
      <Link href={`/profile/${notification.senderId._id}`}>
        <Image
          src={
            notification.senderId.avatar
              ? notification.senderId.avatar
              : "/assets/images/capy.jpg"
          }
          alt="Avatar"
          width={50}
          height={50}
          className="size-[50px] rounded-full object-cover"
        />
      </Link>

      <div
        className="flex flex-col gap-2 cursor-pointer "
        onClick={() => handleClick(notification)}
      >
        <p className="text-dark100_light100 cursor-pointer text-[16px] font-normal">
          {RenderContentNotification(notification)}
        </p>

        {notification.type === "friend_request" && (
          <div>
            <FriendRequestAction
              senderId={notification.senderId._id}
              receiverId={notification.receiverId}
              setNotifications={setNotifications}
            />
          </div>
        )}

        {notification.type === "bff_request" && (
          <div>
            <BffRequestAction
              senderId={notification.senderId._id}
              receiverId={notification.receiverId}
              setNotifications={setNotifications}
            />
          </div>
        )}

        <p className="text-[11px] text-dark100_light100 font-normal">
          {getTimestamp(notification.createAt)}
        </p>
      </div>

      {openDetailPost && (
        <PostDetailCard
          post={post}
          onClose={() => setOpenDetailPost(false)}
          profileBasic={profileBasic}
          numberOfLikes={numberOfLikes}
          setNumberOfLikes={setNumberOfLikes}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          setNumberOfComments={setNumberOfComments}
          numberOfComments={numberOfComments}
          commentsData={commentsData}
          setCommentsData={setCommentsData}
        />
      )}

      {openDetailImage && (
        <DetailsImage
          image={image}
          onClose={() => setOpenDetailImage(false)}
          profileUser={image.createBy}
          me={profile}
          commentsData={commentsData}
          setCommentsData={setCommentsData}
        />
      )}

      {openDetailVideo && (
        <DetailsVideo
          video={video}
          onClose={() => setOpenDetailVideo(false)}
          profileUser={video.createBy}
          me={profile}
          commentsData={commentsData}
          setCommentsData={setCommentsData}
        />
      )}
    </div>
  );
};

export default NotificationCard;
