
import supabase from '../models/supabase.js';

const today = () => new Date().toISOString().split('T')[0];
const daysBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.floor((e - s) / 86_400_000) + 1;
};

const calcProgress = (task, logs) => {
  const completedLogs = logs.filter((l) => l.completed);
  const completedDays = completedLogs.length;

  let totalDays;
  if (task.duration_days) {
    totalDays = task.duration_days;
  } else {
    totalDays = daysBetween(task.start_date, today());
  }

  const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  return { completedDays, totalDays, percentage };
};

const calcStreak = (logs) => {
  const completedSet = new Set(logs.filter((l) => l.completed).map((l) => l.date));

  let streak = 0;
  const cursor = new Date();

  while (true) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (completedSet.has(dateStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getTasks = async (_req, res) => {
  try {
    const { data: tasks, error: taskErr } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (taskErr) throw taskErr;

    const { data: logs, error: logErr } = await supabase
      .from('task_logs')
      .select('task_id, date, completed');

    if (logErr) throw logErr;

    const logsByTask = logs.reduce((acc, log) => {
      if (!acc[log.task_id]) acc[log.task_id] = [];
      acc[log.task_id].push(log);
      return acc;
    }, {});

    const enriched = tasks.map((task) => {
      const taskLogs = logsByTask[task.id] || [];
      const todayLog = taskLogs.find((l) => l.date === today());
      const progress = calcProgress(task, taskLogs);
      const streak = calcStreak(taskLogs);

      return {
        ...task,
        progress,
        streak,
        completedToday: todayLog?.completed ?? false,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { name, duration_days } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Task name is required' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        name: name.trim(),
        start_date: today(),
        duration_days: duration_days || null,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      ...data,
      progress: { completedDays: 0, totalDays: duration_days || 1, percentage: 0 },
      streak: 0,
      completedToday: false,
    });
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const markToday = async (req, res) => {
  try {
    const { id } = req.params;
    const dateStr = today();
    const { data: existing } = await supabase
      .from('task_logs')
      .select('*')
      .eq('task_id', id)
      .eq('date', dateStr)
      .maybeSingle();

    let log;
    if (existing) {
      const { data, error } = await supabase
        .from('task_logs')
        .update({ completed: !existing.completed })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      log = data;
    } else {
      const { data, error } = await supabase
        .from('task_logs')
        .insert({ task_id: id, date: dateStr, completed: true })
        .select()
        .single();
      if (error) throw error;
      log = data;
    }

    res.json(log);
  } catch (err) {
    console.error('markToday error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const stopTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'stopped' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('stopTask error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('task_logs').delete().eq('task_id', id);
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('deleteTask error:', err);
    res.status(500).json({ error: err.message });
  }
};
