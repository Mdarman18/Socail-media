import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit"; // 1. Package import karein
import helmet from "helmet";
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
import { notificationRoute } from "./src/routes/notificationRoute.js";
import { collectionRoute } from "./src/routes/collectionRoute.js";
import { searchRoute } from "./src/routes/searchRoute.js";
import { analyticsRoute } from "./src/routes/analyticsRoute.js";
import { achievementRoute } from "./src/routes/achievementRoute.js";

// IMPORTANT FOR CLOUD HOSTING (Render/Vercel)
app.set("trust proxy", 1);

// Middleware Setup
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
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
    limit: "1mb",
  }),
);
const sanitizeObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !key.startsWith("$") && !key.includes("."))
      .map(([key, nestedValue]) => [key, sanitizeObject(nestedValue)]),
  );
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
});

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
app.use("/api/user/signin", authLimiter);

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Express Server is Running 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/profile", auth, otherRouter);
app.use("/api/post", auth, postRoute);
app.use("/api/message", auth, messageRoute);
app.use("/api/notifications", auth, notificationRoute);
app.use("/api/collections", auth, collectionRoute);
app.use("/api/search", auth, searchRoute);
app.use("/api/analytics", auth, analyticsRoute);
app.use("/api/achievements", auth, achievementRoute);
app.use("/api/community", router);
app.get("/me", auth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  const statusCode =
    err.statusCode ||
    (err.name === "ValidationError" || err.name === "CastError" ? 400 : 500);
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error:
      statusCode === 401
        ? "AUTH_REQUIRED"
        : statusCode === 403
          ? "FORBIDDEN"
          : statusCode === 404
            ? "NOT_FOUND"
            : statusCode === 429
              ? "RATE_LIMITED"
              : statusCode < 500
                ? "VALIDATION_ERROR"
                : "INTERNAL_ERROR",
  });
});

export default app;
