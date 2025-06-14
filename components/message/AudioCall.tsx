import { useSocket } from "@/context/SocketContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Icon } from "@iconify/react/dist/iconify.js";
import SmallVideoContainer from "./SmallVideoContainer";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { sendMessage } from "@/lib/services/message.service";
import { formatDuration } from "date-fns";
import { useParams } from "next/navigation";

export const AudioCall = () => {
  const { localStream, peer, ongoingCall, handleHangUp } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const isVideoCall = ongoingCall?.isVideoCall;
  const { profile } = useAuth();

  const params = useParams();
  const boxId = params.id?.toString();
  const [callDuration, setCallDuration] = useState(0);
  const [callStarted, setCallStarted] = useState(false);

  const handleSendTextMessage = async () => {
    // Tạo đối tượng SegmentMessageDTO
    const messageData = {
      boxId: boxId,
      content: `//Cuoc goi ket thuc; time: ${formatDuration(callDuration)}`, // content is now a string
    };

    if (!messageData.boxId) {
      console.error("Missing required fields in message data");
      return;
    }

    const formData = new FormData();
    formData.append("boxId", messageData.boxId.toString());
    formData.append("content", JSON.stringify(messageData.content)); // Directly append the string

    // Gửi API
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;

      const response = await sendMessage(formData);
      console.log("Message sent successfully:", response);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleSend = async () => {
    await handleSendTextMessage();
  };

  const handleHangup = async () => {
    handleSend();

    // // Xử lý sự kiện reject (tắt cuộc gọi)
    handleHangUp({
      ongoingCall: ongoingCall ? ongoingCall : undefined,
      isEmitHangUp: true,
    });
  };

  useEffect(() => {
    if (peer?.stream) {
      setRemoteStream(peer.stream);
      setCallStarted(true);
    } else {
      setRemoteStream(null);
    }
  }, [peer?.stream]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (!callStarted) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStarted]);

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
      <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-start pt-20 z-50 bg-slate-200 rounded-md">
        <div className="flex flex-col gap-8 ">
          <Image
            src={otherUser?.profile?.avatar || "/assets/images/capy.jpg"}
            alt="Avatar"
            width={100}
            height={100}
            className="size-28 rounded-full object-cover"
          />
          <div className="call-info text-center flex justify-center flex-col items-center">
            <h3 className="text-xl font-semibold">
              {ongoingCall?.participants?.receiver?.profile?.firstName &&
              ongoingCall?.participants?.receiver?.profile?.lastName
                ? `${ongoingCall.participants.receiver.profile.firstName} ${ongoingCall.participants.receiver.profile.lastName}`
                : "Unknown User"}
            </h3>

            <div className="flex items-center text-sm text-black  bg-opacity-50 px-3 py-1 rounded-xl">
              <span>{formatDuration(callDuration)}</span>
            </div>
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
          onClick={() => handleHangup()} // Gọi rejectCall khi nhấn Reject
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
