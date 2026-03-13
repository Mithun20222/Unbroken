import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/tasks';

export const useTasks = () => {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (payload) => {
    const newTask = await api.createTask(payload);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const toggleToday = async (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completedToday = !t.completedToday;
        const delta = completedToday ? 1 : -1;
        const completedDays = t.progress.completedDays + delta;
        const percentage = Math.round((completedDays / t.progress.totalDays) * 100);
        return { ...t, completedToday, progress: { ...t.progress, completedDays, percentage } };
      })
    );
    await api.markToday(id);
    fetchTasks();
  };

  const stopTask = async (id) => {
    await api.stopTask(id);
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: 'stopped' } : t));
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, createTask, toggleToday, stopTask, deleteTask, refetch: fetchTasks };
};
