'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import {
  HiOutlineFolder, HiOutlineGlobeAlt,
  HiOutlineBanknotes, HiOutlineExclamationTriangle
} from 'react-icons/hi2';

interface StatItem {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  delay: number;
}

interface ProjectStatsHeaderProps {
  stats: {
    totalProjects: number;
    totalAreaHa: number;
    acquiredAreaHa: number;
    totalBudgetCr: number;
    totalSpentCr: number;
    criticalBottlenecks: number;
  };
}

function AnimatedNum({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 50));
    const animate = () => {
      start += step;
      if (start < value) {
        setDisplay(start);
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };
    animate();
  }, [value]);

  return (
    <>
      {prefix}{display.toLocaleString('en-IN')}{suffix}
    </>
  );
}

export default function ProjectStatsHeader({ stats }: ProjectStatsHeaderProps) {
  const acquiredPct = stats.totalAreaHa > 0
    ? Math.round((stats.acquiredAreaHa / stats.totalAreaHa) * 100) : 0;

  const items: StatItem[] = [
    {
      icon: <HiOutlineFolder className="w-5 h-5 text-white" />,
      label: 'Active Projects',
      value: String(stats.totalProjects),
      sub: 'Across India',
      color: 'from-purple-500 to-violet-600',
      delay: 0,
    },
    {
      icon: <HiOutlineGlobeAlt className="w-5 h-5 text-white" />,
      label: 'Land Acquired',
      value: `${acquiredPct}%`,
      sub: `${stats.acquiredAreaHa.toLocaleString('en-IN')} of ${stats.totalAreaHa.toLocaleString('en-IN')} Ha`,
      color: 'from-emerald to-teal-500',
      delay: 0.1,
    },
    {
      icon: <HiOutlineBanknotes className="w-5 h-5 text-white" />,
      label: 'Budget Allocated',
      value: `₹${stats.totalBudgetCr.toLocaleString('en-IN')} Cr`,
      sub: `₹${stats.totalSpentCr.toLocaleString('en-IN')} Cr disbursed`,
      color: 'from-royal to-indigo-600',
      delay: 0.2,
    },
    {
      icon: <HiOutlineExclamationTriangle className="w-5 h-5 text-white" />,
      label: 'Critical Bottlenecks',
      value: String(stats.criticalBottlenecks),
      sub: 'Require immediate action',
      color: 'from-red-500 to-rose-600',
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: item.delay }}
          className="glass rounded-2xl p-5 hover:surface-hover transition-all duration-300
            group cursor-pointer relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted mb-1 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-heading mt-1 tabular-nums">
                {item.value}
              </p>
              {item.sub && (
                <p className="text-[11px] text-muted mt-1">{item.sub}</p>
              )}
            </div>
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color}
              flex items-center justify-center shadow-lg relative
              group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
              {item.label === 'Critical Bottlenecks' && stats.criticalBottlenecks > 0 && (
                <>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                </>
              )}
            </div>
          </div>

          {/* Progress bar for Land Acquired */}
          {item.label === 'Land Acquired' && (
            <div className="mt-3">
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${acquiredPct}%` }}
                  transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
