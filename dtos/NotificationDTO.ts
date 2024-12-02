export interface CreateNotificationDTO {
  senderId: string;
  receiverId: string;
  type: string;
  postId?: string;
  commentId?: string;
  messageId?: string;
}
