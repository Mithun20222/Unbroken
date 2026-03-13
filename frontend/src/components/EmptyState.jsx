import { motion } from 'framer-motion';
export default function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="col-span-full flex flex-col items-center justify-center
                 py-24 text-center"
    >
      <div className="text-6xl mb-5 select-none">🔥</div>
      <h3 className="font-display text-2xl font-700 text-white mb-2">
        Nothing tracked yet
      </h3>
      <p className="font-body text-white/40 text-sm max-w-xs mb-8">
        Add your first task and start building an unbroken chain of consistency.
      </p>
      <button
        onClick={onAdd}
        className="px-6 py-3 rounded-xl bg-brand text-white font-display font-600 text-sm
                   hover:bg-brand-dim transition-all shadow-glow"
      >
        + Add Your First Task
      </button>
    </motion.div>
  );
}
