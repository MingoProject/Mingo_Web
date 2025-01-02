import React, { useEffect, useState } from "react";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import { getMyVideos } from "@/lib/services/user.service";
import DetailsVideo from "./DetailsVideo";
import { getMediaByMediaId } from "@/lib/services/media.service";
import { getCommentByCommentId } from "@/lib/services/comment.service";

const Videos = ({ me, profileUser }: any) => {
  const [videos, setVideos] = useState<MediaResponseDTO[]>([]);
  const [detailSelectedVideo, setDetailSelectedVideo] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [commentsData, setCommentsData] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const getVideos = async () => {
      try {
        const data = await getMyVideos(profileUser._id);

        if (isMounted) {
          setVideos(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    getVideos();
    return () => {
      isMounted = false;
    };
  }, [profileUser._id]);

  const handleClick = async (video: any) => {
    try {
      const data = await getMediaByMediaId(video._id);
      const detailsComments = await Promise.all(
        data.comments.map(async (comment: any) => {
          return await getCommentByCommentId(comment);
        })
      );
      setDetailSelectedVideo(data);
      setCommentsData(detailsComments);
      setOpenModal(true);
    } catch (error) {
      console.error("Error loading video details:", error);
    }
  };

  return (
    <div className="flex  ">
      <div>
        <div className="mx-[8%]  flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
          Videos
        </div>
        <div className="mx-[20%] mt-10 flex flex-wrap gap-4">
          {videos.map((video, index) => (
            <div key={index} className="flex flex-col items-center w-[150px]">
              <div className="size-40" onClick={() => handleClick(video)}>
                <video
                  width={150}
                  height={150}
                  controls
                  className="size-[200px]"
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
          {openModal && (
            <DetailsVideo
              video={detailSelectedVideo}
              onClose={() => setOpenModal(false)}
              profileUser={profileUser}
              me={me}
              commentsData={commentsData}
              setCommentsData={setCommentsData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Videos;
