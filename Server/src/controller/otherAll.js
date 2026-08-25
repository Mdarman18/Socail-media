import customError from "../utlis/errorHandling.js";
import { User } from "../Models/user.js";
import cloudinary from "../utlis/cloud.js";
import getDataUri from "../utlis/dataUri.js";

// ===================== GET PROFILE =====================
export const getProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new customError("User ID is required", 400);
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new customError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== EDIT PROFILE =====================
export const editProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bio, gender, education, location, nickname } = req.body;
    const img = req.file;
    let cloudResponse;

    if (img) {
      const file = getDataUri(img);
      cloudResponse = await cloudinary.uploader.upload(file);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new customError("User not found", 404);
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (education) user.education = education;
    if (nickname) user.nickname = nickname;
    if (location) user.location = location;
    if (cloudResponse) user.img = cloudResponse.secure_url;

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== GET SUGGESTED USERS =====================
export const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const suggestedUsers = await User.find({
      _id: { $ne: currentUserId },
    })
      .select("-password")
      .limit(5);

    if (!suggestedUsers || suggestedUsers.length === 0) {
      throw new customError("Currently no suggested users available", 400);
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== FOLLOW AND UNFOLLOW =====================
export const followUnfollow = async (req, res, next) => {
  try {
    const followKarneWala = req.user.id;
    const jisKoFollowKarna = req.params.id;

    // Can't follow yourself
    if (followKarneWala.toString() === jisKoFollowKarna.toString()) {
      throw new customError("You can't follow or unfollow yourself", 400);
    }

    const user = await User.findById(followKarneWala);
    const target = await User.findById(jisKoFollowKarna);

    // User/target doesn't exist
    if (!user || !target) {
      throw new customError("User not found", 404);
    }

    const isFollowing = user.following.some(
      (id) => id.toString() === jisKoFollowKarna.toString(),
    );

    // ================= UNFOLLOW =================
    if (isFollowing) {
      const [updatedUser, updatedTarget] = await Promise.all([
        User.findByIdAndUpdate(
          followKarneWala,
          {
            $pull: {
              following: jisKoFollowKarna,
            },
          },
          { new: true },
        ).select("-password"),

        User.findByIdAndUpdate(
          jisKoFollowKarna,
          {
            $pull: {
              followers: followKarneWala,
            },
          },
          { new: true },
        ).select("-password"),
      ]);

      return res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
        following: false,
        user: updatedUser,
        target: updatedTarget,
      });
    }

    // ================= FOLLOW =================
    const [updatedUser, updatedTarget] = await Promise.all([
      User.findByIdAndUpdate(
        followKarneWala,
        {
          $addToSet: {
            following: jisKoFollowKarna,
          },
        },
        { new: true },
      ).select("-password"),

      User.findByIdAndUpdate(
        jisKoFollowKarna,
        {
          $addToSet: {
            followers: followKarneWala,
          },
        },
        { new: true },
      ).select("-password"),
    ]);

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
      following: true,
      user: updatedUser,
      target: updatedTarget,
    });
  } catch (error) {
    return next(error);
  }
};
