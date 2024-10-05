// Tệp post.model.ts
import mongoose, { Schema, model, Document, models } from "mongoose";

// Định nghĩa interface cho Post
interface IPost extends Document {
  content: string; // Nội dung: Văn bản chính của bài viết
  media?: mongoose.Schema.Types.ObjectId[]; // Các tệp phương tiện liên quan
  url?: string; // Liên kết: URL dẫn đến một trang web khác
  createdAt: Date; // Thời gian đăng: Ngày và giờ bài viết được tạo
  author: mongoose.Schema.Types.ObjectId; // Người đăng: ID của người đã đăng bài viết
  shares: mongoose.Schema.Types.ObjectId[]; // Danh sách người dùng đã chia sẻ
  likes: mongoose.Schema.Types.ObjectId[]; // Danh sách người dùng đã thích
  comments: mongoose.Schema.Types.ObjectId[]; // Danh sách bình luận liên quan
  location?: string; // Địa điểm: Vị trí địa lý liên quan
  tags?: mongoose.Schema.Types.ObjectId[]; // Tag: Các tài khoản hoặc trang được gán
  privacy: {
    type: string; // Cài đặt ai có thể xem bài viết
    allowedUsers?: mongoose.Schema.Types.ObjectId[]; // Danh sách người dùng được phép xem
  };
}

// Định nghĩa PostSchema
const PostSchema = new Schema<IPost>({
  content: { type: String, required: true }, // Nội dung bài viết
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }], // Các tệp phương tiện
  url: { type: String }, // Liên kết
  createdAt: { type: Date, default: Date.now }, // Thời gian đăng
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người đăng
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách người dùng đã chia sẻ
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách người dùng đã thích
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Danh sách bình luận liên quan
  location: { type: String }, // Địa điểm
  // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Các tài khoản hoặc trang được gán
  privacy: {
    type: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    }, // Quyền riêng tư
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách người dùng được phép xem
  },
});

// Tạo model cho Post
const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
