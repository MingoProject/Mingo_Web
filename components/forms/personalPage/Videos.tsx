import React, { useEffect, useState } from "react";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import { getMyVideos } from "@/lib/services/user.service";
import DetailsVideo from "./DetailsVideo";

const Videos = ({ me, profile }: any) => {
  const [videos, setVideos] = useState<MediaResponseDTO[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const data: MediaResponseDTO[] = await getMyVideos(profile._id);
        setVideos(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    getVideos();
  }, [profile._id]);

  return (
    <div className="flex  ">
      <div>
        <div className="mx-[8%]  flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
          Videos
        </div>
        <div className="mx-[10%] mt-10 flex flex-wrap gap-4">
          {videos.map((video, index) => (
            <div key={index} className="flex flex-col items-center">
              <video
                width={150}
                height={150}
                controls
                onClick={() => setSelectedVideo(video)}
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {selectedVideo && (
                <DetailsVideo
                  video={selectedVideo}
                  onClose={() => setSelectedVideo(null)}
                  profile={profile}
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

export default Videos;
