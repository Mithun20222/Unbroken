import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';

const COLORS = ['orange', 'violet', 'emerald', 'sky', 'rose'];
const ICONS = {
  gym: '🏋️', dsa: '🧠', coding: '💻', reading: '📚',
  meditation: '🧘', running: '🏃', default: '🎯',
};

const getIcon = (name) => {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(ICONS)) {
    if (key.includes(k)) return v;
  }
  return ICONS.default;
};

export default function TaskCard({ task, colorIndex = 0, onToggle, onStop, onDelete }) {
  const color   = COLORS[colorIndex % COLORS.length];
  const icon    = getIcon(task.name);
  const [menu, setMenu] = useState(false);

  const { progress, streak, completedToday, status } = task;
  const isStopped = status === 'stopped';
  const isFinished = task.duration_days && progress.completedDays >= task.duration_days;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-surface-2 rounded-2xl p-5
                 shadow-card card-glow
                 flex flex-col gap-4 overflow-hidden"
    >
      {completedToday && (
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-brand/10 blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => !isStopped && !isFinished && onToggle(task.id)}
            disabled={isStopped || isFinished}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
                        transition-all duration-200 select-none
                        ${completedToday
                          ? 'bg-brand shadow-glow scale-105'
                          : 'bg-white/6 hover:bg-white/10 border border-white/10'}
                        ${(isStopped || isFinished) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {completedToday ? '✓' : icon}
          </button>

          <div>
            <h3 className="font-display font-700 text-white text-base leading-none mb-1">
              {task.name}
            </h3>
            <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full
              ${isStopped ? 'bg-white/6 text-white/30'
                : isFinished ? 'bg-emerald-500/15 text-emerald-400'
                : task.duration_days ? 'bg-violet-500/15 text-violet-400'
                : 'bg-white/6 text-white/40'}`}
            >
              {isStopped ? 'Stopped' : isFinished ? 'Complete' : task.duration_days ? `${task.duration_days}d` : '∞ Infinite'}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenu((m) => !m)}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-white/30 hover:text-white/60 hover:bg-white/8 transition-all text-sm"
          >
            ⋮
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                className="absolute right-0 top-8 w-36 bg-surface-3 border border-white/10
                           rounded-xl shadow-2xl z-10 overflow-hidden"
              >
                {!isStopped && !task.duration_days && (
                  <button
                    onClick={() => { setMenu(false); onStop(task.id); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-body text-white/60
                               hover:bg-white/6 hover:text-white transition-all"
                  >
                    Stop task
                  </button>
                )}
                <button
                  onClick={() => { setMenu(false); onDelete(task.id); }}
                  className="w-full px-4 py-2.5 text-left text-sm font-body text-rose-400/70
                             hover:bg-rose-500/8 hover:text-rose-400 transition-all"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-2xl leading-none">{streak > 0 ? '🔥' : '💤'}</span>
        <div>
          <span className="font-mono text-xl font-500 text-white">{streak}</span>
          <span className="font-body text-xs text-white/40 ml-1">day streak</span>
        </div>
        {streak >= 7 && (
          <span className="ml-auto text-xs font-body px-2 py-0.5 rounded-full bg-brand/15 text-brand font-medium">
            🏆 Week!
          </span>
        )}
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="font-mono text-sm text-white/50">
            {progress.completedDays}
            <span className="text-white/25"> / {progress.totalDays}</span>
          </span>
          <span className={`font-mono text-sm font-500
            ${progress.percentage >= 80 ? 'text-emerald-400'
              : progress.percentage >= 50 ? 'text-brand'
              : 'text-white/50'}`}
          >
            {progress.percentage}%
          </span>
        </div>
        <ProgressBar percentage={progress.percentage} color={color} />
      </div>

      <p className="text-xs font-body text-white/25">
        Started {new Date(task.start_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </motion.div>
  );
}
