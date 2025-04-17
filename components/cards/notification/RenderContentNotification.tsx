import { NotificationResponseDTO } from "@/dtos/NotificationDTO";

const RenderContentNotification = (notification: NotificationResponseDTO) => {
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

export default RenderContentNotification;
