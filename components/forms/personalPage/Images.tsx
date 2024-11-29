import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getMyImages } from "@/lib/services/user.service";
import { MediaResponseDTO } from "@/dtos/MediaDTO";

const Images = ({ userId }: any) => {
  const [images, setImages] = useState<MediaResponseDTO[]>([]);

  useEffect(() => {
    const getImages = async () => {
      try {
        const data: MediaResponseDTO[] = await getMyImages(userId);
        setImages(data);
        console.log("images", data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    getImages();
  }, [userId]);

  return (
    <div className="flex ">
      <div>
        <div className="mx-[8%]  flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
          Pictures
        </div>
        <div className="mx-[10%] mt-10 flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                width={140}
                height={140}
                src={image?.url}
                alt={`Picture ${index + 1}`}
                className="mb-2 size-36 rounded-sm object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Images;
