"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import {
  OngoingCall,
  Participants,
  PeerData,
  SocketUser,
} from "@/dtos/SocketDTO";
import Peer, { SignalData } from "simple-peer";
import { useRouter } from "next/navigation";

interface iSocketContext {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  peer: PeerData | null;
  isCallEnded: boolean;
  handleCall: (user: SocketUser, isVideoCall: boolean) => void;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  handleHangUp: (data: {
    ongoingCall?: OngoingCall;
    isEmitHangUp?: boolean;
  }) => void;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const profile = useAuth();
  const user = profile.profile;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUser] = useState<SocketUser[] | null>(null);
  const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const currentSocketUser = onlineUsers?.find(
    (onlineUsers) => onlineUsers.userId === user?._id
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<PeerData | null>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const router = useRouter();

  console.log("online User", onlineUsers);
  console.log("socket", socket);
  const requestPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({
        name: "microphone",
      });
      console.log("Microphone Permission:", permissions.state);

      if (permissions.state !== "granted") {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone permission granted");
      }
    } catch (error) {
      console.log("Microphone permission denied:", error);
    }

    try {
      const videoPermission = await navigator.permissions.query({
        name: "camera",
      });
      console.log("Camera Permission:", videoPermission.state);

      if (videoPermission.state !== "granted") {
        await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Camera permission granted");
      }
    } catch (error) {
      console.log("Camera permission denied:", error);
    }
  };

  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) {
        return localStream;
      }

      try {
        navigator.permissions.query({ name: "camera" }).then(console.log);
        navigator.permissions.query({ name: "microphone" }).then(console.log);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            frameRate: { min: 15, ideal: 24, max: 30 },
            facingMode: "user",
          },
        });
        console.log("Media stream obtained:", stream);
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.log("false to get the stream", error);
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  const handleCall = useCallback(
    async (user: SocketUser, isVideoCall: boolean) => {
      setIsCallEnded(false);
      if (!currentSocketUser || !socket) return;
      requestPermissions();
      const stream = await getMediaStream();

      if (!stream) {
        console.log("No stream in handleCall");
        return;
      }

      const participants = { caller: currentSocketUser, receiver: user };
      setOngoingCall({
        participants,
        isRinging: false,
        isVideoCall: isVideoCall,
      });
      socket.emit("call", participants, isVideoCall);
    },
    [socket, currentSocketUser, ongoingCall]
  );

  const onIncomingCall = useCallback(
    (participants: Participants, isVideoCall: boolean) => {
      setOngoingCall({
        participants,
        isRinging: true,
        isVideoCall: isVideoCall,
      });
    },
    [socket, user, ongoingCall]
  );

  const handleHangUp = useCallback(
    (data: { ongoingCall?: OngoingCall | null; isEmitHangUp?: boolean }) => {
      if (socket && user && data?.ongoingCall && data?.isEmitHangUp) {
        socket.emit("hangup", {
          ongoingCall: data.ongoingCall,
          userHangingupId: user._id,
        });
      }
      setOngoingCall(null);
      setPeer(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      setIsCallEnded(true);
      router.back();
    },
    [socket, user, localStream]
  );

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];
      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: { iceServers },
      });

      peer.on("stream", (stream) => {
        setPeer((prevPeer) => {
          if (prevPeer) {
            return { ...prevPeer, stream };
          }
          return prevPeer;
        });
      });
      peer.on("error", console.error);
      peer.on("close", () => handleHangUp({}));

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          handleHangUp({});
        }
      };

      return peer;
    },
    [ongoingCall, setPeer]
  );

  const completePeerConnection = useCallback(
    async (connectionData: {
      sdp: SignalData;
      ongoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      if (!localStream) {
        console.log("Missing the localStream");
        return;
      }

      if (peer) {
        peer.peerConnection?.signal(connectionData.sdp);
        return;
      }

      const newPeer = createPeer(localStream, true);

      setPeer({
        peerConnection: newPeer,
        participantUser: connectionData.ongoingCall.participants.receiver,
        stream: undefined,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: true,
          });
        }
      });
    },
    [localStream, createPeer, peer, ongoingCall]
  );

  const handleJoinCall = useCallback(
    async (ongoingCall: OngoingCall) => {
      setIsCallEnded(false);
      if (!ongoingCall) {
        console.error("⚠️ OngoingCall is undefined!");
        return;
      }
      console.log("✅ Received ongoingCall:", ongoingCall);

      setOngoingCall((prev) => {
        if (prev) {
          return {
            ...prev,
            isRinging: false,
            isVideoCall: ongoingCall.isVideoCall,
          };
        } else return null;
      });

      const stream = await getMediaStream();
      if (!stream) {
        console.log("Could not get stream in handleJoinCall");
        return;
      }

      const newPeer = createPeer(stream, true);

      setPeer({
        peerConnection: newPeer,
        participantUser: ongoingCall.participants.caller,
        stream: undefined,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: false,
          });
        }
      });
    },
    [socket, currentSocketUser]
  );

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisConnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisConnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisConnect);
    };
  }, [socket]);

  //set online users
  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    // Gửi cho tất cả client
    //socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
    socket.emit("addNewUser", user);

    socket.on("getUsers", (res) => {
      setOnlineUser(res);
    });
    return () => {
      socket.off("getUser", (res) => {
        setOnlineUser(res);
      });
    };
  }, [socket, isSocketConnected, user]);

  //calls
  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    socket.on("incomingCall", onIncomingCall);
    socket.on("webrtcSignal", completePeerConnection);
    socket.on("hangup", handleHangUp);
    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
      socket.off("hangup", handleHangUp);
    };
  }, [socket, isSocketConnected, user, onIncomingCall, completePeerConnection]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isCallEnded) {
      timeout = setTimeout(() => {
        setIsCallEnded(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isCallEnded]);

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        ongoingCall,
        localStream,
        peer,
        isCallEnded,
        handleCall,
        handleJoinCall,
        handleHangUp,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error("useSocket must be within a SocketContextProvider");
  }
  return context;
};
