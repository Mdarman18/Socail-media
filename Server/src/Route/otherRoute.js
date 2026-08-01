import express from "express";
import {
  editProfile,
  followUnfollow,
  getProfile,
  getSuggestedUsers,
} from "../controller/otherAll.js";
import upload from "../utlis/multer.js";

export const otherRouter = express.Router();

/**
 * @swagger
 * /api/profile/get/{id}:
 *   get:
 *     summary: Get User Profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       404:
 *         description: User not found
 */
otherRouter.get("/get/:id", getProfile);

/**
 * @swagger
 * /api/profile/edit:
 *   post:
 *     summary: Edit User Profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: MERN Stack Developer
 *               gender:
 *                 type: string
 *                 enum:
 *                   - male
 *                   - female
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad Request
 */
otherRouter.post("/edit", upload.single("img"), editProfile);

/**
 * @swagger
 * /api/profile/getSuggestion:
 *   get:
 *     summary: Get Suggested Users
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suggested users fetched successfully
 */
otherRouter.get("/getSuggestion", getSuggestedUsers);

/**
 * @swagger
 * /api/profile/follow/{id}:
 *   post:
 *     summary: Follow or Unfollow User
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to Follow/Unfollow
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f98765
 *     responses:
 *       200:
 *         description: Follow/Unfollow successful
 *       400:
 *         description: Invalid Request
 */
otherRouter.post("/follow/:id", followUnfollow);