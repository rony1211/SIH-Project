'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { useThemeStore } from '@/lib/store';

const data = [
  { state: 'MH', notified: 12500, acquired: 9800 },
  { state: 'GJ', notified: 8500, acquired: 7200 },
  { state: 'UP', notified: 21000, acquired: 15400 },
  { state: 'TN', notified: 6200, acquired: 5100 },
  { state: 'KA', notified: 9400, acquired: 6800 },
  { state: 'RJ', notified: 7800, acquired: 5200 },
  { state: 'MP', notified: 11200, acquired: 7600 },
  { state: 'WB', notified: 4500, acquired: 3100 },
];

interface AcquisitionChartProps {
  title: string;
}

export default function AcquisitionChart({ title }: AcquisitionChartProps) {
  const { isDark } = useThemeStore();
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const axisColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-heading mb-4">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="state" tick={{ fill: tickColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} />
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
            <Legend wrapperStyle={{ color: tickColor, fontSize: '12px' }} />
            <Bar dataKey="notified" name="Notified" fill="#F97316" radius={[6, 6, 0, 0]} opacity={0.85} />
            <Bar dataKey="acquired" name="Acquired" fill="#10B981" radius={[6, 6, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
