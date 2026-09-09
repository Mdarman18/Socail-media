import { Collection } from "../models/collection.js";
import { Post } from "../models/postSchema.js";
import customError from "../utils/errorHandling.js";

export const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .populate("posts", "status subject caption img pdf author createdAt")
      .lean();
    return res.status(200).json({ success: true, collections });
  } catch (error) {
    return next(error);
  }
};

export const createCollection = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      throw new customError("Collection name is required", 400);
    }
    const collection = await Collection.create({ owner: req.user.id, name });
    return res.status(201).json({ success: true, collection });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new customError("A collection with this name already exists", 409),
      );
    }
    return next(error);
  }
};

export const renameCollection = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      throw new customError("Collection name is required", 400);
    }
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: { name } },
      { new: true, runValidators: true },
    );
    if (!collection) {
      throw new customError("Collection not found", 404);
    }
    return res.status(200).json({ success: true, collection });
  } catch (error) {
    return next(error);
  }
};

export const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!collection) {
      throw new customError("Collection not found", 404);
    }
    return res
      .status(200)
      .json({ success: true, message: "Collection deleted" });
  } catch (error) {
    return next(error);
  }
};

export const updateCollectionPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).select("_id").lean();
    if (!post) {
      throw new customError("Post not found", 404);
    }
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { [req.method === "PUT" ? "$addToSet" : "$pull"]: { posts: postId } },
      { new: true },
    );
    if (!collection) {
      throw new customError("Collection not found", 404);
    }
    return res.status(200).json({ success: true, collection });
  } catch (error) {
    return next(error);
  }
};
