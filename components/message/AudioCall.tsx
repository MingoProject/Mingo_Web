import { useSocket } from "@/context/SocketContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Icon } from "@iconify/react/dist/iconify.js";
import SmallVideoContainer from "./SmallVideoContainer";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export const AudioCall = () => {
  const { localStream, peer, ongoingCall, handleHangUp } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const isVideoCall = ongoingCall?.isVideoCall;
  const { profile } = useAuth();
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

      // Tắt camera nếu không phải video call
      if (!isVideoCall && videoTrack) {
        videoTrack.enabled = false;
      }

      setIsVidOn(videoTrack?.enabled ?? false);
      setIsMicOn(audioTrack?.enabled ?? false);
    }
  }, [localStream, isVideoCall]);

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

  const isOnCall = !!(localStream && peer && ongoingCall);
  if (!profile || !ongoingCall?.participants) return null;
  const otherUser =
    ongoingCall?.participants?.caller.profile._id === profile._id
      ? ongoingCall?.participants?.receiver
      : ongoingCall?.participants?.caller;
  if (isVideoCall) {
    return null; // <-- Đúng: Chỉ render AudioCall khi KHÔNG phải video call
  }
  return (
    <div>
      <div className="absolute w-[900px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-start pt-20 z-50 bg-slate-200 rounded-md">
        <div className="flex flex-col gap-8 ">
          <Image
            src={otherUser?.profile?.avatar || "/assets/images/capy.jpg"}
            alt="Avatar"
            width={100}
            height={100}
            className="size-28 rounded-full object-cover"
          />
          <div className="call-info text-center ">
            <h3 className="text-xl font-semibold">
              {ongoingCall?.participants?.receiver?.profile.firstName ??
                "Unknown User"}
            </h3>
            <p className="text-gray-500 mt-8">Audio call in progress</p>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-4 p-4 z-50">
        <button
          onClick={toggleMic}
          className="rounded-full bg-gray-700 p-3 hover:bg-gray-600"
        >
          {isMicOn ? (
            <Icon
              icon="material-symbols:mic"
              width={24}
              height={24}
              className="text-white"
            />
          ) : (
            <Icon
              icon="material-symbols:mic-off"
              width={24}
              height={24}
              className="text-red-400"
            />
          )}
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg mx-4 text-sm hover:bg-red-700"
          onClick={() =>
            handleHangUp({
              ongoingCall: ongoingCall ? ongoingCall : undefined,
              isEmitHangUp: true,
            })
          }
        >
          End Call
        </button>

        <button
          onClick={toggleCamera}
          className="rounded-full bg-gray-700 p-3 hover:bg-gray-600"
        >
          {isVidOn ? (
            <Icon
              icon="mynaui:video-solid"
              width={24}
              height={24}
              className="text-white"
            />
          ) : (
            <Icon
              icon="bxs:video-off"
              width={24}
              height={24}
              className="text-red-400"
            />
          )}
        </button>
      </div>
    </div>
  );
};
