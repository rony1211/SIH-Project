'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar
} from 'recharts';
import type { Officer } from './LeaderboardTable';

interface PerformanceTrendsProps {
  officers: Officer[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark rounded-xl p-3 shadow-xl border border-white/10 text-[11px]">
        <p className="font-bold text-heading mb-1.5">{label}</p>
        {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
          <div key={i} className="flex items-center gap-2 text-muted">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}:</span>
            <span className="font-semibold text-heading">
              {entry.name.includes('%') ? `${entry.value}%` :
               entry.name.includes('Days') ? `${entry.value}d` :
               entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceTrends({ officers }: PerformanceTrendsProps) {
  // Aggregate monthly trends across all officers
  const aggregatedTrend = useMemo(() => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map((month, idx) => {
      const monthData = officers
        .map((o) => o.monthlyTrend[idx])
        .filter((d) => d && d.cases > 0);

      if (monthData.length === 0) return { month, cases: 0, avgDays: 0, sla: 0 };

      return {
        month,
        cases: monthData.reduce((s, d) => s + d.cases, 0),
        avgDays: Math.round((monthData.reduce((s, d) => s + d.avgDays, 0) / monthData.length) * 10) / 10,
        sla: Math.round((monthData.reduce((s, d) => s + d.sla, 0) / monthData.length) * 10) / 10,
      };
    });
  }, [officers]);

  // Level distribution
  const levelDist = useMemo(() => {
    const dist: Record<string, number> = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0, Diamond: 0 };
    officers.forEach((o) => { dist[o.level] = (dist[o.level] || 0) + 1; });
    return Object.entries(dist).map(([level, count]) => ({ level, count }));
  }, [officers]);

  const levelBarColors: Record<string, string> = {
    Bronze: '#92400E',
    Silver: '#94A3B8',
    Gold: '#EAB308',
    Platinum: '#06B6D4',
    Diamond: '#8B5CF6',
  };

  return (
    <div className="space-y-6">
      {/* Cases & SLA Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-5"
      >
        <div className="mb-4">
          <h3 className="text-sm font-bold text-heading">National Performance Trend</h3>
          <p className="text-[10px] text-muted mt-0.5">Aggregated cases processed and SLA compliance across all officers</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={aggregatedTrend}>
            <defs>
              <linearGradient id="casesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)' }} />
            <Area yAxisId="left" type="monotone" dataKey="cases" name="Total Cases" stroke="#F97316" fill="url(#casesGradient)" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="sla" name="Avg SLA %" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
            <Line yAxisId="left" type="monotone" dataKey="avgDays" name="Avg Days" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: '#3B82F6' }} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Two-column: Level Distribution + Top Performers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-heading">Officer Level Distribution</h3>
            <p className="text-[10px] text-muted mt-0.5">Breakdown by performance tier</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={levelDist}>
              <defs>
                <linearGradient id="levelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="level" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Officers" stroke="#8B5CF6" fill="url(#levelGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Badge Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-heading">Top Badge Collectors</h3>
            <p className="text-[10px] text-muted mt-0.5">Officers with the most achievement badges</p>
          </div>
          <div className="space-y-2">
            {[...officers]
              .sort((a, b) => b.badges.length - a.badges.length)
              .slice(0, 6)
              .map((officer, i) => (
                <div key={officer.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/3 dark:hover:bg-white/3 transition-colors">
                  <span className="text-xs font-bold text-muted w-5">#{i + 1}</span>
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br
                    ${officer.level === 'Diamond' ? 'from-violet-400 to-purple-600' :
                      officer.level === 'Platinum' ? 'from-cyan-400 to-teal-600' :
                      officer.level === 'Gold' ? 'from-yellow-400 to-amber-600' :
                      'from-slate-400 to-slate-600'}
                    flex items-center justify-center text-white text-[9px] font-bold`}>
                    {officer.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-heading truncate">{officer.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-saffron">{officer.badges.length}</span>
                    <span className="text-[9px] text-muted">badges</span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
