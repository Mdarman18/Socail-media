import { studyUrl } from "../api/Axios";

// --- Tasks ---
export const getTasks = async () => {
  const res = await studyUrl.get("/tasks");
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await studyUrl.post("/tasks", taskData);
  return res.data;
};

export const updateTask = async (id, taskData) => {
  const res = await studyUrl.put(`/tasks/${id}`, taskData);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await studyUrl.delete(`/tasks/${id}`);
  return res.data;
};

// --- Daily Goals ---
export const getDailyGoals = async () => {
  const res = await studyUrl.get("/daily-goals");
  return res.data;
};

// --- Pomodoro ---
export const startPomodoro = async (pomodoroData) => {
  const res = await studyUrl.post("/pomodoro/start", pomodoroData);
  return res.data;
};

export const pausePomodoro = async (id) => {
  const res = await studyUrl.put(`/pomodoro/${id}/pause`);
  return res.data;
};

export const resumePomodoro = async (id) => {
  const res = await studyUrl.put(`/pomodoro/${id}/resume`);
  return res.data;
};

export const completePomodoro = async (id) => {
  const res = await studyUrl.put(`/pomodoro/${id}/complete`);
  return res.data;
};

export const cancelPomodoro = async (id) => {
  const res = await studyUrl.put(`/pomodoro/${id}/cancel`);
  return res.data;
};

export const getPomodoroElapsed = async (id) => {
  const res = await studyUrl.get(`/pomodoro/${id}/elapsed`);
  return res.data;
};

// --- Sessions ---
export const getStudySessions = async (params) => {
  // params for filtering e.g. { subject, dateRange }
  const res = await studyUrl.get("/sessions", { params });
  return res.data;
};

export const createStudySession = async (sessionData) => {
  const res = await studyUrl.post("/sessions", sessionData);
  return res.data;
};

export const updateStudySession = async (id, sessionData) => {
  const res = await studyUrl.put(`/sessions/${id}`, sessionData);
  return res.data;
};

export const deleteStudySession = async (id) => {
  const res = await studyUrl.delete(`/sessions/${id}`);
  return res.data;
};

// --- Settings ---
export const getStudySettings = async () => {
  const res = await studyUrl.get("/settings");
  return res.data;
};

export const updateStudySettings = async (settingsData) => {
  const res = await studyUrl.patch("/settings", settingsData);
  return res.data;
};
