'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass, HiOutlineChevronUp, HiOutlineChevronDown,
  HiMiniMinus, HiOutlineFire, HiOutlineTrophy
} from 'react-icons/hi2';
import OfficerProfileCard from './OfficerProfileCard';

export interface Officer {
  id: string;
  name: string;
  initials: string;
  designation: string;
  district: string;
  state: string;
  postedSince: string;
  xp: number;
  level: string;
  casesThisMonth: number;
  casesThisQuarter: number;
  casesThisYear: number;
  avgProcessingDays: number;
  slaCompliance: number;
  approvalTurnaroundHrs: number;
  badges: string[];
  currentStreak: number;
  bestStreak: number;
  rankChange: number;
  monthlyTrend: { month: string; cases: number; avgDays: number; sla: number }[];
  radarScores: { speed: number; accuracy: number; volume: number; compliance: number; citizenScore: number };
}

const levelColors: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
  Bronze:   { bg: 'bg-amber-800/20', text: 'text-amber-600', ring: 'ring-amber-700/40', glow: '' },
  Silver:   { bg: 'bg-slate-400/20', text: 'text-slate-300', ring: 'ring-slate-400/40', glow: '' },
  Gold:     { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500/40', glow: 'shadow-yellow-500/10' },
  Platinum: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', ring: 'ring-cyan-400/40', glow: 'shadow-cyan-500/10' },
  Diamond:  { bg: 'bg-violet-500/20', text: 'text-violet-300', ring: 'ring-violet-400/40', glow: 'shadow-violet-500/20' },
};

const levelGradients: Record<string, string> = {
  Bronze:   'from-amber-700 to-amber-900',
  Silver:   'from-slate-300 to-slate-500',
  Gold:     'from-yellow-400 to-amber-500',
  Platinum: 'from-cyan-300 to-teal-500',
  Diamond:  'from-violet-400 to-purple-600',
};

const avatarGradients: Record<string, string> = {
  Bronze:   'from-amber-700 to-amber-900',
  Silver:   'from-slate-400 to-slate-600',
  Gold:     'from-yellow-400 to-amber-600',
  Platinum: 'from-cyan-400 to-teal-600',
  Diamond:  'from-violet-400 to-purple-600',
};

const podiumStyles = [
  'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-yellow-500/30',
  'bg-gradient-to-r from-slate-400/10 to-slate-500/5 border-slate-400/30',
  'bg-gradient-to-r from-amber-700/10 to-amber-800/5 border-amber-700/30',
];

const podiumIcons = ['🥇', '🥈', '🥉'];

interface LeaderboardProps {
  officers: Officer[];
  search: string;
  onSearchChange: (v: string) => void;
  stateFilter: string;
  onStateChange: (v: string) => void;
  states: string[];
}

