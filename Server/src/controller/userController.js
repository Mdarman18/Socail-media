import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";
import customError from "../utlis/errorHandling.js";

console.log(process.env.JWT_SECRET);

// ===================== SIGNUP =====================
export const handleSignup = async (req, res, next) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!username || !email || !password) {
      throw new customError("All fields are required", 400);
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new customError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      gender,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date(),
    });

    const userData = user.toObject();
    delete userData.password;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: userData,
    });
  } catch (error) {
    next(error); // Catch block se error seedha central middleware mein jayegi
  }
};

// ===================== LOGIN =====================
export const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new customError("Email and Password are required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new customError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new customError("Invalid credentials", 401);
    }

    // ===================== STREAK LOGIC =====================
    const now = new Date();

    if (user.lastActiveDate === null) {
      user.currentStreak = 1;
      user.longestStreak = 1;
      user.lastActiveDate = now;
    } else {
      const lastDate = new Date(user.lastActiveDate);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastActive = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate(),
      );

      const difference = (today - lastActive) / (1000 * 60 * 60 * 24);

      if (difference === 0) {
        // Same day login
      } else if (difference === 1) {
        user.currentStreak++;
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
        user.lastActiveDate = now;
      } else {
        user.currentStreak = 1;
        user.lastActiveDate = now;
      }
    }

    await user.save();

    // ===================== JWT =====================
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userData = user.toObject();
    delete userData.password;

    // ===================== COOKIE =====================
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });

    // ===================== RESPONSE =====================
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    next(error); // Catch block se error seedha central middleware mein jayegi
  }
};

// ===================== LOGOUT =====================
export const handleLogout = async (req, res, next) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
