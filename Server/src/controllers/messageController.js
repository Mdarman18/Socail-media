import Conversation from "../models/conversationMessage.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { io, userSockets } from "../sockets/socket.js";
import customError from "../utils/errorHandling.js"; // Aapka custom error class path

// ===================== SEND MESSAGE =====================
export const conversation = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { text: message } = req.body;

    if (!message || message.trim() === "") {
      throw new customError("Message text cannot be empty", 400);
    }

    if (senderId.toString() === receiverId.toString()) {
      throw new customError("You cannot send a message to yourself", 400);
    }

    const receiver = await User.findById(receiverId).select("_id").lean();
    if (!receiver) {
      throw new customError("Receiver not found", 404);
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message.trim(),
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketId = userSockets[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    return next(error);
  }
};

// ===================== GET MESSAGES =====================
export const getMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const receiverId = req.params.id;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 50, 1),
      100,
    );

    const messageFilter = {
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
        { senderId: userId, reciverId: receiverId },
        { senderId: receiverId, reciverId: userId },
      ],
    };

    const [messages, total] = await Promise.all([
      Message.find(messageFilter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Message.countDocuments(messageFilter),
    ]);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        messages: [],
        pagination: { page, limit, total: 0, hasMore: false },
      });
    }

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      pagination: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (error) {
    return next(error);
  }
};
