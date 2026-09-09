import express from "express";
import {
  createCollection,
  deleteCollection,
  getCollections,
  renameCollection,
  updateCollectionPost,
} from "../controllers/collectionController.js";

export const collectionRoute = express.Router();

collectionRoute.get("/", getCollections);
collectionRoute.post("/", createCollection);
collectionRoute.patch("/:id", renameCollection);
collectionRoute.delete("/:id", deleteCollection);
collectionRoute.put("/:id/posts/:postId", updateCollectionPost);
collectionRoute.delete("/:id/posts/:postId", updateCollectionPost);
