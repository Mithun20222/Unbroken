import { motion } from 'framer-motion';

const colorMap = {
  orange : { bar: '#f97316', glow: 'rgba(249,115,22,0.5)' },
  violet : { bar: '#a78bfa', glow: 'rgba(167,139,250,0.5)' },
  emerald: { bar: '#34d399', glow: 'rgba(52,211,153,0.5)'  },
  sky    : { bar: '#38bdf8', glow: 'rgba(56,189,248,0.5)'  },
  rose   : { bar: '#fb7185', glow: 'rgba(251,113,133,0.5)' },
};

export default function ProgressBar({ percentage = 0, color = 'orange', height = 6 }) {
  const { bar, glow } = colorMap[color] ?? colorMap.orange;
  const pct = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className="w-full rounded-full overflow-hidden bg-white/5"
      style={{ height }}
    >
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: bar,
          boxShadow: pct > 0 ? `0 0 8px ${glow}` : 'none',
        }}
      />
    </div>
  );
}
