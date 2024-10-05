import { connectToDatabase } from "../../../lib/mongoose"; // Kiểm tra đường dẫn
import bcrypt from "bcryptjs";
import User from "../../../database/user.model"; // Kiểm tra đường dẫn

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Kết nối tới cơ sở dữ liệu
    await connectToDatabase();

    const {
      username,
      fullname,
      numberphone,
      email,
      birthday,
      gender,
      password,
      confirmPassword, // Đảm bảo rằng confirmPassword có trong dữ liệu yêu cầu
    } = req.body;

    console.log("Received registration data:", req.body);

    // Kiểm tra xem mật khẩu có khớp không
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không khớp!" });
    }

    // Kiểm tra định dạng ngày sinh
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Ngày sinh không hợp lệ!" });
    }

    // Kiểm tra giới tính
    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender)) {
      return res
        .status(400)
        .json({ success: false, message: "Giới tính không hợp lệ!" });
    }

    try {
      // Kiểm tra xem người dùng đã tồn tại hay chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Người dùng đã tồn tại" });
      }

      // Mã hóa mật khẩu trước khi lưu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const newUser = new User({
        username,
        fullname,
        numberphone,
        email,
        birthday: birthDate,
        gender,
        password: hashedPassword,
        avatar: null, // Thay đổi thành null
        background: null, // Thay đổi thành null
        address: null, // Thay đổi thành null
        job: null, // Thay đổi thành null
        hobbies: [], // Mảng rỗng
        bio: null, // Thay đổi thành null
        nickName: null, // Thay đổi thành null
        friends: [], // Mảng rỗng
        bestFriends: [], // Mảng rỗng
        following: [], // Mảng rỗng
        block: [], // Mảng rỗng
        isAdmin: false,
      });

      // Lưu người dùng vào cơ sở dữ liệu
      await newUser.save();

      console.log("User registered successfully:", newUser);
      return res
        .status(201)
        .json({ success: true, message: "Đăng ký người dùng thành công" });
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Phương thức không được phép" });
  }
}
