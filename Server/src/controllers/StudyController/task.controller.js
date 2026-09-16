import { Task } from "../../models/studyTracker/task.model.js";
import { User } from "../../models/user.js";
export const createTask = async (req, res) => {
  try {
    const { title, subject, deadline, priority } = req.body;

    const task = await Task.create({
      user: req.user._id, 
      title,
      subject,
      deadline,
      priority,
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { tasks: task._id },
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// User ke saare tasks fetch karna
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Task status update karna (pending -> in-progress -> completed)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Task delete karna
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // User model ke array se bhi reference remove karna
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { tasks: task._id },
    });

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};