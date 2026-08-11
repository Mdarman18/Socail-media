import Conversation from "../Models/conversationMessage.js";
import { Message } from "../Models/message.js";
import { io, userSockets } from "../socket/socekt.js"; // 👈 Sirf socket file ka path (agar spelling 'socekt.js' hai toh wahi rakhein)

export const conversation = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { text: message } = req.body;

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessage = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
