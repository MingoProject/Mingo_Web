import mongoose, { Schema, model, Document, models } from "mongoose";

// Định nghĩa interface cho Media
interface IMedia extends Document {
  url: string; // URL của tệp phương tiện
  type: "image" | "video"; // Loại phương tiện: hình ảnh hoặc video
  caption?: string; // Chú thích cho phương tiện
  createdAt: Date; // Thời gian tạo
  author: mongoose.Schema.Types.ObjectId; // ID của người đăng
  postId: mongoose.Schema.Types.ObjectId; // ID của bài viết liên quan
  likes: mongoose.Schema.Types.ObjectId[]; // Danh sách người dùng đã thích
  comments: mongoose.Schema.Types.ObjectId[]; // Danh sách bình luận liên quan
  shares: mongoose.Schema.Types.ObjectId[]; // Danh sách người dùng đã chia sẻ
}

// Định nghĩa MediaSchema
const MediaSchema = new Schema<IMedia>({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  caption: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Liên kết với model User
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Tạo model cho Media
const Media = models.Media || model<IMedia>("Media", MediaSchema);

export default Media;
