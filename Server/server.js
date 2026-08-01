import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
dotenv.config();


import passport from "passport";

import connectDB from "./src/Connection/connect.js";
import "./src/config/passport.js"; 

import { userRouter } from "./src/Route/userRoute.js";
import { otherRouter } from "./src/Route/otherRoute.js";
import { postRoute } from "./src/Route/postRoute.js";
import { messageRoute } from "./src/Route/messageRoute.js";
import auth from "./src/utlis/verifyUser.js";
import authRoute from "./src/Route/googleAuth.js";
import swaggerJSDoc from "swagger-jsdoc";
import { specs } from "./src/config/swagger.js";

const app = express();

app.use(cookieParser());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(passport.initialize());

// ===========--------- Routes ---------==================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
app.get("/", (req, res) => {
  res.send("Express Server is Running 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/profile", auth, otherRouter);
app.use("/api/post", auth, postRoute);
app.use("/api/message", auth, messageRoute);

// Google Auth Routes
app.use("/auth", authRoute);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running On http://localhost:${PORT}`);
});