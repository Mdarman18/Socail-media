import Conversation from "../Models/conversationMessage.js";
import { Message } from "../Models/message.js";
import { io, userSockets } from "../socket/socekt.js";
import customError from "../utlis/errorHandling.js"; // Aapka custom error class path

// ===================== SEND MESSAGE =====================
export const conversation = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { text: message } = req.body;

    // Optional validation: check if message text is present
    if (!message || message.trim() === "") {
      throw new customError("Message text cannot be empty", 400);
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
      message,
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

    const conversation = await Conversation.findOne({
      participants: {
        $all: [userId, receiverId],
      },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (error) {
    return next(error);
  }
};
