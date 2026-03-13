import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESETS = [
  { label: "Gym", icon: "🏋️", duration: null },
  { label: "DSA", icon: "🧠", duration: 30 },
  { label: "Coding", icon: "💻", duration: null },
  { label: "Reading", icon: "📚", duration: 21 },
  { label: "Meditation", icon: "🧘", duration: null },
  { label: "Running", icon: "🏃", duration: null },
];

export default function AddTaskModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [isFixed, setIsFixed] = useState(false);
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setIsFixed(false);
    setDays("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const applyPreset = (p) => {
    setName(p.label);
    if (p.duration) {
      setIsFixed(true);
      setDays(String(p.duration));
    } else {
      setIsFixed(false);
      setDays("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Task name is required.");
    if (isFixed && (!days || Number(days) < 1))
      return setError("Enter a valid number of days.");

    setLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        duration_days: isFixed ? Number(days) : null,
      });
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0
                        sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:right-auto
                        sm:-translate-x-1/2 sm:-translate-y-1/2
                        w-full sm:w-[480px] z-50
                        bg-surface-2 rounded-t-3xl sm:rounded-2xl
                        shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_32px_64px_rgba(0,0,0,0.7)]
                        max-h-[85vh] overflow-y-auto
                      "
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-700 text-white">
                  New Task
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center
                             text-white/50 hover:text-white hover:bg-white/12 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="mb-5">
                <p className="text-xs font-body text-white/40 uppercase tracking-widest mb-2">
                  Quick presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-white/6 border border-white/10 text-sm text-white/70
                                 hover:bg-brand/10 hover:border-brand/40 hover:text-white
                                 transition-all font-body"
                    >
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-body text-white/40 uppercase tracking-widest mb-1.5">
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gym, DSA, Journaling…"
                    className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3
                               text-white placeholder-white/25 font-body text-sm
                               focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30
                               transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-body text-white/40 uppercase tracking-widest mb-2">
                    Duration
                  </label>
                  <div className="flex gap-2">
                    {[
                      { key: false, label: "∞ Infinite" },
                      { key: true, label: "Fixed days" },
                    ].map(({ key, label }) => (
                      <button
                        key={String(key)}
                        type="button"
                        onClick={() => setIsFixed(key)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-body font-medium transition-all
                          ${
                            isFixed === key
                              ? "bg-brand/15 border-brand/50 text-brand"
                              : "bg-white/4 border-white/10 text-white/50 hover:text-white/70 hover:border-white/20"
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {isFixed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-xs font-body text-white/40 uppercase tracking-widest mb-1.5">
                        Number of Days
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3
                                   text-white placeholder-white/25 font-mono text-sm
                                   focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30
                                   transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <p className="text-rose-400 text-sm font-body">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand text-white font-display font-600 text-sm
                             hover:bg-brand-dim transition-all shadow-glow
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating…" : "Create Task"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
