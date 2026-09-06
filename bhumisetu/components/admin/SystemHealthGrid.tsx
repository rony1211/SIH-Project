'use client';

import { motion } from 'framer-motion';
import { 
  HiOutlineServerStack, 
  HiOutlineGlobeAlt, 
  HiOutlineUsers, 
  HiOutlineArrowPathRoundedSquare 
} from 'react-icons/hi2';

interface HealthStats {
  status: string;
  uptime: string;
  apiLatency: string;
  dbLoad: string;
  activeUsers: number;
  syncSuccessRate: string;
}

export default function SystemHealthGrid({ health }: { health: HealthStats }) {
  const cards = [
    {
      title: 'Server Uptime',
      value: health.uptime,
      icon: <HiOutlineServerStack className="w-5 h-5 text-emerald-500" />,
      subtext: 'Core Systems Operational',
      color: 'from-emerald-500/10 to-transparent border-emerald-500/20'
    },
    {
      title: 'API Latency',
      value: health.apiLatency,
      icon: <HiOutlineGlobeAlt className="w-5 h-5 text-blue-500" />,
      subtext: 'Average Response Time',
      color: 'from-blue-500/10 to-transparent border-blue-500/20'
    },
    {
      title: 'Active Sessions',
      value: health.activeUsers,
      icon: <HiOutlineUsers className="w-5 h-5 text-saffron" />,
      subtext: 'Connected Field Officers',
      color: 'from-orange-500/10 to-transparent border-orange-500/20'
    },
    {
      title: 'Offline Sync Rate',
      value: health.syncSuccessRate,
      icon: <HiOutlineArrowPathRoundedSquare className="w-5 h-5 text-indigo-500" />,
      subtext: 'Conflict Resolution Success',
      color: 'from-indigo-500/10 to-transparent border-indigo-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`glass rounded-2xl p-5 border-t border-t-white/10 dark:border-t-white/5 relative overflow-hidden group`}
        >
          {/* Subtle Background Gradient */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 -mr-10 -mt-10 pointer-events-none`} />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold text-muted tracking-wider uppercase">{card.title}</p>
              <h3 className="text-2xl font-bold text-heading mt-1">{card.value}</h3>
              <p className="text-xs text-muted mt-2">{card.subtext}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
