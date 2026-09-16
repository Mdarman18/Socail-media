import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit"; // 1. Package import karein
dotenv.config();

import connectDB from "./src/Connection/connect.js";

import { userRouter } from "./src/routes/userRoute.js";
import { otherRouter } from "./src/routes/otherRoute.js";
import { postRoute } from "./src/routes/postRoute.js";
import { messageRoute } from "./src/routes/messageRoute.js";
import auth from "./src/utils/verifyUser.js";
import { specs } from "./src/config/swagger.js";
import { app } from "./src/sockets/socket.js";
import router from "./src/routes/communityRoute.js";
import studyRouter from "./src/routes/studyRoute.js";

// IMPORTANT FOR CLOUD HOSTING (Render/Vercel)
app.set("trust proxy", 1);

// Middleware Setup
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://socail-media-cyan.vercel.app",
      "https://socail-media-4.onrender.com",
      process.env.FRONTEND_URL || "",
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==================== 2. Rate Limiters Setup ====================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Bahut zyada requests aa gayi hain. Kripya thodi der baad koshish karein.",
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: "Bahut baar galat koshish ki gayi hai. 1 ghante baad try karein.",
  },
});

app.use("/api/", globalLimiter);

app.use("/api/user/login", authLimiter);
app.use("/api/user/signup", authLimiter);

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Express Server is Running 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/profile", auth, otherRouter);
app.use("/api/post", auth, postRoute);
app.use("/api/message", auth, messageRoute);
app.use("/api/community", router);
app.use("/api/study", studyRouter);
app.get("/me", auth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;