export default function LeaderboardTable({
  officers, search, onSearchChange, stateFilter, onStateChange, states,
}: LeaderboardProps) {
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [sortBy, setSortBy] = useState<'xp' | 'slaCompliance' | 'casesThisMonth' | 'avgProcessingDays'>('xp');

  const sorted = [...officers].sort((a, b) => {
    if (sortBy === 'avgProcessingDays') return a[sortBy] - b[sortBy];
    return b[sortBy] - a[sortBy];
  });

  const renderMiniTrend = (trend: { cases: number }[]) => {
    const validData = trend.filter(t => t.cases > 0);
    if (validData.length < 2) return null;
    const max = Math.max(...validData.map(t => t.cases));
    const min = Math.min(...validData.map(t => t.cases));
    const range = max - min || 1;
    const width = 60;
    const height = 20;
    const points = validData.map((t, i) => {
      const x = (i / (validData.length - 1)) * width;
      const y = height - ((t.cases - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isUpward = validData[validData.length - 1].cases >= validData[0].cases;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={isUpward ? '#10B981' : '#EF4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderSlaRing = (pct: number) => {
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const color = pct >= 95 ? '#10B981' : pct >= 90 ? '#F97316' : '#EF4444';

    return (
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg width="36" height="36" className="transform -rotate-90">
          <circle cx="18" cy="18" r={radius} fill="none" stroke="currentColor"
            className="text-black/5 dark:text-white/5" strokeWidth="3" />
          <circle cx="18" cy="18" r={radius} fill="none" stroke={color}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <span className="absolute text-[8px] font-bold text-heading">{Math.round(pct)}</span>
      </div>
    );
  };

  return (
    <>
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search officers..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-white/5
              border border-black/5 dark:border-white/5 text-heading placeholder:text-muted
              focus:outline-none focus:ring-2 focus:ring-saffron/30 transition-all"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => onStateChange(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-white/5
            border border-black/5 dark:border-white/5 text-heading
            focus:outline-none focus:ring-2 focus:ring-saffron/30"
        >
          <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All States</option>
          {states.map((s) => (
            <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{s}</option>
          ))}
        </select>
        <div className="flex gap-1.5">
          {([
            { key: 'xp' as const, label: 'XP' },
            { key: 'slaCompliance' as const, label: 'SLA %' },
            { key: 'casesThisMonth' as const, label: 'Cases' },
            { key: 'avgProcessingDays' as const, label: 'Speed' },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all
                ${sortBy === key
                  ? 'bg-saffron/20 text-saffron border border-saffron/30'
                  : 'bg-black/5 dark:bg-white/5 text-muted hover:text-heading border border-transparent'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="text-left py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px]">Rank</th>
                <th className="text-left py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px]">Officer</th>
                <th className="text-left py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px] hidden md:table-cell">Level</th>
                <th className="text-center py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px]">XP</th>
                <th className="text-center py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px] hidden lg:table-cell">Cases/Mo</th>
                <th className="text-center py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px] hidden lg:table-cell">Avg Days</th>
                <th className="text-center py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px]">SLA</th>
                <th className="text-center py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px] hidden md:table-cell">Trend</th>
                <th className="text-center py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px] hidden sm:table-cell">Streak</th>
                <th className="text-center py-3 px-4 text-muted font-medium uppercase tracking-wider text-[10px]">Δ</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((officer, index) => {
                const isPodium = index < 3;
                const lc = levelColors[officer.level] || levelColors.Bronze;

                return (
                  <motion.tr
                    key={officer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    onClick={() => setSelectedOfficer(officer)}
                    className={`border-b border-black/3 dark:border-white/3 cursor-pointer
                      transition-all duration-200 hover:bg-black/3 dark:hover:bg-white/3
                      ${isPodium ? podiumStyles[index] + ' border' : ''}`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {isPodium ? (
                          <span className="text-lg">{podiumIcons[index]}</span>
                        ) : (
                          <span className="text-sm font-bold text-muted w-6 text-center">#{index + 1}</span>
                        )}
                      </div>
                    </td>

                    {/* Officer */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradients[officer.level] || avatarGradients.Bronze}
                          flex items-center justify-center text-white text-[11px] font-bold shadow-lg
                          ${isPodium ? 'ring-2 ' + lc.ring : ''}`}>
                          {officer.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-heading text-xs">{officer.name}</p>
                          <p className="text-[10px] text-muted">{officer.designation} · {officer.district}</p>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${lc.bg} ${lc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${levelGradients[officer.level]}`} />
                        {officer.level}
                      </span>
                    </td>

                    {/* XP */}
                    <td className="py-3 px-4 text-center">
                      <div>
                        <span className="font-bold text-heading tabular-nums">{officer.xp.toLocaleString()}</span>
                        <div className="w-full h-1 rounded-full bg-black/5 dark:bg-white/5 mt-1">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${levelGradients[officer.level] || levelGradients.Bronze}`}
                            style={{ width: `${Math.min(100, (officer.xp / 10000) * 100)}%`, transition: 'width 1s ease' }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Cases */}
                    <td className="py-3 px-4 text-center hidden lg:table-cell">
                      <span className="font-semibold text-heading tabular-nums">{officer.casesThisMonth}</span>
                    </td>

                    {/* Avg Days */}
                    <td className="py-3 px-4 text-center hidden lg:table-cell">
                      <span className={`font-semibold tabular-nums ${officer.avgProcessingDays <= 10 ? 'text-emerald' : officer.avgProcessingDays <= 13 ? 'text-saffron' : 'text-danger'}`}>
                        {officer.avgProcessingDays}d
                      </span>
                    </td>

                    {/* SLA Ring */}
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        {renderSlaRing(officer.slaCompliance)}
                      </div>
                    </td>

                    {/* Mini Trend */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex justify-center">
                        {renderMiniTrend(officer.monthlyTrend)}
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      {officer.currentStreak >= 7 ? (
                        <span className="inline-flex items-center gap-1 text-orange-400 font-bold">
                          <HiOutlineFire className="w-3.5 h-3.5" />
                          {officer.currentStreak}
                        </span>
                      ) : (
                        <span className="text-muted">{officer.currentStreak}d</span>
                      )}
                    </td>

                    {/* Rank Change */}
                    <td className="py-3 px-4 text-center">
                      {officer.rankChange > 0 ? (
                        <motion.span
                          initial={{ y: 5 }} animate={{ y: 0 }}
                          className="inline-flex items-center gap-0.5 text-emerald font-bold"
                        >
                          <HiOutlineChevronUp className="w-3.5 h-3.5" />
                          {officer.rankChange}
                        </motion.span>
                      ) : officer.rankChange < 0 ? (
                        <motion.span
                          initial={{ y: -5 }} animate={{ y: 0 }}
                          className="inline-flex items-center gap-0.5 text-danger font-bold"
                        >
                          <HiOutlineChevronDown className="w-3.5 h-3.5" />
                          {Math.abs(officer.rankChange)}
                        </motion.span>
                      ) : (
                        <span className="text-muted"><HiMiniMinus className="w-3.5 h-3.5 inline" /></span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Officer Profile Modal */}
      <AnimatePresence>
        {selectedOfficer && (
          <OfficerProfileCard
            officer={selectedOfficer}
            onClose={() => setSelectedOfficer(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
