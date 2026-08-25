import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import connectDB from "./src/Connection/connect.js";

import { userRouter } from "./src/Route/userRoute.js";
import { otherRouter } from "./src/Route/otherRoute.js";
import { postRoute } from "./src/Route/postRoute.js";
import { messageRoute } from "./src/Route/messageRoute.js";
import auth from "./src/utlis/verifyUser.js";
import { specs } from "./src/config/swagger.js";
import { app } from "./src/socket/socekt.js"; // Socket file se sirf 'app' import karein

// Middleware Setup
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://socail-media-cyan.vercel.app"],
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
// =====------ Central MiddleWare ------============
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
// Connect DB
connectDB();

// ===========--------- Routes ---------==================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Express Server is Running 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/profile", auth, otherRouter);
app.use("/api/post", auth, postRoute);
app.use("/api/message", auth, messageRoute);

app.get("/me", auth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default app;
