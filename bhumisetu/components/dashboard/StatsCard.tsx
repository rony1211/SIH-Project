'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isUp: boolean };
  color: string;
  delay?: number;
}

export default function StatsCard({ icon, label, value, trend, color, delay = 0 }: StatsCardProps) {
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
          <p className="text-2xl md:text-3xl font-bold text-heading mt-1">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium
              ${trend.isUp ? 'text-emerald' : 'text-danger'}`}>
              <span>{trend.isUp ? '↑' : '↓'}</span>
              <span>{trend.value}% vs last quarter</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} 
          flex items-center justify-center shadow-lg
          group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
