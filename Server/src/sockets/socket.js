import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";

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

io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || "";
  const token = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.slice("token=".length);

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id.toString();
    return next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
});

export const userSockets = {}; //===---this map stores socket id corresponding the userId :-- UserId
io.on("connection", (socket) => {
  const userId = socket.userId;
  if (userId) {
    userSockets[userId] = socket.id;
  }
  io.emit("getUserOnline", Object.keys(userSockets));
  socket.on("disconnect", () => {
    if (userSockets[userId] === socket.id) {
      delete userSockets[userId];
    }
    io.emit("getUserOnline", Object.keys(userSockets));
  });
});
export { app, server, io };
