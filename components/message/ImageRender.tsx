import React from "react";
import Image from "next/image";
import { FileContent } from "@/dtos/MessageDTO";

interface ImageRenderProps {
  images: FileContent[];
}

const ImageRender: React.FC<ImageRenderProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-32 h-32">
          <Image
            src={image.url}
            alt={`image-${index}`}
            layout="fill" // Tự động điều chỉnh chiều cao và chiều rộng
            objectFit="cover" // Đảm bảo hình ảnh không bị méo
            className="rounded" // Thêm bo góc nếu cần
          />
        </div>
      ))}
    </div>
  );
};

export default ImageRender;
