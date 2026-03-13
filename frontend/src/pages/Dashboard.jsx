import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useTasks }   from '../hooks/useTasks';
import Header         from '../components/Header';
import StatsBar       from '../components/StatsBar';
import TaskCard       from '../components/TaskCard';
import AddTaskModal   from '../components/AddTaskModal';
import EmptyState     from '../components/EmptyState';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { tasks, loading, error, createTask, toggleToday, deleteTask } = useTasks();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2 border-brand/30 border-t-brand"
          />
          <p className="font-body text-sm text-white/30">Loading your tasks…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-display text-white text-lg mb-1">Something went wrong</p>
          <p className="font-body text-white/40 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter((t) => t.status === 'active');

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full bg-brand/5 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Header onAdd={() => setModalOpen(true)} />

        {tasks.length > 0 && (
          <div className="mb-8">
            <StatsBar tasks={tasks} />
          </div>
        )}

        {tasks.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-xs text-white/30 uppercase tracking-widest mb-3"
          >
            Active · {activeTasks.length}
          </motion.p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <AnimatePresence mode="popLayout">
            {activeTasks.length > 0
              ? activeTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    colorIndex={i}
                    onToggle={toggleToday}
                    onDelete={deleteTask}
                  />
                ))
              : (
                  <EmptyState key="empty" onAdd={() => setModalOpen(true)} />
                )
            }
          </AnimatePresence>
        </div>

        <footer className="mt-16 text-center">
          <p className="font-body text-xs text-white/15">
            Stay consistent. Stay unbroken.
          </p>
        </footer>
      </main>

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createTask}
      />
    </div>
  );
}