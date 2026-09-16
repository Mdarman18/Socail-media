import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as studyApi from "../api/study.api";
import { fetchDailyGoals, fetchStudySettings } from "../store/study.slice";

export const useDailyGoalsLogic = () => {
  const dispatch = useDispatch();
  const goalsState = useSelector((state) => state.study.dailyGoals);
  const dailyGoals = Array.isArray(goalsState) ? goalsState : (goalsState?.data ? [goalsState.data] : []);
  const settingsState = useSelector((state) => state.study.settings);
  const settings = settingsState?.data || settingsState;
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(fetchDailyGoals()).unwrap(),
        dispatch(fetchStudySettings()).unwrap(),
      ]);
    } catch (err) {
      toast.error(err.message || "Failed to load daily goals or settings");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const updateSettings = async (settingsData) => {
    setLoading(true);
    try {
      await studyApi.updateStudySettings(settingsData);
      toast.success("Study settings updated!");
      await dispatch(fetchStudySettings()).unwrap();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return {
    dailyGoals,
    settings,
    loading,
    loadData,
    updateSettings,
  };
};
