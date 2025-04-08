import React, { useEffect, useRef } from "react";

interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
}

const SmallVideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current
        .play()
        .catch((e) => console.log("Error when playing video:", e));
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  console.log(stream, "small");
  console.log(isLocalStream, "local small");

  return (
    <div className="absolute flex justify-center items-center z-[1000] shadow-lg rounded-lg overflow-hidden ">
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

export default SmallVideoContainer;
