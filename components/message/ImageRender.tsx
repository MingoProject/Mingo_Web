import React from "react";
import Image from "next/image";

interface ImageRenderProps {
  images: string[];
}

const ImageRender: React.FC<ImageRenderProps> = ({ images }) => {
  return (
    <div className="flex flex-wrap gap-4 px-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-32 h-32">
          <Image
            src={image}
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
