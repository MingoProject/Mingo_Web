"use client";
import { useSocket } from "@/context/SocketContext";
import Avatar from "../forms/personalPage/Avatar";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall } = useSocket();
  console.log("Ongoing Call:", ongoingCall);

  if (!ongoingCall?.isRinging) return;

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
            onClick={() => handleJoinCall(ongoingCall)}
          >
            <Icon
              icon="material-symbols:call"
              width={24}
              height={24}
              className="text-white cursor-pointer"
            />
          </button>

          <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer">
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
