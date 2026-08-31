import express from "express";
import auth from "../utlis/verifyUser.js";

import {
  createCommunity,
  getAllCommunities,
  getCommunityPosts,
  joinCommunity,
} from "../controller/community.js";
import upload from "../utlis/multer.js";

const router = express.Router();

/**
 * @swagger
 * /api/community/create:
 *   post:
 *     summary: Create a new learning community with an image
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Distributed Systems Enthusiasts"
 *               description:
 *                 type: string
 *                 example: "A hub to study distributed consensus and microservices."
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: Community banner or icon image
 *               category:
 *                 type: string
 *                 example: "Software Development"
 *               rules:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Be collaborative", "No spam"]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Go", "Backend", "Raft"]
 *     responses:
 *       201:
 *         description: Community successfully created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post("/create", auth, upload.single("img"), createCommunity);

/**
 * @swagger
 * /api/community/all:
 *   get:
 *     summary: Fetch all communities
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all communities retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/all", auth, getAllCommunities);

/**
 * @swagger
 * /api/community/join/{id}:
 *   post:
 *     summary: Join an existing community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Community ID
 *     responses:
 *       200:
 *         description: Successfully joined the community
 *       400:
 *         description: Already a member
 *       404:
 *         description: Community not found
 *       401:
 *         description: Unauthorized
 */
router.post("/join/:id", auth, joinCommunity);

/**
 * @swagger
 * /api/community/{id}/posts:
 *   get:
 *     summary: Get all posts belonging to a specific community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Community ID
 *     responses:
 *       200:
 *         description: List of community posts retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/:id/posts", auth, getCommunityPosts);

export default router;
