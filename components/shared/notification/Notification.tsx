import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import {
  createNotification,
  deleteNotification,
  getNotifications,
} from "@/lib/services/notification.service";
import {
  acceptAddBff,
  acceptAddFriend,
  unfollowOrRefuseFriendRequest,
  unrequestBffOrRefuseBffRequest,
} from "@/lib/services/friend.service";
import { getPostByPostId } from "@/lib/services/post.service";
import DetailPost from "@/components/forms/post/DetailPost";
import { useAuth } from "@/context/AuthContext";
import { getMediaByMediaId } from "@/lib/services/media.service";
import DetailsImage from "@/components/forms/personalPage/DetailsImage";
import DetailsVideo from "@/components/forms/personalPage/DetailsVideo";
import Link from "next/link";
import { getCommentByCommentId } from "@/lib/services/comment.service";

const getNotificationContent = (notification: any) => {
  switch (notification.type) {
    case "friend_request":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} sent you a friend request.`;
    case "bff_request":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} sent you a BFF request.`;
    case "friend_accept":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} accepted your friend request.`;
    case "bff_accept":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} accepted your BFF request.`;
    case "comment":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} commented on your post.`;
    case "comment_media":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} commented on your media.`;
    case "like":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} liked your post.`;
    case "like_comment":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} liked your comment.`;
    case "like_media":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} liked your media.`;
    case "reply_comment":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} replied to your comment.`;
    case "message":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} sent you a message.`;
    case "tags":
      return `${notification.senderId.firstName} ${notification.senderId.lastName} tagged you in a post.`;
    default:
      return "You have a new notification.";
  }
};

const Notification = ({ closeDrawer }: any) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [post, setPost] = useState<any>();
  const [image, setImage] = useState<any>();
  const [video, setVideo] = useState<any>();
  const [openDetailPost, setOpenDetailPost] = useState(false);
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [openDetailVideo, setOpenDetailVideo] = useState(false);
  const { profile } = useAuth();
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchNotification = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await getNotifications(token);
          console.log("res", res);
          if (isMounted) {
            const sortedNotifications = res
              .filter(
                (notification: any) =>
                  ![
                    "report_post",
                    "report_user",
                    "report_comment",
                    "report_message",
                  ].includes(notification.type)
              )
              .sort(
                (a: any, b: any) =>
                  new Date(b.createAt).getTime() -
                  new Date(a.createAt).getTime()
              );
            setNotifications(sortedNotifications);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotification();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefuseBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }
      await unrequestBffOrRefuseBffRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleRefuseFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await unfollowOrRefuseFriendRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await acceptAddFriend(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "friend_accept",
        },
        token
      );
      await deleteNotification(notificationId, token);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }
      await acceptAddBff(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "bff_accept",
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleClick = async (notification: any) => {
    switch (notification.type) {
      case "like":
        try {
          const data = await getPostByPostId(notification.postId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          setPost(data);
          setCommentsData(detailsComments);
          setLikesCount(data.likes.length);
          setNumberOfComments(data.comments.length);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "like_comment":
        try {
          if (notification.postId) {
            try {
              const data = await getPostByPostId(notification.postId);
              const detailsComments = await Promise.all(
                data.comments.map(async (comment: any) => {
                  return await getCommentByCommentId(comment);
                })
              );
              const userId = localStorage.getItem("userId");
              if (userId) {
                try {
                  const isUserLiked = data.likes.some(
                    (like: any) => like === userId
                  );
                  setIsLiked(isUserLiked);
                } catch (error) {
                  console.error("Invalid token:", error);
                }
              }
              setPost(data);
              setCommentsData(detailsComments);
              setLikesCount(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailPost(true);
            } catch (error) {
              console.error("Error fetching post data:", error);
            }
          } else {
            const data = await getMediaByMediaId(notification.mediaId);
            const detailsComments = await Promise.all(
              data.comments.map(async (comment: any) => {
                return await getCommentByCommentId(comment);
              })
            );
            const userId = localStorage.getItem("userId");
            if (userId) {
              try {
                const isUserLiked = data.likes.some(
                  (like: any) => like === userId
                );
                setIsLiked(isUserLiked);
              } catch (error) {
                console.error("Invalid token:", error);
              }
            }

            if (data.type === "image") {
              setImage(data);
              setCommentsData(detailsComments);
              setLikesCount(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailImage(true);
            } else {
              setVideo(data);
              setCommentsData(detailsComments);
              setLikesCount(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailVideo(true);
            }
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "like_media":
        try {
          const data = await getMediaByMediaId(notification.mediaId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          if (data.type === "image") {
            setImage(data);
            setCommentsData(detailsComments);
            setLikesCount(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailImage(true);
          } else {
            setVideo(data);
            setCommentsData(detailsComments);
            setLikesCount(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailVideo(true);
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "comment":
        try {
          const data = await getPostByPostId(notification.postId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          setPost(data);
          setCommentsData(detailsComments);
          setLikesCount(data.likes.length);
          setNumberOfComments(data.comments.length);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "comment_media":
        try {
          const data = await getMediaByMediaId(notification.mediaId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          if (data.type === "image") {
            setImage(data);
            setCommentsData(detailsComments);
            setLikesCount(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailImage(true);
          } else {
            setVideo(data);
            setCommentsData(detailsComments);
            setLikesCount(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailVideo(true);
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "reply_comment":
        try {
          if (notification.postId) {
            try {
              const data = await getPostByPostId(notification.postId);
              const detailsComments = await Promise.all(
                data.comments.map(async (comment: any) => {
                  return await getCommentByCommentId(comment);
                })
              );
              const userId = localStorage.getItem("userId");
              if (userId) {
                try {
                  const isUserLiked = data.likes.some(
                    (like: any) => like === userId
                  );
                  setIsLiked(isUserLiked);
                } catch (error) {
                  console.error("Invalid token:", error);
                }
              }
              setPost(data);
              setCommentsData(detailsComments);
              setLikesCount(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailPost(true);
            } catch (error) {
              console.error("Error fetching post data:", error);
            }
          } else {
            const data = await getMediaByMediaId(notification.mediaId);
            const detailsComments = await Promise.all(
              data.comments.map(async (comment: any) => {
                return await getCommentByCommentId(comment);
              })
            );
            const userId = localStorage.getItem("userId");
            if (userId) {
              try {
                const isUserLiked = data.likes.some(
                  (like: any) => like === userId
                );
                setIsLiked(isUserLiked);
              } catch (error) {
                console.error("Invalid token:", error);
              }
            }

            if (data.type === "image") {
              setImage(data);
              setCommentsData(detailsComments);
              setLikesCount(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailImage(true);
            } else {
              setVideo(data);
              setCommentsData(detailsComments);
              setLikesCount(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailVideo(true);
            }
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "tags":
        try {
          const data = await getPostByPostId(notification.postId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          setPost(data);
          setCommentsData(detailsComments);
          setLikesCount(data.likes.length);
          setNumberOfComments(data.comments.length);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      default:
        console.log("Notification type not handled");
        break;
    }
  };

  return (
    <div>
      <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
        Notifications
      </div>
      <div className="mt-4  flex text-primary-100">Recently</div>
      <div className="mt-5 flex h-[500px]  flex-col space-y-4 overflow-auto custom-scrollbar">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="flex items-center justify-between p-2 "
          >
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
                className="size-16 rounded-full object-cover"
              />
            </Link>

            <div
              className="ml-2 flex-1 cursor-pointer pr-4"
              onClick={() => handleClick(notification)}
            >
              <p className="text-dark100_light500 cursor-pointer font-light">
                {getNotificationContent(notification)}
              </p>
              {notification.type === "friend_request" && (
                <div>
                  <button
                    onClick={() =>
                      handleAcceptFriend(
                        notification.senderId._id,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className=" rounded-lg bg-primary-100 px-4 text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleRefuseFriend(
                        notification.senderId._id,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className="background-light800_dark400 text-dark100_light500 ml-3 rounded-lg px-4 "
                  >
                    Refuse
                  </button>
                </div>
              )}
              {notification.type === "bff_request" && (
                <div className="my-1">
                  <button
                    onClick={() =>
                      handleAcceptBff(
                        notification.senderId._id,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className=" rounded-lg bg-primary-100 px-4 text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleRefuseBff(
                        notification.senderId._id,
                        notification.receiverId,
                        notification._id
                      )
                    }
                    className="background-light800_dark400 text-dark100_light500 ml-3 rounded-lg px-4 "
                  >
                    Refuse
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-500">
                {getTimestamp(notification.createAt)}
              </p>
            </div>
            {openDetailPost && (
              <DetailPost
                postId={post?._id}
                author={post?.author}
                content={post?.content}
                media={post?.media}
                createdAt={post?.createdAt}
                likes={post?.likes}
                comments={post?.comments}
                shares={post?.shares}
                privacy={post?.privacy}
                tags={post?.tags}
                onClose={() => setOpenDetailPost(false)}
                profile={profile}
                likesCount={likesCount}
                setLikesCount={setLikesCount}
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
        ))}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px; /* Độ rộng của thanh cuộn */
          height: 6px; /* Độ cao của thanh cuộn ngang */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 100, 100, 0.8); /* Màu của thanh cuộn */
          border-radius: 10px; /* Bo góc */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(80, 80, 80, 1); /* Màu khi hover */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(230, 230, 230, 0.5); /* Màu nền track */
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Notification;
