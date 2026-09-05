'use client';

import { motion } from 'framer-motion';

const activities = [
  { id: 1, action: 'Gazette Notification Issued', project: 'Kutch Mega Solar Park', state: 'Gujarat', time: '2 hours ago', status: 'info' },
  { id: 2, action: 'Compensation Disbursed ₹12.5 Cr', project: 'Bengaluru-Chennai Expressway', state: 'Tamil Nadu', time: '4 hours ago', status: 'success' },
  { id: 3, action: 'Environmental Overlap Alert', project: 'Ken-Betwa River Link', state: 'Uttar Pradesh', time: '6 hours ago', status: 'warning' },
  { id: 4, action: 'Possession Transfer Complete', project: 'Western DFC', state: 'Gujarat', time: '8 hours ago', status: 'success' },
  { id: 5, action: 'Joint Measurement Scheduled', project: 'Delhi-Mumbai Expressway (Sec 4)', state: 'Maharashtra', time: '12 hours ago', status: 'info' },
  { id: 6, action: 'Deadline Overdue — Awaiting Approval', project: 'Ken-Betwa River Link', state: 'Uttar Pradesh', time: '1 day ago', status: 'danger' },
];

const statusColors: Record<string, string> = {
  success: 'bg-emerald',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-royal',
};

export default function RecentActivity({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-heading">{title}</h3>
        <span className="text-xs text-saffron cursor-pointer hover:underline">View All →</span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.08 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="mt-1.5 flex-shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${statusColors[item.status]} 
                ${item.status === 'danger' ? 'animate-pulse' : ''}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-heading font-medium leading-snug">{item.action}</p>
              <p className="text-xs text-muted mt-0.5 truncate">
                {item.project} • {item.state}
              </p>
            </div>
            <span className="text-[10px] text-muted whitespace-nowrap flex-shrink-0">
              {item.time}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
