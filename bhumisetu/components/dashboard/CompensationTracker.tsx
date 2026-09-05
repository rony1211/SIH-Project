'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useThemeStore } from '@/lib/store';

const data = [
  { name: 'Disbursed', value: 14650 },
  { name: 'Pending', value: 6950 },
];

const COLORS = ['#10B981', '#F97316'];

interface CompensationTrackerProps {
  title: string;
}

export default function CompensationTracker({ title }: CompensationTrackerProps) {
  const { isDark } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-heading mb-4">{title}</h3>
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="45%" innerRadius={65} outerRadius={95} paddingAngle={5} dataKey="value" stroke="none">
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')} Cr`, '']}
            />
            <Legend wrapperStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label inside the donut hole */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-xl font-bold text-heading leading-tight">₹21,600</p>
          <p className="text-[10px] text-muted">Cr Assessed</p>
        </div>
      </div>
    </motion.div>
  );
}
