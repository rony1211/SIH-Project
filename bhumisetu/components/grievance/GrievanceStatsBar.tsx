'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import {
  HiOutlineMegaphone, HiOutlineCheckCircle,
  HiOutlineClock, HiOutlineExclamationTriangle, HiOutlineChartBar
} from 'react-icons/hi2';

interface Stats {
  total: number;
  filed: number;
  inProgress: number;
  escalated: number;
  resolved: number;
  avgResolutionDays: number;
}

interface StatItem {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  delay: number;
  pulse?: boolean;
}

function AnimatedValue({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 40));
    const animate = () => {
      start += step;
      if (start < value) { setDisplay(start); requestAnimationFrame(animate); }
      else setDisplay(value);
    };
    animate();
  }, [value]);
  return <>{display}</>;
}

export default function GrievanceStatsBar({ stats }: { stats: Stats }) {
  const items: StatItem[] = [
    {
      icon: <HiOutlineMegaphone className="w-5 h-5 text-white" />,
      label: 'Total Complaints',
      value: stats.total,
      color: 'from-purple-500 to-violet-600',
      delay: 0,
    },
    {
      icon: <HiOutlineCheckCircle className="w-5 h-5 text-white" />,
      label: 'Resolved & Closed',
      value: stats.resolved,
      sub: `${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate`,
      color: 'from-emerald to-teal-500',
      delay: 0.1,
    },
    {
      icon: <HiOutlineClock className="w-5 h-5 text-white" />,
      label: 'Active / In Progress',
      value: stats.inProgress + stats.filed,
      color: 'from-saffron to-orange-500',
      delay: 0.2,
    },
    {
      icon: <HiOutlineExclamationTriangle className="w-5 h-5 text-white" />,
      label: 'SLA Escalated',
      value: stats.escalated,
      sub: 'Require immediate action',
      color: 'from-red-500 to-rose-600',
      delay: 0.3,
      pulse: stats.escalated > 0,
    },
    {
      icon: <HiOutlineChartBar className="w-5 h-5 text-white" />,
      label: 'Avg Resolution',
      value: `${stats.avgResolutionDays}d`,
      sub: 'SLA target: 30 days',
      color: 'from-royal to-indigo-600',
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: item.delay }}
          className="glass rounded-2xl p-4 hover:surface-hover transition-all duration-300
            group cursor-pointer relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-muted mb-1 uppercase tracking-wider">{item.label}</p>
              <p className="text-xl md:text-2xl font-bold text-heading mt-1 tabular-nums">
                {typeof item.value === 'number' ? <AnimatedValue value={item.value} /> : item.value}
              </p>
              {item.sub && <p className="text-[10px] text-muted mt-0.5">{item.sub}</p>}
            </div>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color}
              flex items-center justify-center shadow-lg relative
              group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
              {item.pulse && (
                <>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
