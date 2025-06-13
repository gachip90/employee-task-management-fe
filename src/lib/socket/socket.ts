import { io, Socket } from "socket.io-client";

export const initSocket = (): Socket => {
  const socket = io("http://localhost:5000", {
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connect error:", error.message);
  });

  return socket;
};
