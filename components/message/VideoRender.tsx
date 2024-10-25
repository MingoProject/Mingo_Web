import React from "react";

// Helper function to extract YouTube video ID from different URL formats
const extractVideoId = (url: string) => {
  const regExp =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null; // Return the video ID or null if not found
};

const VideoRender = ({ videos }: { videos: string[] }) => {
  return (
    <div className="flex flex-wrap gap-4 px-4">
      {videos.map((video, index) => {
        const videoId = extractVideoId(video); // Extract video ID from the URL
        if (!videoId) {
          return <p key={index}>Invalid video URL</p>; // Handle invalid URLs
        }
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        return (
          <div key={index} className="w-32 h-32">
            <iframe
              width="128" // This is the 32px Tailwind equivalent
              height="128"
              src={embedUrl}
              title={`YouTube video player - ${index}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      })}
    </div>
  );
};

export default VideoRender;
