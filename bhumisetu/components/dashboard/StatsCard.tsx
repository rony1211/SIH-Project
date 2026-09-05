'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  initialValue: number;
  trend?: { value: number; isUp: boolean };
  color: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
}

export default function StatsCard({ icon, label, initialValue, trend, color, delay = 0, prefix = '', suffix = '' }: StatsCardProps) {
  const [value, setValue] = useState(initialValue);

  // Simulate live data ticking
  useEffect(() => {
    // Random interval between 2s and 5s
    const intervalTime = Math.random() * 3000 + 2000;
    
    const interval = setInterval(() => {
      setValue(prev => {
        // Increment by a small random amount (0.01% to 0.05% of initial)
        const increment = Math.max(1, Math.floor(initialValue * (Math.random() * 0.0005)));
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [initialValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-5 hover:surface-hover transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
      {/* Gradient accent line at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted mb-1 uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl md:text-3xl font-bold text-heading mt-1 tabular-nums transition-all">
              {prefix}{value.toLocaleString('en-IN')}
            </p>
            {suffix && <span className="text-sm text-muted font-medium">{suffix}</span>}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium
              ${trend.isUp ? 'text-emerald' : 'text-danger'}`}>
              <span className={trend.isUp ? 'animate-bounce' : ''}>{trend.isUp ? '↑' : '↓'}</span>
              <span>{trend.value}% vs last quarter</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} 
          flex items-center justify-center shadow-lg relative
          group-hover:scale-110 transition-transform duration-300`}>
          {icon}
          {/* Live pulse indicator */}
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-75" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
        </div>
      </div>
    </motion.div>
  );
}
