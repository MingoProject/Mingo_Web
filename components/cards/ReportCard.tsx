import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { PostCreateDTO } from "@/dtos/PostDTO";
import { useParams } from "next/navigation";
import {
  createCommentReport,
  createReport,
} from "@/lib/services/report.service";
import { CommentReportCreateDTO, ReportCreateDTO } from "@/dtos/reportDTO";
// import { SchemaTypes } from "mongoose";
import { Schema, Types } from "mongoose";

// Danh sách nội dung chia theo mục
const categorizedReportOptions = [
  {
    category: "HÀNH VI PHẠM TỘI VÀ BẠO LỰC",
    options: [
      "Hành vi phạm tội và bạo lực",
      "Cấu kết gây hại và cổ xúy tội ác",
      "Cá nhân và tổ chức nguy hiểm",
    ],
  },
  {
    category: "SỰ AN TOÀN",
    options: [
      "Hành vi gian lận, lừa đảo và lừa gạt",
      "Hàng hóa và dịch vụ bị hạn chế",
      "Bạo lực và khích nộ",
    ],
  },
  {
    category: "NỘI DUNG PHẢN CẢM",
    options: [
      "Nội dung phản cảm",
      "Hoạt động tình dục và ảnh khỏa thân người lớn",
      "Hành vi gạ gẫm tình dục người lớn và ngôn ngữ khiêu dâm",
    ],
  },
  {
    category: "TÍNH TOÀN VẸN VÀ TÍNH XÁC THỰC",
    options: [
      "Tính toàn vẹn của tài khoản",
      "Cam đoan về danh tính thực",
      "An ninh mạng",
    ],
  },
  {
    category: "TÔN TRỌNG QUYỀN SỞ HỮU TRÍ TUỆ",
    options: [
      "Vi phạm quyền sở hữu trí tuệ của bên thứ ba",
      "Sử dụng giấy phép và quyền sở hữu trí tuệ của Meta",
    ],
  },
  {
    category: "YÊU CẦU VÀ QUYẾT ĐỊNH LIÊN QUAN ĐẾN NỘI DUNG",
    options: ["Yêu cầu của người dùng", "Thông tin sai lệch", "Spam"],
  },
];

const ReportCard = ({
  onClose,
  type,
  entityId,
  reportedId,
  postId,
}: {
  onClose: () => void;
  type: string;
  entityId: string;
  reportedId: string;
  postId?: string;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    console.log(token, "tokennn");
    const userId = localStorage.getItem("userId");
    if (!token) {
      setError("Authentication is required");
      setLoading(false);
      return;
    }

    try {
      const reportPayload: ReportCreateDTO = {
        title: "Báo cáo vi phạm",
        content: selectedOption,
        reportedId: reportedId || "", // Sử dụng ObjectId đã import
        reportedEntityId: entityId.toString(),
        entityType: type,
      };

      const reportCommentPayload: CommentReportCreateDTO = {
        title: "Báo cáo vi phạm",
        content: selectedOption,
        reportedId: reportedId || "", // Sử dụng ObjectId đã import
        reportedEntityId: entityId.toString(),
        entityType: type,
        parentReportEntityId: postId,
      };

      if (type === "comment") {
        const res = await createCommentReport(reportCommentPayload, token);
      } else {
        const res = await createReport(reportPayload, token);
        console.log(res, "res rp");
      }

      alert("Repost created successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating repost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="no-scrollbar background-light700_dark300 text-dark100_light500 relative z-10 h-[70vh] w-[50vw] overflow-y-auto rounded-md shadow-lg md:w-[30vw]">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none p-2 px-4 text-center text-sm md:text-base">
              Nội dung
            </span>
            <FontAwesomeIcon
              onClick={onClose}
              icon={faXmark}
              className="mb-2 cursor-pointer"
            />
          </div>

          {/* Danh sách nội dung */}
          <div className="px-4 py-2">
            {categorizedReportOptions.map((category, catIndex) => (
              <div key={catIndex} className="mb-4">
                {/* Tiêu đề mục lớn */}
                <h3 className="text-sm font-bold text-primary-100 md:text-base">
                  {category.category}
                </h3>

                {/* Các tùy chọn bên trong */}
                {category.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reportOption"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)} // Lưu giá trị đã chọn vào state
                      className="cursor-pointer"
                    />
                    <span className="text-sm md:text-base">{option}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          {/* Nút xác nhận */}
          <div className="text-dark100_light500 flex items-center justify-between gap-4 px-8 py-4">
            <Button
              onClick={onClose}
              className="h-[35px] w-32 bg-white text-xs shadow-md dark:border dark:bg-transparent md:text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit} // Truyền giá trị đã chọn
              disabled={!selectedOption} // Vô hiệu hóa nếu chưa chọn mục
              className="h-[35px] w-32 bg-primary-100 text-xs text-white shadow-md md:text-sm"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
