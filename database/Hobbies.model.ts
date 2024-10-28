import mongoose from "mongoose";

// Model cho Hobbies
const HobbySchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tên sở thích
  icon: { type: String, required: true }, // Biểu tượng (tên biểu tượng từ Iconify)
});

// Xuất mô hình
const Hobby = mongoose.model("Hobby", HobbySchema);
export { HobbySchema, Hobby };
