import { motion } from 'framer-motion';

export default function Header({ onAdd }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <div className="flex items-center gap-2.5 mb-0.5">
          <span className="text-2xl select-none">🔥</span>
          <h1 className="font-display text-2xl font-800 text-white tracking-tight">
            Unbroken
          </h1>
        </div>
        <p className="font-body text-sm text-white/35 pl-9">{today}</p>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                   bg-brand hover:bg-brand-dim
                   text-white font-display font-600 text-sm
                   shadow-glow transition-all duration-200
                   active:scale-95"
      >
        <span className="text-base leading-none">+</span>
        New Task
      </button>
    </motion.header>
  );
}
