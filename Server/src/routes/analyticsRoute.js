import express from "express";
import { getMyAnalytics } from "../controllers/analyticsController.js";

export const analyticsRoute = express.Router();
analyticsRoute.get("/me", getMyAnalytics);
