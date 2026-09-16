import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as studyApi from "../api/study.api";
import { setPomodoroSession, setPomodoroStatus, setPomodoroElapsed } from "../store/study.slice";

export const usePomodoroLogic = () => {
  const dispatch = useDispatch();
  const { activeSession, elapsedSeconds, status } = useSelector((state) => state.study.pomodoro);
  const [loading, setLoading] = useState(false);

  // Poll elapsed time if running
  useEffect(() => {
    let interval;
    if (status === "running" && activeSession?._id) {
      interval = setInterval(async () => {
        try {
          const data = await studyApi.getPomodoroElapsed(activeSession._id);
          dispatch(setPomodoroElapsed(data.elapsedSeconds || 0));
        } catch (err) {
          console.error("Failed to fetch elapsed time", err);
        }
      }, 5000); // sync every 5 seconds
    }
    return () => clearInterval(interval);
  }, [status, activeSession?._id, dispatch]);

  const startSession = async (pomodoroData) => {
    setLoading(true);
    try {
      const data = await studyApi.startPomodoro(pomodoroData);
      dispatch(setPomodoroSession(data.data || data.session || data));
      toast.success("Pomodoro session started!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start session");
    } finally {
      setLoading(false);
    }
  };

  const pauseSession = async () => {
    if (!activeSession?._id) return;
    setLoading(true);
    try {
      const data = await studyApi.pausePomodoro(activeSession._id);
      dispatch(setPomodoroStatus("paused"));
      toast.success("Session paused");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to pause session");
    } finally {
      setLoading(false);
    }
  };

  const resumeSession = async () => {
    if (!activeSession?._id) return;
    setLoading(true);
    try {
      const data = await studyApi.resumePomodoro(activeSession._id);
      dispatch(setPomodoroStatus("running"));
      toast.success("Session resumed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resume session");
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async () => {
    if (!activeSession?._id) return;
    setLoading(true);
    try {
      const data = await studyApi.completePomodoro(activeSession._id);
      dispatch(setPomodoroStatus("completed"));
      const actualMinutes = data.actualMinutes || data.session?.actualMinutes || 0;
      toast.success(`Session completed! You studied for ${actualMinutes} minutes.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete session");
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async () => {
    if (!activeSession?._id) return;
    setLoading(true);
    try {
      await studyApi.cancelPomodoro(activeSession._id);
      dispatch(setPomodoroSession(null));
      toast.success("Session cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel session");
    } finally {
      setLoading(false);
    }
  };

  return {
    activeSession,
    elapsedSeconds,
    status,
    loading,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
  };
};
