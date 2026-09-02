import { Community } from "../Models/community.js";
import { Post } from "../Models/postSchema.js";
import { User } from "../Models/user.js";
import cloudinary from "../utlis/cloud.js";
import sharp from "sharp";
import customError from "../utlis/errorHandling.js";

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
    const communities = await Community.find()
      .populate("creator", "username img")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      communities,
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

    if (community.members.includes(userId)) {
      throw new customError("Aap pehle se is community ke member hain!", 400);
    }

    // Community ke members mein add karein
    community.members.push(userId);
    await community.save();

    // User ke communities array mein bhi add karein
    await User.findByIdAndUpdate(userId, {
      $push: { communities: communityId },
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

// 4. Kisi specific Community ke andar ki Posts dekhna
export const getCommunityPosts = async (req, res, next) => {
  try {
    const communityId = req.params.id;

    const posts = await Post.find({ community: communityId })
      .populate("author", "username img")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username img" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
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
