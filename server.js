import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./socket-event/onCall.js";
import onWebrtcSignal from "./socket-event/onWebrtcSignal.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
export let io;
console.log("running...");

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer);
  let onlineUsers = [];
  io.on("connection", (socket) => {
    socket.on("addNewUser", (clerkUser) => {
      clerkUser &&
        !onlineUsers.some((user) => user?._id === clerkUser._id) &&
        onlineUsers.push({
          userId: clerkUser._id,
          socketId: socket.id,
          profile: clerkUser,
        });

      // Gửi đến tất cả client kết nối đến
      //io.emit('an event sent to all connected clients');
      io.emit("getUsers", onlineUsers);
    });
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      io.emit("getUsers", onlineUsers);
    });

    //call event
    socket.on("call", onCall);
    socket.on("webrtcSignal", onWebrtcSignal);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
