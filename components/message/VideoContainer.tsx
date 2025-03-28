import React, { useEffect, useRef } from "react";
interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
}
const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  console.log(stream, "large");
  console.log(isLocalStream, "local large");
  return (
    <div className="absolute w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-50">
      <video
        className="rounded border"
        autoPlay
        playsInline
        muted={isLocalStream}
        ref={videoRef}
      />
    </div>
  );
};

export default VideoContainer;
