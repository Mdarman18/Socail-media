import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";
console.log(process.env.JWT_SECRET);

// ===================== SIGNUP =====================
export const handleSignup = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
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

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // true in production (HTTPS)
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: userData,
    });
    console.log(userData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log(error.message);
  }
};

// ===================== LOGIN =====================

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ===================== STREAK LOGIC =====================

    const now = new Date();

    if (user.lastActiveDate === null) {
      // First login
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
        // Streak increase nahi hogi
      } else if (difference === 1) {
        // Next consecutive day
        user.currentStreak++;

        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }

        user.lastActiveDate = now;
      } else {
        // Ek ya zyada din miss
        user.currentStreak = 1;
        user.lastActiveDate = now;
      }
    }

    // Save streak changes
    await user.save();

    // ===================== JWT =====================

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Remove password before sending response
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

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===================== LOGOUT =====================

export const handleLogout = async (req, res) => {
  try {
    // Cookie ko instantly clear (expire) kar diya jata hai
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
