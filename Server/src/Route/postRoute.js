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
  handleDownvote,
  handleUpvote,
  Like,
  savedPost,
} from "../controller/postController.js";

export const postRoute = express.Router();

/**
 * @swagger
 * /api/post/addpost:
 *   post:
 *     summary: Create a new post (supports text, doubts, resources, study updates with image/pdf)
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
 *             required:
 *               - status
 *               - subject
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [post, doubt, resource, study update]
 *                 example: post
 *               description:
 *                 type: string
 *                 example: This is a detailed description for the post.
 *               questionTitle:
 *                 type: string
 *                 example: How to reverse a linked list in Java?
 *               questionExplanation:
 *                 type: string
 *                 example: Detailed breakdown of the algorithm approach.
 *               subject:
 *                 type: string
 *                 enum:
 *                   - "Data Structures & Algorithms"
 *                   - "Web Development"
 *                   - "AI & Machine Learning"
 *                   - "Database Management Systems"
 *                   - "Computer Networks & Security"
 *                   - "Cloud & DevOps"
 *                   - "Competitive Programming"
 *                   - "General Computer Science"
 *                   - "other"
 *                 example: Web Development
 *               codeDetails:
 *                 type: string
 *                 example: console.log("Hello World");
 *               codeType:
 *                 type: string
 *                 enum: [Java, Python, JavaScript, sql]
 *                 example: JavaScript
 *               caption:
 *                 type: string
 *                 example: My first social media post 🚀
 *               tags:
 *                 type: string
 *                 example: javascript, react, webdev
 *               img:
 *                 type: string
 *                 format: binary
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error or missing required fields
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
 *         description: Post unliked successfully
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

/**
 * @swagger
 * /api/post/upvote/{id}:
 *   post:
 *     summary: Upvote a comment
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
 *         description: Comment upvoted successfully
 */
postRoute.post("/upvote/:id", handleUpvote);

/**
 * @swagger
 * /api/post/downvote/{id}:
 *   post:
 *     summary: Downvote a comment
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
 *         description: Comment downvoted successfully
 */
postRoute.post("/downvote/:id", handleDownvote);
