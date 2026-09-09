import { Community } from "../models/community.js";
import { Post } from "../models/postSchema.js";
import { User } from "../models/user.js";
import cloudinary from "../utils/cloud.js";
import sharp from "sharp";
import customError from "../utils/errorHandling.js";

// 1. Nayi Community Banana (Cloudinary Image Upload ke sath)
export const createCommunity = async (req, res, next) => {
  try {
    const { name, description, category, rules, tags } = req.body;
    const imgFile = req.file; // Multer middleware se aane wali file

    if (!name || !description) {
      throw new customError("Name aur description zaroori hain!", 400);
    }

    let imgUrl = "";

    // Agar user ne community banner/icon image di hai, toh use optimize karke Cloudinary par upload karein
    if (imgFile) {
      const optimizedBuffer = await sharp(imgFile.buffer)
        .resize({
          width: 1000,
          height: 500,
          fit: "inside",
        })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "communities/banners",
      });

      imgUrl = cloudResponse.secure_url;
    }

    const newCommunity = await Community.create({
      name,
      description,
      img: imgUrl, // Cloudinary secure URL yahan save hoga
      category: category || "Software Development",
      rules:
        rules && rules.length > 0 ? rules : ["Be collaborative and respectful"],
      tags: tags || [],
      creator: req.user._id,
      members: [req.user._id], // Creator automatic pehla member ban jayega
      admins: [req.user._id],
    });

    // User ke communities array mein bhi add kar denge
    await User.findByIdAndUpdate(req.user._id, {
      $push: { communities: newCommunity._id },
    });

    res.status(201).json({
      success: true,
      message: "Community successfully launch ho gayi! 🚀",
      community: newCommunity,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Platform ki saari Communities fetch karna
export const getAllCommunities = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      50,
    );
    const [communities, total] = await Promise.all([
      Community.find()
        .populate("creator", "username img")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Community.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      communities,
      pagination: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Community Join Karna
export const joinCommunity = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const userId = req.user._id;

    const community = await Community.findById(communityId);
    if (!community) {
      throw new customError("Community nahi mili!", 404);
    }

    if (
      community.members.some(
        (member) => member.toString() === userId.toString(),
      )
    ) {
      throw new customError("Aap pehle se is community ke member hain!", 400);
    }

    // Community ke members mein add karein
    community.members.push(userId);
    await community.save();

    // User ke communities array mein bhi add karein
    await User.findByIdAndUpdate(userId, {
      $addToSet: { communities: communityId },
    });

    res.status(200).json({
      success: true,
      message: "Community successfully join kar li! 🎉",
      community,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      throw new customError("Community nahi mili!", 404);
    }
    if (community.creator.toString() === req.user.id.toString()) {
      throw new customError("The community owner cannot leave", 400);
    }

    await Community.findByIdAndUpdate(community._id, {
      $pull: {
        members: req.user.id,
        admins: req.user.id,
        moderators: req.user.id,
      },
    });
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { communities: community._id },
    });

    return res.status(200).json({
      success: true,
      message: "Community left successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const setCommunityRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id: communityId, userId } = req.params;
    if (!["admin", "moderator", "member"].includes(role)) {
      throw new customError("Invalid community role", 400);
    }

    const community = await Community.findById(communityId);
    if (!community) {
      throw new customError("Community nahi mili!", 404);
    }
    const isAdmin = community.admins.some(
      (id) => id.toString() === req.user.id.toString(),
    );
    if (!isAdmin) {
      throw new customError("Only community admins can manage roles", 403);
    }
    if (!community.members.some((id) => id.toString() === userId.toString())) {
      throw new customError("User is not a community member", 400);
    }

    await Community.findByIdAndUpdate(communityId, {
      $pull: { admins: userId, moderators: userId },
    });
    if (role !== "member") {
      await Community.findByIdAndUpdate(communityId, {
        $addToSet: { [role === "admin" ? "admins" : "moderators"]: userId },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Community role updated to ${role}`,
    });
  } catch (error) {
    return next(error);
  }
};

// 4. Kisi specific Community ke andar ki Posts dekhna
export const getCommunityPosts = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      50,
    );

    const [posts, total] = await Promise.all([
      Post.find({ community: communityId })
        .populate("author", "username img")
        .populate({
          path: "comment",
          options: { sort: { createdAt: -1 } },
          populate: { path: "author", select: "username img" },
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments({ community: communityId }),
    ]);

    res.status(200).json({
      success: true,
      posts,
      pagination: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (error) {
    next(error);
  }
};

export const getCommunityDetails = async (req, res, next) => {
  try {
    const communityId = req.params.id;

    const community = await Community.findById(communityId)
      .populate("creator", "username img")
      .populate("members", "username img");

    if (!community) {
      throw new customError("Community nahi mili!", 404);
    }

    // Is community ke andar kitni posts hain uska count nikalna
    const postsCount = await Post.countDocuments({ community: communityId });

    res.status(200).json({
      success: true,
      community: {
        ...community.toObject(),
        postsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
