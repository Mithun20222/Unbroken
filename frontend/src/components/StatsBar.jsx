import { motion } from 'framer-motion';

const Stat = ({ label, value, sub, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    className="bg-surface-2 rounded-2xl px-5 py-4 shadow-card flex-1 min-w-0"
  >
    <p className="text-xs font-body text-white/35 uppercase tracking-widest mb-1">{label}</p>
    <p className="font-display text-2xl font-700 text-white leading-none">{value}</p>
    {sub && <p className="font-body text-xs text-white/35 mt-1">{sub}</p>}
  </motion.div>
);

export default function StatsBar({ tasks }) {
  const active   = tasks.filter((t) => t.status === 'active').length;
  const total    = tasks.length;

  const completedToday = tasks.filter((t) => t.completedToday && t.status === 'active').length;
  const rate = active > 0 ? Math.round((completedToday / active) * 100) : 0;

  const bestStreak = tasks.reduce((max, t) => Math.max(max, t.streak), 0);

  const avgProgress = active > 0
    ? Math.round(tasks.filter((t) => t.status === 'active').reduce((s, t) => s + t.progress.percentage, 0) / active)
    : 0;

  return (
    <div className="flex gap-3 flex-wrap">
      <Stat label="Active Tasks"    value={active}           sub={`${total} total`}         delay={0.05} />
      <Stat label="Done Today"      value={`${completedToday}/${active}`} sub={`${rate}% completion`} delay={0.1}  />
      <Stat label="Best Streak"     value={`${bestStreak}🔥`} sub="consecutive days"         delay={0.15} />
      <Stat label="Avg Progress"    value={`${avgProgress}%`} sub="across active tasks"      delay={0.2}  />
    </div>
  );
}
