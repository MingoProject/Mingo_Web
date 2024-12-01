import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getMyImages } from "@/lib/services/user.service";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import fetchDetailedMedias from "@/hooks/useMedias";
import DetailsImage from "./DetailsImage";

const Images = ({ me, profileUser }: any) => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  useEffect(() => {
    console.log("meImage", me);
  }, [me]);

  useEffect(() => {
    let isMounted = true;
    const getImages = async () => {
      try {
        const data: MediaResponseDTO[] = await getMyImages(profileUser._id);
        const detailsImage = await fetchDetailedMedias(data);
        if (isMounted) {
          setImages(detailsImage);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    getImages();
    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [profileUser._id]);

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
                onClick={() => setSelectedImage(image)}
                width={140}
                height={140}
                src={image?.url}
                alt={`Picture ${index + 1}`}
                className="mb-2 size-36 rounded-sm object-cover"
              />
              {selectedImage && (
                <DetailsImage
                  image={selectedImage}
                  onClose={() => setSelectedImage(null)}
                  profileUser={profileUser}
                  me={me}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Images;
