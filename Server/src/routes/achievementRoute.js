import express from "express";
import { getMyAchievements } from "../controllers/achievementController.js";

export const achievementRoute = express.Router();
achievementRoute.get("/me", getMyAchievements);
