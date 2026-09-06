'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  HiOutlineDocumentText, HiOutlineShieldCheck,
  HiOutlineClock, HiOutlineArrowUpTray
} from 'react-icons/hi2';

interface StatItem {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
  delay: number;
}

interface DocumentStatsRowProps {
  stats: {
    total: number;
    approved: number;
    underReview: number;
    draft: number;
    archived: number;
  };
}

function AnimatedValue({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 40));
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

export default function DocumentStatsRow({ stats }: DocumentStatsRowProps) {
  const { t } = useLocale();

  const items: StatItem[] = [
    {
      icon: <HiOutlineDocumentText className="w-5 h-5 text-white" />,
      label: t('documents', 'totalDocuments') || 'Total Documents',
      value: stats.total,
      color: 'from-purple-500 to-pink-500',
      delay: 0,
    },
    {
      icon: <HiOutlineShieldCheck className="w-5 h-5 text-white" />,
      label: t('documents', 'verified') || 'Hash Verified',
      value: stats.approved,
      color: 'from-emerald to-teal-500',
      delay: 0.1,
    },
    {
      icon: <HiOutlineClock className="w-5 h-5 text-white" />,
      label: t('documents', 'pendingReview') || 'Pending Review',
      value: stats.underReview + stats.draft,
      color: 'from-saffron to-orange-500',
      delay: 0.2,
    },
    {
      icon: <HiOutlineArrowUpTray className="w-5 h-5 text-white" />,
      label: t('documents', 'recentUploads') || 'Recent Uploads',
      value: stats.total > 3 ? 3 : stats.total,
      color: 'from-royal to-indigo-500',
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
          {/* Gradient accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted mb-1 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-heading mt-1 tabular-nums">
                <AnimatedValue value={item.value} />
              </p>
            </div>
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color}
              flex items-center justify-center shadow-lg relative
              group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
              {/* Live pulse */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
