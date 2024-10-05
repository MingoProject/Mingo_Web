import { connectToDatabase } from "../../../lib/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/user.model";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDatabase();

    const { username, password } = req.body;

    try {
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Người dùng không tồn tại" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu không hợp lệ" });
      }

      // Tạo token với thời gian hiệu lực 3 giờ
      const token = jwt.sign({ id: user.userId }, JWT_SECRET, {
        expiresIn: "3h",
      });

      const { password: _, ...userData } = user.toObject(); // Giấu mật khẩu
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        token,
        data: userData,
      });
    } catch (error) {
      console.error("Lỗi trong quá trình đăng nhập:", error);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Phương thức không được phép" });
  }
}
