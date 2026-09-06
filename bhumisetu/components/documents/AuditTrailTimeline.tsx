'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineArrowUpTray, HiOutlineEye, HiOutlineCheckCircle,
  HiOutlineXCircle, HiOutlineShieldCheck
} from 'react-icons/hi2';

interface AuditEvent {
  timestamp: string;
  actor: string;
  action: string;
  type: 'upload' | 'review' | 'approval' | 'rejection' | 'verification';
}

interface AuditTrailTimelineProps {
  events: AuditEvent[];
}

const typeConfig: Record<string, { color: string; gradient: string; icon: React.ElementType }> = {
  upload: { color: 'text-royal', gradient: 'from-royal to-indigo-500', icon: HiOutlineArrowUpTray },
  review: { color: 'text-saffron', gradient: 'from-saffron to-orange-500', icon: HiOutlineEye },
  approval: { color: 'text-emerald', gradient: 'from-emerald to-teal-500', icon: HiOutlineCheckCircle },
  rejection: { color: 'text-danger', gradient: 'from-danger to-rose-500', icon: HiOutlineXCircle },
  verification: { color: 'text-emerald', gradient: 'from-emerald to-cyan-500', icon: HiOutlineShieldCheck },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AuditTrailTimeline({ events }: AuditTrailTimelineProps) {
  return (
    <div className="relative pl-6">
      {/* Vertical connecting line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b
        from-royal via-saffron to-emerald opacity-30" />

      {events.map((event, index) => {
        const config = typeConfig[event.type] || typeConfig.upload;
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="relative pb-5 last:pb-0"
          >
            {/* Dot on the timeline */}
            <div className="absolute -left-6 top-1 z-10">
              <div className={`w-[22px] h-[22px] rounded-full bg-gradient-to-br ${config.gradient}
                flex items-center justify-center shadow-lg relative`}>
                <Icon className="w-3 h-3 text-white" />
                {/* Pulse for latest event */}
                {isLast && (
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient}
                    animate-ping opacity-30`} />
                )}
              </div>
            </div>

            {/* Event card */}
            <div className="glass rounded-xl p-3 ml-2 hover:surface-hover transition-all duration-200
              border border-transparent hover:border-black/5 dark:hover:border-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-heading leading-snug">{event.action}</p>
                  <p className="text-xs text-muted mt-1">{event.actor}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-muted">{formatDate(event.timestamp)}</p>
                  <p className="text-[10px] text-muted opacity-70">{formatTime(event.timestamp)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
