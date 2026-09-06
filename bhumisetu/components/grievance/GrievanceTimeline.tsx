'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationTriangle,
  HiOutlineUserCircle, HiOutlineArrowPath
} from 'react-icons/hi2';

interface TimelineEvent {
  timestamp: string;
  status: string;
  actor: string;
  note: string;
}

interface GrievanceTimelineProps {
  events: TimelineEvent[];
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof HiOutlineCheckCircle }> = {
  Filed: { color: 'text-sky-400', bg: 'bg-sky-500/20 border-sky-500/50', icon: HiOutlineClock },
  Acknowledged: { color: 'text-indigo-400', bg: 'bg-indigo-500/20 border-indigo-500/50', icon: HiOutlineCheckCircle },
  'Under Review': { color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/50', icon: HiOutlineArrowPath },
  Assigned: { color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/50', icon: HiOutlineUserCircle },
  'In Progress': { color: 'text-saffron', bg: 'bg-saffron/20 border-saffron/50', icon: HiOutlineClock },
  Escalated: { color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/50', icon: HiOutlineExclamationTriangle },
  Resolved: { color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/50', icon: HiOutlineCheckCircle },
  Closed: { color: 'text-teal-400', bg: 'bg-teal-500/20 border-teal-500/50', icon: HiOutlineCheckCircle },
};

const formatDateTime = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

export default function GrievanceTimeline({ events }: GrievanceTimelineProps) {
  return (
    <div className="relative">
      {events.map((ev, i) => {
        const cfg = statusConfig[ev.status] || statusConfig.Filed;
        const Icon = cfg.icon;
        const isLast = i === events.length - 1;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex gap-3 relative"
          >
            {/* Connector */}
            <div className="flex flex-col items-center w-8 flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg border-2 ${cfg.bg} flex items-center justify-center
                relative z-10 ${ev.status === 'Escalated' ? 'animate-pulse' : ''}`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[24px] ${
                  ev.status === 'Escalated' ? 'bg-red-500' : 'bg-black/10 dark:bg-white/10'
                } my-0.5`} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-4 ${isLast ? '' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-xs font-bold ${cfg.color}`}>{ev.status}</span>
                  <p className="text-[11px] text-muted mt-0.5">{formatDateTime(ev.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted mt-1">
                <HiOutlineUserCircle className="w-3 h-3" />
                <span>{ev.actor}</span>
              </div>
              {ev.note && (
                <p className="text-[11px] text-body mt-1 pl-2 border-l-2 border-black/10 dark:border-white/10 italic">
                  {ev.note}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
