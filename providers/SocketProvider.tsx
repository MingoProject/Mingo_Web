import { SocketContextProvider } from "@/context/SocketContext";
import React from "react";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return <SocketContextProvider>{children}</SocketContextProvider>;
};
