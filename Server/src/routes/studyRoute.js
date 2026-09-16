import express from "express";
import auth from "../utils/verifyUser.js";

import { getDailyProgress } from "../controllers/StudyController/dailyGoal.controller.js";
import {
  startPomodoro,
  pausePomodoro,
  resumePomodoro,
  completePomodoro,
  cancelPomodoro,
  getPomodoroElapsed,
} from "../controllers/StudyController/pomodoro.controller.js";
import {
  createStudySession,
  getStudyHistory,
} from "../controllers/StudyController/studySession.controller.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/StudyController/task.controller.js";
import { updateStudyGoals } from "../controllers/StudyController/user.controller.js";

const router = express.Router();

// Apply auth middleware to all study tracker routes
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Study Tracker
 *   description: Endpoints for Study Tracker (Pomodoro, Goals, Sessions, Tasks)
 */

// ==========================================
// --- Daily Goals ---
// ==========================================

/**
 * @swagger
 * /api/study/daily-progress:
 *   get:
 *     summary: Get today's daily goal progress
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Specific date to check progress (optional, defaults to today)
 *     responses:
 *       200:
 *         description: Daily progress fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/daily-progress", getDailyProgress);
router.get("/daily-goals", getDailyProgress);

// ==========================================
// --- Pomodoro Sessions ---
// ==========================================

/**
 * @swagger
 * /api/study/pomodoro/start:
 *   post:
 *     summary: Start a new Pomodoro session
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               topic:
 *                 type: string
 *               sessionType:
 *                 type: string
 *                 default: focus
 *               plannedDurationMinutes:
 *                 type: number
 *                 default: 25
 *     responses:
 *       201:
 *         description: Pomodoro session started
 */
router.post("/pomodoro/start", startPomodoro);

/**
 * @swagger
 * /api/study/pomodoro/{id}/pause:
 *   put:
 *     summary: Pause a running Pomodoro session
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session paused
 */
router.put("/pomodoro/:id/pause", pausePomodoro);

/**
 * @swagger
 * /api/study/pomodoro/{id}/resume:
 *   put:
 *     summary: Resume a paused Pomodoro session
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session resumed
 */
router.put("/pomodoro/:id/resume", resumePomodoro);

/**
 * @swagger
 * /api/study/pomodoro/{id}/complete:
 *   put:
 *     summary: Complete a Pomodoro session
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session completed
 */
router.put("/pomodoro/:id/complete", completePomodoro);

/**
 * @swagger
 * /api/study/pomodoro/{id}/cancel:
 *   put:
 *     summary: Cancel a running Pomodoro session
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session cancelled
 */
router.put("/pomodoro/:id/cancel", cancelPomodoro);
router.get("/pomodoro/:id/elapsed", getPomodoroElapsed);

// ==========================================
// --- Study Sessions ---
// ==========================================

/**
 * @swagger
 * /api/study/sessions:
 *   post:
 *     summary: Log a manual study session
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               topic:
 *                 type: string
 *               durationMinutes:
 *                 type: number
 *               focusRating:
 *                 type: number
 *               mood:
 *                 type: string
 *               notes:
 *                 type: string
 *               relatedTask:
 *                 type: string
 *     responses:
 *       201:
 *         description: Study session logged
 */
router.post("/sessions", createStudySession);

/**
 * @swagger
 * /api/study/sessions:
 *   get:
 *     summary: Get user study session history
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Study sessions fetched
 */
router.get("/sessions", getStudyHistory);

// ==========================================
// --- Tasks ---
// ==========================================

/**
 * @swagger
 * /api/study/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/tasks", createTask);

/**
 * @swagger
 * /api/study/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched
 */
router.get("/tasks", getTasks);

/**
 * @swagger
 * /api/study/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put("/tasks/:id", updateTask);

/**
 * @swagger
 * /api/study/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/tasks/:id", deleteTask);

// ==========================================
// --- Study Goals (User Settings) ---
// ==========================================

/**
 * @swagger
 * /api/study/goals:
 *   put:
 *     summary: Update study goals
 *     tags: [Study Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyGoalMinutes:
 *                 type: number
 *               weeklyGoalMinutes:
 *                 type: number
 *     responses:
 *       200:
 *         description: Goals updated
 */
router.put("/goals", updateStudyGoals);
router.patch("/settings", updateStudyGoals);
router.get("/settings", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      dailyGoalMinutes: req.user.dailyGoalMinutes,
      weeklyGoalMinutes: req.user.weeklyGoalMinutes,
      currentStreak: req.user.currentStreak,
      longestStreak: req.user.longestStreak
    }
  });
});

export default router;
