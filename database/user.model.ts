import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    default: uuidv4, // Tạo giá trị userId duy nhất
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  numberphone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null, // Thay đổi thành null
  },
  background: {
    type: String,
    default: null, // Thay đổi thành null
  },
  address: {
    type: String,
    default: null, // Thay đổi thành null
  },
  job: {
    type: String,
    default: null, // Thay đổi thành null
  },
  hobbies: {
    type: [String],
    default: [], // Mảng rỗng
  },
  bio: {
    type: String,
    default: null, // Thay đổi thành null
  },
  nickName: {
    type: String,
    default: null, // Thay đổi thành null
  },
  friends: {
    type: [String],
    default: [], // Mảng rỗng
  },
  bestFriends: {
    type: [String],
    default: [], // Mảng rỗng
  },
  following: {
    type: [String],
    default: [], // Mảng rỗng
  },
  block: {
    type: [String],
    default: [], // Mảng rỗng
  },
  isAdmin: {
    type: Boolean,
    default: false, // Mặc định là false
  },
});

// Kiểm tra và xuất mô hình
export default mongoose.models.User || mongoose.model("User", UserSchema);
