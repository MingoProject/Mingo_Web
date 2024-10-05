import mongoose, { Schema, model, Document, models } from "mongoose";

// Định nghĩa interface cho Comment
interface IComment extends Document {
  userId: mongoose.Schema.Types.ObjectId; // ID của người bình luận
  content: string; // Nội dung bình luận
  createdAt: Date; // Thời gian bình luận
  postId: mongoose.Schema.Types.ObjectId; // ID của bài viết
  parentId?: mongoose.Schema.Types.ObjectId; // ID của bình luận cha (nếu là phản hồi)
  replies?: IComment[]; // Danh sách phản hồi
}

// Định nghĩa CommentSchema
const CommentSchema = new Schema<IComment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // ID của bình luận cha (nếu có)
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Danh sách phản hồi
});

// Tạo model cho Comment
const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
