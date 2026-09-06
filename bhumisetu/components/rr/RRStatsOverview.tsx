'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, ReactNode } from 'react';
import {
  HiOutlineUserGroup,
  HiOutlineHomeModern,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineShieldCheck,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

interface RRStats {
  total: number;
  displaced: number;
  affected: number;
  housingAllotted: number;
  housingEligible: number;
  housingPercent: number;
  jobDelivered: number;
  jobEligible: number;
  jobPercent: number;
  vulnerableCount: number;
  avgProgress: number;
  totalDbtCr: number;
}

interface StatItem {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  delay: number;
}

function AnimatedValue({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 35));
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
  return <>{display}</>;
}

export default function RRStatsOverview({ stats }: { stats: RRStats }) {
  const items: StatItem[] = [
    {
      icon: <HiOutlineUserGroup className="w-5 h-5 text-white" />,
      label: 'Affected Families',
      value: stats.total,
      sub: `${stats.displaced} Displaced · ${stats.affected} Affected`,
      color: 'from-purple-500 to-indigo-600',
      delay: 0,
    },
    {
      icon: <HiOutlineHomeModern className="w-5 h-5 text-white" />,
      label: 'Housing Allotment',
      value: `${stats.housingPercent}%`,
      sub: `${stats.housingAllotted} of ${stats.housingEligible} units delivered`,
      color: 'from-emerald to-teal-500',
      delay: 0.1,
    },
    {
      icon: <HiOutlineBriefcase className="w-5 h-5 text-white" />,
      label: 'Livelihood & Jobs',
      value: `${stats.jobPercent}%`,
      sub: `${stats.jobDelivered} of ${stats.jobEligible} packages handed`,
      color: 'from-saffron to-amber-600',
      delay: 0.2,
    },
    {
      icon: <HiOutlineCurrencyRupee className="w-5 h-5 text-white" />,
      label: 'DBT Disbursed',
      value: `₹${stats.totalDbtCr.toFixed(2)} Cr`,
      sub: 'Direct PFMS/Aadhaar bank credits',
      color: 'from-royal to-blue-600',
      delay: 0.3,
    },
    {
      icon: <HiOutlineShieldCheck className="w-5 h-5 text-white" />,
      label: 'SC/ST Vulnerable',
      value: stats.vulnerableCount,
      sub: 'Sec 41 Special 25% Higher Entitlement',
      color: 'from-rose-500 to-red-600',
      delay: 0.4,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 5-Card Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: item.delay }}
            className="glass rounded-2xl p-4 hover:surface-hover transition-all duration-300
              group cursor-pointer relative overflow-hidden shadow-sm"
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
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color}
                flex items-center justify-center shadow-md
                group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Statutory Compliance Gauge Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-black/5 dark:border-white/5"
      >
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-emerald flex items-center justify-center shrink-0 shadow-md">
            <HiOutlineArrowTrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-heading">
              RFCTLARR 2013 Statutory Compliance Index
            </h4>
            <p className="text-xs text-muted">
              Aggregate rehabilitation fulfillment rate across all active national infrastructure corridors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-80">
          <div className="flex-1 bg-black/10 dark:bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avgProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-saffron via-emerald to-royal"
            />
          </div>
          <span className="text-sm font-bold text-heading tabular-nums shrink-0">
            {stats.avgProgress}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
