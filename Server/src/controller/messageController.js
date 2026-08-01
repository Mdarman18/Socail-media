import Conversation from "../models/conversationMessage.js";
import { Message } from "../models/message.js";

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

// ======-----get a message ---===========
export const getMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const receiverId = req.params.id;

    // Conversation dhundo
    const conversation = await Conversation.findOne({
      participants: {
        $all: [userId, receiverId],
      },
    }).populate("messages");

    // Agar conversation hi nahi hai
    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    // Conversation ke saare messages bhej do
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
