// pages/api/upload.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import Media from "../../database/media.model"; // Mô hình Media
import { connectToDatabase } from "../../lib/mongoose"; // Đường dẫn tới hàm kết nối DB

const handler = async (req, res) => {
  await connectToDatabase(); // Kết nối tới database

  if (req.method === "POST") {
    const form = formidable({ keepExtensions: true }); // Khởi tạo formidable

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(400).json({ message: "Error parsing form data" });
      }

      try {
        const mediaIds = [];
        const uploadsDir = path.join(process.cwd(), "public", "uploads");

        // Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir); // Tạo thư mục nếu không tồn tại
        }

        // Xử lý file hình ảnh/video
        for (const key in files) {
          const file = files[key];

          const uploadPath = path.join(uploadsDir, file.newFilename); // Đảm bảo tạo đường dẫn đúng

          // Di chuyển file đến thư mục uploads
          fs.renameSync(file.filepath, uploadPath);

          // Tạo đối tượng media mới
          const newMedia = new Media({
            url: `/uploads/${file.newFilename}`, // Đường dẫn lưu trữ
            type: file.mimetype,
            createdAt: new Date(),
          });

          await newMedia.save(); // Lưu vào DB
          mediaIds.push(newMedia._id); // Thêm ID vào danh sách
        }

        return res.status(200).json({ mediaIds }); // Trả về danh sách ID media
      } catch (error) {
        console.error("Error uploading media:", error);
        return res.status(500).json({ message: "Error uploading media" });
      }
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

// Cấu hình formidable để không tạo ra một endpoint ngoài API
export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser của Next.js
  },
};

export default handler;
