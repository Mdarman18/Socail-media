import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://socail-media-cyan.vercel.app",
      "https://socail-media-4.onrender.com",
      process.env.FRONTEND_URL || "",
    ].filter(Boolean),
    methods: ["GET", "POST"],
  },
});
export const userSockets = {}; //===---this map stores socket id corresponding the userId :-- UserId
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("🟢 SOCKET CONNECTED");
  console.log("Socket ID:", socket.id);
  console.log("User ID:", socket.handshake.query.userId);
  if (userId) {
    userSockets[userId] = socket.id;
    console.log(`user is connected :UserId=${userId},socketId=${socket.id}`);
  }
  console.log("📌 User Sockets:", userSockets);
  io.emit("getUserOnline", Object.keys(userSockets));
  socket.on("disconnect", () => {
    console.log(`user is disconnected :UserId=${userId},socketId=${socket.id}`);
    delete userSockets[userId];
    io.emit("getUserOnline", Object.keys(userSockets));
  });
});
export { app, server, io };
