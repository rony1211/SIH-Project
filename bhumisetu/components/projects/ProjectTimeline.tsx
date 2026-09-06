'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle, HiOutlineClock,
  HiOutlineEllipsisHorizontalCircle, HiOutlineUserCircle
} from 'react-icons/hi2';

interface Milestone {
  section: string;
  title: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  officer: string;
  remarks: string;
}

interface ProjectTimelineProps {
  milestones: Milestone[];
}

const statusConfig: Record<string, { icon: typeof HiOutlineCheckCircle; color: string; bg: string; line: string }> = {
  completed: {
    icon: HiOutlineCheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/50',
    line: 'bg-emerald-500',
  },
  'in-progress': {
    icon: HiOutlineClock,
    color: 'text-saffron',
    bg: 'bg-saffron/20 border-saffron/50',
    line: 'bg-saffron',
  },
  pending: {
    icon: HiOutlineEllipsisHorizontalCircle,
    color: 'text-gray-400 dark:text-gray-500',
    bg: 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10',
    line: 'bg-black/10 dark:bg-white/10',
  },
};

const formatDate = (d: string | null) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export default function ProjectTimeline({ milestones }: ProjectTimelineProps) {
  return (
    <div className="relative">
      {milestones.map((m, i) => {
        const cfg = statusConfig[m.status] || statusConfig.pending;
        const Icon = cfg.icon;
        const isLast = i === milestones.length - 1;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex gap-4 relative"
          >
            {/* Timeline Connector */}
            <div className="flex flex-col items-center w-10 flex-shrink-0">
              <div className={`w-10 h-10 rounded-xl border-2 ${cfg.bg} flex items-center justify-center
                relative z-10 ${m.status === 'in-progress' ? 'animate-pulse' : ''}`}>
                <Icon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[40px] ${cfg.line} my-1`} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
              <div className={`glass rounded-xl p-4 ${m.status === 'in-progress' ? 'ring-1 ring-saffron/30' : ''}`}>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
                      {m.section}
                    </span>
                    <h4 className="text-sm font-semibold text-heading mt-0.5">
                      {m.title}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider
                    ${m.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400'
                      : m.status === 'in-progress' ? 'bg-saffron/15 text-saffron'
                      : 'bg-black/5 dark:bg-white/5 text-muted'
                    }`}>
                    {m.status === 'in-progress' ? 'In Progress' : m.status}
                  </span>
                </div>

                {/* Date Row */}
                <div className="flex items-center gap-4 text-[11px] text-muted mb-2">
                  <span>
                    Start: <span className="text-heading font-medium">{formatDate(m.startDate)}</span>
                  </span>
                  <span>
                    End: <span className="text-heading font-medium">{formatDate(m.endDate)}</span>
                  </span>
                </div>

                {/* Officer */}
                {m.officer && m.officer !== '—' && (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted mb-2">
                    <HiOutlineUserCircle className="w-3.5 h-3.5" />
                    <span>{m.officer}</span>
                  </div>
                )}

                {/* Remarks */}
                {m.remarks && m.remarks !== '—' && (
                  <p className="text-[11px] text-body leading-relaxed mt-1 pl-3 border-l-2
                    border-black/10 dark:border-white/10 italic">
                    {m.remarks}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
