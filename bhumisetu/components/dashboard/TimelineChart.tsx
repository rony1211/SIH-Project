'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeStore } from '@/lib/store';

const data = [
  { month: 'Jan', acquired: 2400, target: 3000 },
  { month: 'Feb', acquired: 4200, target: 6000 },
  { month: 'Mar', acquired: 7800, target: 9000 },
  { month: 'Apr', acquired: 12200, target: 12000 },
  { month: 'May', acquired: 16800, target: 15000 },
  { month: 'Jun', acquired: 21000, target: 18000 },
  { month: 'Jul', acquired: 25400, target: 21000 },
  { month: 'Aug', acquired: 29800, target: 27000 },
  { month: 'Sep', acquired: 33100, target: 33000 },
  { month: 'Oct', acquired: 35200, target: 36000 },
  { month: 'Nov', acquired: 37800, target: 38000 },
  { month: 'Dec', acquired: 39300, target: 40000 },
];

interface TimelineChartProps {
  title: string;
}

export default function TimelineChart({ title }: TimelineChartProps) {
  const { isDark } = useThemeStore();
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const axisColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-heading mb-1">{title}</h3>
      <p className="text-xs text-muted mb-4">Acquisition progress vs target timeline (FY 2025-26)</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAcquired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} />
            <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
                fontSize: '13px',
              }}
              formatter={(value: number) => [value.toLocaleString('en-IN') + ' Ha', '']}
            />
            <Area type="monotone" dataKey="target" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorTarget)" name="Target" />
            <Area type="monotone" dataKey="acquired" stroke="#10B981" strokeWidth={2} fill="url(#colorAcquired)" name="Acquired" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
