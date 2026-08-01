import express from "express";
import { conversation, getMessage } from "../controller/messageController.js";
export const messageRoute = express.Router();

messageRoute.post("/addmessage/:id", conversation);
messageRoute.get("/getmessage/:id", getMessage);
