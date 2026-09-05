'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StateRowProps {
  name: string;
  projects: number;
  notified: number;
  acquired: number;
  progress: number;
  delay: number;
}

function StateRow({ name, projects, notified, acquired, progress, delay }: StateRowProps) {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [currentAcquired, setCurrentAcquired] = useState(acquired);

  useEffect(() => {
    // Random chance to increase progress slightly every 5 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && currentProgress < 100) {
        const increase = Math.floor(Math.random() * 2) + 1;
        const newProgress = Math.min(100, currentProgress + increase);
        setCurrentProgress(newProgress);
        setCurrentAcquired(Math.floor((notified * newProgress) / 100));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentProgress, notified]);

  const progressColor =
    currentProgress >= 80 ? 'bg-emerald' :
    currentProgress >= 60 ? 'bg-saffron' :
    currentProgress >= 40 ? 'bg-warning' : 'bg-danger';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors"
    >
      <td className="py-3 px-4 text-sm text-heading font-medium">{name}</td>
      <td className="py-3 px-4 text-sm text-body text-center">{projects}</td>
      <td className="py-3 px-4 text-sm text-body text-right">{notified.toLocaleString('en-IN')}</td>
      <td className="py-3 px-4 text-sm text-body text-right tabular-nums transition-all duration-500">
        {currentAcquired.toLocaleString('en-IN')}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
              className={`h-full rounded-full ${progressColor} transition-all duration-1000`}
            />
          </div>
          <span className="text-xs text-muted w-9 text-right tabular-nums transition-all duration-500">
            {currentProgress}%
          </span>
        </div>
      </td>
    </motion.tr>
  );
}

const initialStates = [
  { name: 'Gujarat', projects: 32, notified: 8500, acquired: 7200, progress: 85 },
  { name: 'Tamil Nadu', projects: 28, notified: 6200, acquired: 5100, progress: 82 },
  { name: 'Maharashtra', projects: 45, notified: 12500, acquired: 9800, progress: 78 },
  { name: 'Rajasthan', projects: 22, notified: 7800, acquired: 5200, progress: 67 },
  { name: 'Uttar Pradesh', projects: 68, notified: 21000, acquired: 15400, progress: 62 },
  { name: 'Karnataka', projects: 41, notified: 9400, acquired: 6800, progress: 55 },
  { name: 'Madhya Pradesh', projects: 35, notified: 11200, acquired: 7600, progress: 50 },
  { name: 'West Bengal', projects: 18, notified: 4500, acquired: 3100, progress: 45 },
];

export default function StateTable({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-6 overflow-hidden relative"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
          {title}
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-saffron/80 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron"></span>
          </span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="text-left py-2 px-4 text-xs text-muted uppercase tracking-wider">State</th>
              <th className="text-center py-2 px-4 text-xs text-muted uppercase tracking-wider">Projects</th>
              <th className="text-right py-2 px-4 text-xs text-muted uppercase tracking-wider">Notified (Ha)</th>
              <th className="text-right py-2 px-4 text-xs text-muted uppercase tracking-wider">Acquired (Ha)</th>
              <th className="py-2 px-4 text-xs text-muted uppercase tracking-wider w-40">Progress</th>
            </tr>
          </thead>
          <tbody>
            {initialStates.map((s, i) => (
              <StateRow key={s.name} {...s} delay={0.3 + i * 0.06} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
