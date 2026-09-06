'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useThemeStore } from '@/lib/store';

const COLORS = ['#10B981', '#F97316'];

interface CompensationTrackerProps {
  title: string;
}

export default function CompensationTracker({ title }: CompensationTrackerProps) {
  const { isDark } = useThemeStore();
  const [totalAssessed, setTotalAssessed] = useState(21600);
  const [disbursed, setDisbursed] = useState(14650);

  useEffect(() => {
    // Simulate live disbursements
    const interval = setInterval(() => {
      setDisbursed(prev => {
        // Small random jump between ₹1Cr to ₹5Cr
        const jump = Math.floor(Math.random() * 5) + 1;
        // Don't exceed total assessed
        return Math.min(prev + jump, totalAssessed);
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [totalAssessed]);

  const data = [
    { name: 'Disbursed', value: disbursed },
    { name: 'Pending', value: totalAssessed - disbursed },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
          {title}
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </h3>
      </div>
      <div className="relative h-64 transition-all duration-500">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="45%" 
              innerRadius={65} 
              outerRadius={95} 
              paddingAngle={5} 
              dataKey="value" 
              stroke="none"
              animationDuration={800}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} opacity={0.85} className="transition-all duration-300" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
                fontSize: '13px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')} Cr`, '']}
            />
            <Legend wrapperStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label inside the donut hole */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-xl font-bold text-heading leading-tight transition-all duration-300">
            ₹{totalAssessed.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-muted">Cr Assessed</p>
        </div>
      </div>
    </motion.div>
  );
}
