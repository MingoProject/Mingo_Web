import { connectToDatabase } from "../../lib/mongoose"; // Đường dẫn tới hàm kết nối DB
import Post from "../../database/post.model"; // Mô hình Post
import Media from "../../database/media.model"; // Mô hình Media

const handler = async (req, res) => {
  await connectToDatabase(); // Kết nối tới database

  if (req.method === "POST") {
    const { content, mediaFiles, location, privacy, author } = req.body; // Lấy các trường cần thiết từ request body

    // Kiểm tra trường author
    console.log("Received post data:", req.body); // Log dữ liệu nhận được

    // Kiểm tra trường author
    if (!author) {
      return res.status(400).json({ message: "Author is required" });
    }

    // Kiểm tra các trường khác (nếu cần)
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    try {
      // Bước 1: Tạo bài đăng mới
      const newPost = new Post({
        content,
        location,
        privacy,
        createdAt: new Date(),
        author, // Sử dụng ID tác giả từ request body
      });
      await newPost.save(); // Lưu bài viết để lấy ID

      // Bước 2: Lưu các tệp phương tiện vào cơ sở dữ liệu
      const mediaIds = await Promise.all(
        mediaFiles.map(async (file) => {
          const media = new Media({
            url: file.url,
            type: file.type,
            caption: file.caption,
            postId: newPost._id, // Liên kết media với bài viết vừa tạo
            author, // Sử dụng ID tác giả từ request body
          });
          await media.save();
          return media._id; // Trả về ID của media
        })
      );

      // Cập nhật bài đăng với danh sách media đã lưu
      newPost.media = mediaIds;
      await newPost.save(); // Lưu bài viết với danh sách media

      return res.status(201).json(newPost); // Trả về bài viết vừa tạo
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ message: "Error creating post" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
