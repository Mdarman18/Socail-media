import express from "express";
import passport from "passport";

import jwt from "jsonwebtoken";
import auth from "../utlis/verifyUser.js";
const authRoute = express.Router();
authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRoute.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );
      res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
    } catch (error) {
      console.log("google error ", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
    }
  },
);

authRoute.get("/me", auth, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
});
export default authRoute;
