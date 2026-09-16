import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import * as studyApi from "../api/study.api";
import { fetchTasks } from "../store/study.slice";

export const useTasksLogic = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector((state) => state.study.tasks);
  const tasks = Array.isArray(tasksState) ? tasksState : (tasksState?.data || []);
  const [loading, setLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(fetchTasks()).unwrap();
    } catch (err) {
      toast.error(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const addTask = async (taskData) => {
    setLoading(true);
    try {
      await studyApi.createTask(taskData);
      toast.success("Task added!");
      await loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      await studyApi.updateTask(id, taskData);
      toast.success("Task updated!");
      await loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id) => {
    setLoading(true);
    try {
      await studyApi.deleteTask(id);
      toast.success("Task deleted!");
      await loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    loadTasks,
    addTask,
    updateTask,
    removeTask,
  };
};
