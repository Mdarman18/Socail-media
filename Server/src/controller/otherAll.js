import { User } from "../models/user.js";
import cloudinary from "../utlis/cloud.js";
import getDataUri from "../utlis/dataUri.js";

// ====------ Hadnle get profile ===-----------
export const getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======------edit profile ===------------
export const editProfile = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (education) user.education = education;
    if (nickname) user.nickname = nickname;
    if (location) user.location = location;
    if (cloudResponse) user.img = cloudResponse.secure_url;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password");
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== GET SUGGESTED USERS =====================

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const suggestedUsers = await User.find({
      _id: { $ne: currentUserId },
    })
      .select("-password")
      .limit(5);
    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Currently no suggested users available",
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====------- Follow And Unfollow ---------=================================
export const followUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.user.id;
    const jisKofollowKarna = req.params.id;

    // Can't follow yourself
    if (followKarneWala === jisKofollowKarna) {
      return res.status(400).json({
        success: false,
        message: "You Can't follow or Unfollow yourself",
      });
    }

    const user = await User.findById(followKarneWala);
    const target = await User.findById(jisKofollowKarna);

    // User/target doesn't exist
    if (!user || !target) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isFollowing = user.following.includes(jisKofollowKarna);

    if (isFollowing) {
      // UNFOLLOW
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $pull: { following: jisKofollowKarna } },
        ),

        User.updateOne(
          { _id: jisKofollowKarna },
          { $pull: { followers: followKarneWala } },
        ),
      ]);

      return res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      // FOLLOW
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $push: { following: jisKofollowKarna } },
        ),

        User.updateOne(
          { _id: jisKofollowKarna },
          { $push: { followers: followKarneWala } },
        ),
      ]);

      return res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
