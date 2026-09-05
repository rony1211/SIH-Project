'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const initialActivities = [
  { id: 1, action: 'Gazette Notification Issued', project: 'Kutch Mega Solar Park', state: 'Gujarat', time: '2 mins ago', status: 'info' },
  { id: 2, action: 'Compensation Disbursed ₹12.5 Cr', project: 'Bengaluru-Chennai Expressway', state: 'Tamil Nadu', time: '15 mins ago', status: 'success' },
  { id: 3, action: 'Environmental Overlap Alert', project: 'Ken-Betwa River Link', state: 'Uttar Pradesh', time: '1 hour ago', status: 'warning' },
  { id: 4, action: 'Possession Transfer Complete', project: 'Western DFC', state: 'Gujarat', time: '3 hours ago', status: 'success' },
  { id: 5, action: 'Joint Measurement Scheduled', project: 'Delhi-Mumbai Expressway (Sec 4)', state: 'Maharashtra', time: '5 hours ago', status: 'info' },
];

const mockNewEvents = [
  { action: 'Land Parcel Survey Completed', project: 'Navi Mumbai Airport', state: 'Maharashtra', status: 'success' },
  { action: 'Grievance Resolved', project: 'Zojila Tunnel Approach', state: 'J&K', status: 'info' },
  { action: 'Social Impact Assessment Filed', project: 'Pune Metro Line 3', state: 'Maharashtra', status: 'info' },
  { action: 'Disbursement Blocked - Bank Issue', project: 'Agra-Lucknow Expressway', state: 'Uttar Pradesh', status: 'danger' },
  { action: 'SIA Overdue Alert', project: 'Polavaram Irrigation Project', state: 'Andhra Pradesh', status: 'warning' },
];

const statusColors: Record<string, string> = {
  success: 'bg-emerald',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-royal',
};

export default function RecentActivity({ title }: { title: string }) {
  const [activities, setActivities] = useState(initialActivities);

  useEffect(() => {
    let counter = 6;
    const interval = setInterval(() => {
      setActivities(prev => {
        // Pick a random event from our mock pool
        const randomEvent = mockNewEvents[Math.floor(Math.random() * mockNewEvents.length)];
        const newEvent = {
          ...randomEvent,
          id: counter++,
          time: 'Just now',
        };
        // Add to top, keep only latest 6
        return [newEvent, ...prev].slice(0, 6);
      });
    }, 6000); // New event every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
          {title}
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        </h3>
        <span className="text-xs text-saffron cursor-pointer hover:underline">View All →</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {activities.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-colors group"
            >
              <div className="mt-1.5 flex-shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[item.status]} 
                  ${item.status === 'danger' ? 'animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-heading font-medium leading-snug">{item.action}</p>
                <p className="text-xs text-muted mt-0.5 truncate">
                  {item.project} • {item.state}
                </p>
              </div>
              <span className="text-[10px] text-muted whitespace-nowrap flex-shrink-0 font-medium">
                {item.time}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
