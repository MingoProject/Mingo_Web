import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getMyImages } from "@/lib/services/user.service";
import DetailsImage from "./DetailsImage";
import { getMediaByMediaId } from "@/lib/services/media.service";
import { getCommentByCommentId } from "@/lib/services/comment.service";
// import { getMediaByMediaId } from "@/lib/services/media.service";

const Images = ({ me, profileUser }: any) => {
  const [images, setImages] = useState<any[]>([]);
  const [detailSelectedImage, setDetailSelectedImage] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [commentsData, setCommentsData] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const getImages = async () => {
      try {
        const data = await getMyImages(profileUser._id);

        if (isMounted) {
          setImages(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    getImages();
    return () => {
      isMounted = false;
    };
  }, [profileUser._id]);

  const handleClick = async (image: any) => {
    try {
      const data = await getMediaByMediaId(image._id);
      const detailsComments = await Promise.all(
        data.comments.map(async (comment: any) => {
          return await getCommentByCommentId(comment);
        })
      );
      setDetailSelectedImage(data);
      setCommentsData(detailsComments);

      setOpenModal(true);
    } catch (error) {
      console.error("Error loading image details:", error);
    }
  };

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
                onClick={() => handleClick(image)}
                width={140}
                height={140}
                src={image?.url}
                alt={`Picture ${index + 1}`}
                className="mb-2 size-36 rounded-sm object-cover"
              />
              {openModal && (
                <DetailsImage
                  image={detailSelectedImage}
                  onClose={() => setOpenModal(false)}
                  profileUser={profileUser}
                  me={me}
                  commentsData={commentsData}
                  setCommentsData={setCommentsData}
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
