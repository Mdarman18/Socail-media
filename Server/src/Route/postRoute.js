import express from "express";
import upload from "../utlis/multer.js";
import {
  addComment,
  addPost,
  DeletePost,
  Dislike,
  getComment,
  getUserKapost,
  getUserProfile,
  Like,
  savedPost,
} from "../controller/postController.js";

export const postRoute = express.Router();

/**
 * @swagger
 * /api/post/addpost:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *                 example: My first social media post 🚀
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Image required
 */
postRoute.post("/addpost", upload.single("img"), addPost);

/**
 * @swagger
 * /api/post/allpost:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         description: All posts fetched successfully
 */
postRoute.get("/allpost", getUserProfile);

/**
 * @swagger
 * /api/post/getuserpost:
 *   get:
 *     summary: Get logged in user's posts
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User posts fetched successfully
 */
postRoute.get("/getuserpost", getUserKapost);

/**
 * @swagger
 * /api/post/like/{id}:
 *   post:
 *     summary: Like a post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *     responses:
 *       200:
 *         description: Post liked successfully
 */
postRoute.post("/like/:id", Like);
/**
 * @swagger
 * /api/post/dislike/{id}:
 *   post:
 *     summary: DisLike a post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *     responses:
 *       200:
 *         description: Post liked successfully
 */
postRoute.post("/dislike/:id", Dislike);
/**
 * @swagger
 * /api/post/addcomment/{id}:
 *   post:
 *     summary: Add comment on post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Nice post 🔥
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
postRoute.post("/addcomment/:id", addComment);

/**
 * @swagger
 * /api/post/getcomment/{id}:
 *   get:
 *     summary: Get comments of a post
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 */
postRoute.get("/getcomment/:id", getComment);

/**
 * @swagger
 * /api/post/deletepost/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
postRoute.delete("/deletepost/:id", DeletePost);

/**
 * @swagger
 * /api/post/bookmarked/{id}:
 *   post:
 *     summary: Save or remove bookmark post
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *     responses:
 *       200:
 *         description: Bookmark updated successfully
 */
postRoute.post("/bookmarked/:id", savedPost);
