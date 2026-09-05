'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import { useThemeStore } from '@/lib/store';

const initialData = [
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

  const [data, setData] = useState(initialData);
  const [activeState, setActiveState] = useState<string | null>(null);

  useEffect(() => {
    // Simulate live acquisition progress every 3 seconds
    const interval = setInterval(() => {
      setData(currentData => {
        const newData = [...currentData];
        // Pick a random state to increment
        const randomIndex = Math.floor(Math.random() * newData.length);
        const item = { ...newData[randomIndex] };
        
        // Increase acquired land by a random amount, but cap it at notified land
        const increment = Math.floor(Math.random() * 50) + 10;
        if (item.acquired + increment <= item.notified) {
          item.acquired += increment;
          newData[randomIndex] = item;
          setActiveState(item.state);
          
          // Clear the active highlight after a short delay
          setTimeout(() => setActiveState(null), 1000);
        }
        
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
          {title}
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </h3>
      </div>
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
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [value.toLocaleString('en-IN') + ' Ha', '']}
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
            <Legend wrapperStyle={{ color: tickColor, fontSize: '12px' }} />
            <Bar dataKey="notified" name="Notified" fill="#F97316" radius={[6, 6, 0, 0]} opacity={0.85} />
            <Bar dataKey="acquired" name="Acquired" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="#10B981"
                  opacity={entry.state === activeState ? 1 : 0.85}
                  className="transition-all duration-300"
                  style={{
                    filter: entry.state === activeState ? 'brightness(1.2)' : 'none'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
