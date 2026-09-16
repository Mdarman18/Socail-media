import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as studyApi from "../api/study.api";

export const fetchTasks = createAsyncThunk("study/fetchTasks", async () => {
  const response = await studyApi.getTasks();
  return response.data || response.tasks || response; // defensive
});

export const fetchDailyGoals = createAsyncThunk("study/fetchDailyGoals", async () => {
  const response = await studyApi.getDailyGoals();
  return response.data || response.goals || response;
});

export const fetchStudySessions = createAsyncThunk("study/fetchStudySessions", async (params) => {
  const response = await studyApi.getStudySessions(params);
  return response.data || response.sessions || response;
});

export const fetchStudySettings = createAsyncThunk("study/fetchStudySettings", async () => {
  const response = await studyApi.getStudySettings();
  return response.data || response.settings || response;
});

export const studySlice = createSlice({
  name: "study",
  initialState: {
    tasks: [],
    dailyGoals: [],
    sessions: [],
    settings: {
      dailyGoalMinutes: 120,
      weeklyGoalMinutes: 840,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
    },
    pomodoro: {
      activeSession: null,
      elapsedSeconds: 0,
      status: "idle", // idle, running, paused, completed, cancelled
    },
    loading: false,
    error: null,
  },
  reducers: {
    setPomodoroSession: (state, action) => {
      state.pomodoro.activeSession = action.payload;
      state.pomodoro.status = action.payload?.status || "idle";
    },
    setPomodoroStatus: (state, action) => {
      state.pomodoro.status = action.payload;
    },
    setPomodoroElapsed: (state, action) => {
      state.pomodoro.elapsedSeconds = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Daily Goals
    builder.addCase(fetchDailyGoals.fulfilled, (state, action) => {
      state.dailyGoals = action.payload;
    });

    // Sessions
    builder.addCase(fetchStudySessions.fulfilled, (state, action) => {
      state.sessions = action.payload;
    });

    // Settings
    builder.addCase(fetchStudySettings.fulfilled, (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    });
  },
});

export const { setPomodoroSession, setPomodoroStatus, setPomodoroElapsed } = studySlice.actions;

export const studyReducer = studySlice.reducer;
