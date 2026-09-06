'use client';

import { motion } from 'framer-motion';
import { HiOutlineXMark, HiOutlineFire, HiOutlineTrophy } from 'react-icons/hi2';
import BadgeShowcase from './BadgeShowcase';
import type { Officer } from './LeaderboardTable';

const levelGradients: Record<string, string> = {
  Bronze:   'from-amber-700 to-amber-900',
  Silver:   'from-slate-400 to-slate-600',
  Gold:     'from-yellow-400 to-amber-600',
  Platinum: 'from-cyan-400 to-teal-600',
  Diamond:  'from-violet-400 to-purple-600',
};

const levelXpThresholds: Record<string, number> = {
  Bronze: 4000, Silver: 6000, Gold: 8000, Platinum: 9000, Diamond: 10000,
};

interface ProfileCardProps {
  officer: Officer;
  onClose: () => void;
}

export default function OfficerProfileCard({ officer, onClose }: ProfileCardProps) {
  const nextLevel = officer.level === 'Diamond' ? null :
    officer.level === 'Platinum' ? 'Diamond' :
    officer.level === 'Gold' ? 'Platinum' :
    officer.level === 'Silver' ? 'Gold' : 'Silver';

  const currentThreshold = levelXpThresholds[officer.level] || 4000;
  const nextThreshold = nextLevel ? levelXpThresholds[nextLevel] : currentThreshold;
  const prevThreshold = officer.level === 'Bronze' ? 0 :
    officer.level === 'Silver' ? 4000 :
    officer.level === 'Gold' ? 6000 :
    officer.level === 'Platinum' ? 8000 : 9000;
  const progressToNext = nextLevel
    ? Math.round(((officer.xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100)
    : 100;

  // Radar chart SVG
  const radarAxes = [
    { key: 'speed', label: 'Speed' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'volume', label: 'Volume' },
    { key: 'compliance', label: 'Compliance' },
    { key: 'citizenScore', label: 'Citizen' },
  ] as const;

  const cx = 100, cy = 100, maxR = 70;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / radarAxes.length - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const radarPoints = radarAxes.map((axis, i) => {
    const val = officer.radarScores[axis.key];
    return getPoint(i, val);
  });
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-dark rounded-3xl p-6 md:p-8 shadow-2xl"
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors">
          <HiOutlineXMark className="w-5 h-5 text-muted" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-5 mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${levelGradients[officer.level]}
            flex items-center justify-center text-white text-xl font-bold shadow-xl
            ring-3 ring-white/20`}>
            {officer.initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-heading">{officer.name}</h2>
            <p className="text-xs text-muted">{officer.designation} · {officer.district}, {officer.state}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${levelGradients[officer.level]} text-white`}>
                {officer.level}
              </span>
              <span className="text-[10px] text-muted">{officer.xp.toLocaleString()} XP</span>
              {officer.currentStreak >= 7 && (
                <span className="inline-flex items-center gap-0.5 text-orange-400 text-[10px] font-bold">
                  <HiOutlineFire className="w-3 h-3" /> {officer.currentStreak}d streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-6 p-4 rounded-xl bg-black/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-muted uppercase tracking-wider">Level Progress</span>
            <span className="text-[10px] font-semibold text-heading">
              {nextLevel ? `${progressToNext}% to ${nextLevel}` : 'Max Level Reached! ✨'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${levelGradients[officer.level]}`}
            />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Cases', value: officer.casesThisYear, color: 'text-royal' },
            { label: 'Avg Days', value: `${officer.avgProcessingDays}d`, color: officer.avgProcessingDays <= 10 ? 'text-emerald' : 'text-saffron' },
            { label: 'SLA Compliance', value: `${officer.slaCompliance}%`, color: officer.slaCompliance >= 95 ? 'text-emerald' : 'text-saffron' },
            { label: 'Best Streak', value: `${officer.bestStreak}d`, color: 'text-orange-400' },
          ].map((metric, i) => (
            <div key={i} className="p-3 rounded-xl bg-black/5 dark:bg-white/3 text-center">
              <p className="text-[9px] text-muted uppercase tracking-wider mb-0.5">{metric.label}</p>
              <p className={`text-lg font-bold ${metric.color} tabular-nums`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="mb-6 glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-heading mb-3">Performance Radar</h3>
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Grid circles */}
              {gridLevels.map((level) => {
                const points = radarAxes.map((_, i) => getPoint(i, level));
                const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
                return <path key={level} d={path} fill="none" stroke="var(--chart-grid)" strokeWidth="0.5" />;
              })}
              {/* Axis lines */}
              {radarAxes.map((_, i) => {
                const p = getPoint(i, 100);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--chart-grid)" strokeWidth="0.5" />;
              })}
              {/* Data polygon */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d={radarPath}
                fill="rgba(249, 115, 22, 0.15)"
                stroke="#F97316"
                strokeWidth="2"
              />
              {/* Data points */}
              {radarPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#F97316" />
              ))}
              {/* Labels */}
              {radarAxes.map((axis, i) => {
                const labelP = getPoint(i, 120);
                return (
                  <text key={i} x={labelP.x} y={labelP.y} textAnchor="middle" dominantBaseline="middle"
                    className="text-[9px] fill-current text-muted" style={{ fill: 'var(--text-muted)' }}>
                    {axis.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Badges */}
        <BadgeShowcase earnedBadges={officer.badges} officerName={officer.name} />
      </motion.div>
    </motion.div>
  );
}
