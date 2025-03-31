import { useSocket } from "@/context/SocketContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Icon } from "@iconify/react/dist/iconify.js";
import SmallVideoContainer from "./SmallVideoContainer";

export const VideoCall = () => {
  const { localStream, peer, ongoingCall, handleHangUp } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Track stream changes
  useEffect(() => {
    if (peer?.stream) {
      setRemoteStream(peer.stream);
    } else {
      setRemoteStream(null);
    }
  }, [peer?.stream]);

  // Initialize stream controls
  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      setIsVidOn(videoTrack?.enabled ?? false);
      setIsMicOn(audioTrack?.enabled ?? false);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVidOn(videoTracks[0].enabled);
      }
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMicOn(audioTracks[0].enabled);
      }
    }
  }, [localStream]);

  const endCall = useCallback(() => {
    if (handleHangUp) {
      handleHangUp({ ongoingCall, isEmitHangUp: true });
    }
  }, [handleHangUp, ongoingCall]);

  const isOnCall = !!(localStream && peer && ongoingCall);

  return (
    <div>
      <div className="absolute w-[900px] h-[900px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-50">
        {remoteStream && (
          <VideoContainer
            stream={remoteStream}
            isLocalStream={false}
            isOnCall={isOnCall}
          />
        )}

        {/* Local video preview */}
        {localStream && (
          <div className="absolute top-56 right-12 w-1/4 h-1/4 ">
            <SmallVideoContainer
              stream={localStream}
              isLocalStream={true}
              isOnCall={isOnCall}
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-4  p-4  z-50">
        <button onClick={toggleMic} className=" rounded-full bg-gray-200 p-2">
          {isMicOn && (
            <Icon
              icon="material-symbols:mic"
              width={28}
              height={28}
              className="text-black"
            />
          )}
          {!isMicOn && (
            <Icon
              icon="material-symbols:mic-off"
              width={28}
              height={28}
              className="text-black"
            />
          )}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg mx-4 text-sm"
          onClick={() => {}}
        >
          End Call
        </button>
        <button
          onClick={toggleCamera}
          className=" rounded-full bg-gray-200 p-2"
        >
          {isVidOn && (
            <Icon
              icon="mynaui:video-solid"
              width={28}
              height={28}
              className="text-black"
            />
          )}
          {!isVidOn && (
            <Icon
              icon="bxs:video-off"
              width={28}
              height={28}
              className="text-black"
            />
          )}
        </button>
      </div>
    </div>
  );
};
