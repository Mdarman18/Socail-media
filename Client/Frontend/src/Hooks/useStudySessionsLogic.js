import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as studyApi from "../api/study.api";
import { fetchStudySessions } from "../store/study.slice";

export const useStudySessionsLogic = () => {
  const dispatch = useDispatch();
  const sessionsState = useSelector((state) => state.study.sessions);
  const sessions = Array.isArray(sessionsState) ? sessionsState : (sessionsState?.data || []);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      await dispatch(fetchStudySessions(params)).unwrap();
    } catch (err) {
      toast.error(err.message || "Failed to load study sessions");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logManualSession = async (sessionData) => {
    setLoading(true);
    try {
      await studyApi.createStudySession(sessionData);
      toast.success("Manual session logged successfully!");
      await loadSessions(); // reload list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log session");
    } finally {
      setLoading(false);
    }
  };

  const editSession = async (id, sessionData) => {
    setLoading(true);
    try {
      await studyApi.updateStudySession(id, sessionData);
      toast.success("Session updated successfully!");
      await loadSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update session");
    } finally {
      setLoading(false);
    }
  };

  const removeSession = async (id) => {
    setLoading(true);
    try {
      await studyApi.deleteStudySession(id);
      toast.success("Session removed");
      await loadSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete session");
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    loading,
    loadSessions,
    logManualSession,
    editSession,
    removeSession,
  };
};
