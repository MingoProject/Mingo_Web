"use client";
import { useSocket } from "@/context/SocketContext";
import Avatar from "../forms/personalPage/Avatar";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useParams, useRouter } from "next/navigation";
import { OngoingCall } from "@/dtos/SocketDTO";
import { createCall } from "@/lib/services/call.service";
import { CallCreateDTO } from "@/dtos/CallDTO";
import { sendMessage } from "@/lib/services/message.service";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangUp } = useSocket();
  const router = useRouter();
  const params = useParams();
  const boxId = params.id?.toString();

  const handleSendTextMessage = async () => {
    // Tạo đối tượng SegmentMessageDTO
    const messageData = {
      boxId: boxId,
      content: "//Cuoc goi ket thuc; time: 00:00", // content is now a string
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

  const handleAccept = async (ongoingCall: OngoingCall) => {
    if (!ongoingCall) return;
    router.push(`/call/${boxId}`);
    handleJoinCall(ongoingCall);
  };

  const handleReject = async (ongoingCall: OngoingCall) => {
    handleSend();

    // // Xử lý sự kiện reject (tắt cuộc gọi)
    handleHangUp({
      ongoingCall: ongoingCall ? ongoingCall : undefined,
      isEmitHangUp: true,
    });
  };

  if (!ongoingCall?.isRinging) return null;

  return (
    <div className="absolute bg-slate-500 w-screen bg-opacity-70 h-screen top-0 left-0 justify-center items-center flex">
      <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
        <div className="flex justify-center flex-col items-center">
          <div className="relative">
            <Image
              src={
                ongoingCall.participants.caller.profile.avatarUrl ||
                "/assets/images/default-user.png"
              }
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full object-cover"
              style={{ objectFit: "cover", width: "45px", height: "45px" }}
            />
          </div>
          <span className="text-[18px] font-semibold self-center text-sm">
            {`${ongoingCall.participants.caller.profile.firstName} ${ongoingCall.participants.caller.profile.lastName}`}
          </span>
        </div>
        <p className="text-sm sb-2">Incoming Call</p>
        <div className="flex gap-8">
          <button
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white cursor-pointer"
            onClick={() => handleAccept(ongoingCall)}
          >
            <Icon
              icon="material-symbols:call"
              width={24}
              height={24}
              className="text-white cursor-pointer"
            />
          </button>

          <button
            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer"
            onClick={() => handleReject(ongoingCall)} // Gọi rejectCall khi nhấn Reject
          >
            <Icon
              icon="material-symbols:call"
              width={24}
              height={24}
              className="text-white cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
