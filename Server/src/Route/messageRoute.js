import express from "express";
import { conversation, getMessage } from "../controller/messageController.js";
export const messageRoute = express.Router();

/**
 * @swagger
 * /api/message/addmessage/{id}:
 *   post:
 *     summary: Send a message
 *     tags:
 *       - Message
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID of the receiver
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Hii, kaise ho?"
 *
 *     responses:
 *       200:
 *         description: Message added successfully
 *       404:
 *         description: User not found
 */
messageRoute.post("/addmessage/:id", conversation);

/**
 * @swagger
 * /api/message/getmessage/{id}:
 *   get:
 *     summary: Fetch messages
 *     tags:
 *       - Message
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID of the other participant
 *         schema:
 *           type: string
 *           example: 6890d3e9c4a12b4e7f12345
 *
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *       404:
 *         description: No messages found
 */
messageRoute.get("/getmessage/:id", getMessage);
