import React from "react";
import { FileContent } from "@/dtos/MessageDTO"; // Đường dẫn import interface của bạn

interface VideoRenderProps {
  videos: FileContent[]; // Sử dụng interface FileContent
}

const VideoRender: React.FC<VideoRenderProps> = ({ videos }) => {
  return (
    <div className="flex flex-wrap gap-4 px-4">
      {videos.map((video) => (
        <div key={video.fileName} className="relative w-48 h-32">
          <video
            controls
            className="w-full h-full object-cover rounded"
            src={`${video.url}?q_auto,f_auto`} // Thêm tối ưu hóa URL Cloudinary
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  );
};

export default VideoRender;
