'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import {
  HiOutlineUserGroup, HiOutlineShieldCheck,
  HiOutlineDocumentCheck, HiOutlineTrophy, HiOutlineFire
} from 'react-icons/hi2';

interface Stats {
  totalOfficers: number;
  avgSlaCompliance: number;
  totalCasesMonth: number;
  topPerformerName: string;
  topPerformerXp: number;
  activeStreaks: number;
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

export default function OfficerStatsHeader({ stats }: { stats: Stats }) {
  const items: StatItem[] = [
    {
      icon: <HiOutlineUserGroup className="w-5 h-5 text-white" />,
      label: 'Total Officers',
      value: stats.totalOfficers,
      sub: 'Active across India',
      color: 'from-purple-500 to-violet-600',
      delay: 0,
    },
    {
      icon: <HiOutlineShieldCheck className="w-5 h-5 text-white" />,
      label: 'Avg SLA Compliance',
      value: `${stats.avgSlaCompliance}%`,
      sub: 'National average',
      color: 'from-emerald to-teal-500',
      delay: 0.1,
    },
    {
      icon: <HiOutlineDocumentCheck className="w-5 h-5 text-white" />,
      label: 'Cases This Month',
      value: stats.totalCasesMonth,
      sub: 'Across all officers',
      color: 'from-saffron to-orange-500',
      delay: 0.2,
    },
    {
      icon: <HiOutlineTrophy className="w-5 h-5 text-white" />,
      label: 'Top Performer',
      value: stats.topPerformerXp,
      sub: stats.topPerformerName,
      color: 'from-amber-400 to-yellow-500',
      delay: 0.3,
      pulse: true,
    },
    {
      icon: <HiOutlineFire className="w-5 h-5 text-white" />,
      label: 'Active Streaks',
      value: stats.activeStreaks,
      sub: '7+ day streaks',
      color: 'from-red-500 to-rose-600',
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
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
