import { Notification } from "../models/notification.js";
import customError from "../utils/errorHandling.js";

export const getNotifications = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      50,
    );
    const filter = { recipient: req.user.id };
    const [notifications, total, unread] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("actor", "username img")
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ ...filter, read: false }),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      unread,
      pagination: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (error) {
    return next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { $set: { read: true } },
      { new: true },
    );
    if (!notification) {
      throw new customError("Notification not found", 404);
    }
    return res.status(200).json({ success: true, notification });
  } catch (error) {
    return next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { $set: { read: true } },
    );
    return res.status(200).json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    return next(error);
  }
};
