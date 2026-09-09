import express from "express";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController.js";

export const notificationRoute = express.Router();

notificationRoute.get("/", getNotifications);
notificationRoute.patch("/:id/read", markNotificationRead);
notificationRoute.patch("/read-all", markAllNotificationsRead);
