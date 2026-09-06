'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Officer } from './LeaderboardTable';

interface DistrictHeatmapProps {
  officers: Officer[];
  onDistrictClick: (state: string) => void;
}

const performanceColor = (score: number) => {
  if (score >= 95) return { bg: 'bg-emerald/20', border: 'border-emerald/30', text: 'text-emerald', label: 'Excellent' };
  if (score >= 92) return { bg: 'bg-teal-500/20', border: 'border-teal-500/30', text: 'text-teal-400', label: 'Very Good' };
  if (score >= 89) return { bg: 'bg-saffron/20', border: 'border-saffron/30', text: 'text-saffron', label: 'Good' };
  if (score >= 86) return { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Average' };
  return { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', label: 'Needs Improvement' };
};

export default function DistrictHeatmap({ officers, onDistrictClick }: DistrictHeatmapProps) {
  const districtData = useMemo(() => {
    const groups: Record<string, Officer[]> = {};
    officers.forEach((o) => {
      const key = `${o.district}, ${o.state}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(o);
    });

    return Object.entries(groups)
      .map(([location, ofcs]) => {
        const avgSla = Math.round((ofcs.reduce((s, o) => s + o.slaCompliance, 0) / ofcs.length) * 10) / 10;
        const avgDays = Math.round((ofcs.reduce((s, o) => s + o.avgProcessingDays, 0) / ofcs.length) * 10) / 10;
        const totalCases = ofcs.reduce((s, o) => s + o.casesThisMonth, 0);
        const topOfficer = [...ofcs].sort((a, b) => b.xp - a.xp)[0];
        const state = ofcs[0].state;

        return { location, state, avgSla, avgDays, totalCases, officerCount: ofcs.length, topOfficer };
      })
      .sort((a, b) => b.avgSla - a.avgSla);
  }, [officers]);

  const best = districtData[0];
  const worst = districtData[districtData.length - 1];

  return (
    <div className="space-y-5">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] text-muted uppercase tracking-wider font-medium">Performance Scale:</span>
        {[
          { label: 'Excellent', color: 'bg-emerald' },
          { label: 'Very Good', color: 'bg-teal-500' },
          { label: 'Good', color: 'bg-saffron' },
          { label: 'Average', color: 'bg-amber-500' },
          { label: 'Needs Work', color: 'bg-red-500' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${item.color}`} />
            <span className="text-[10px] text-muted">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Best & Worst Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-4 border-l-4 border-emerald"
        >
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">🏆 Best Performing District</p>
          <p className="text-sm font-bold text-heading">{best?.location}</p>
          <p className="text-xs text-muted mt-0.5">
            SLA: <span className="text-emerald font-semibold">{best?.avgSla}%</span> · {best?.totalCases} cases/mo
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-4 border-l-4 border-red-500"
        >
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">⚠️ Needs Attention</p>
          <p className="text-sm font-bold text-heading">{worst?.location}</p>
          <p className="text-xs text-muted mt-0.5">
            SLA: <span className="text-red-400 font-semibold">{worst?.avgSla}%</span> · {worst?.totalCases} cases/mo
          </p>
        </motion.div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {districtData.map((district, i) => {
          const perf = performanceColor(district.avgSla);
          return (
            <motion.div
              key={district.location}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => onDistrictClick(district.state)}
              className={`${perf.bg} border ${perf.border} rounded-2xl p-4 cursor-pointer
                hover:scale-[1.02] transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-heading">{district.location.split(',')[0]}</p>
                  <p className="text-[9px] text-muted">{district.state}</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${perf.bg} ${perf.text}`}>
                  {perf.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div>
                  <p className="text-[8px] text-muted uppercase">SLA</p>
                  <p className={`text-sm font-bold ${perf.text} tabular-nums`}>{district.avgSla}%</p>
                </div>
                <div>
                  <p className="text-[8px] text-muted uppercase">Avg Days</p>
                  <p className="text-sm font-bold text-heading tabular-nums">{district.avgDays}d</p>
                </div>
                <div>
                  <p className="text-[8px] text-muted uppercase">Cases</p>
                  <p className="text-sm font-bold text-heading tabular-nums">{district.totalCases}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br
                  ${district.topOfficer.level === 'Diamond' ? 'from-violet-400 to-purple-600' :
                    district.topOfficer.level === 'Platinum' ? 'from-cyan-400 to-teal-600' :
                    district.topOfficer.level === 'Gold' ? 'from-yellow-400 to-amber-600' :
                    'from-slate-400 to-slate-600'}
                  flex items-center justify-center text-white text-[7px] font-bold`}>
                  {district.topOfficer.initials}
                </div>
                <p className="text-[9px] text-muted truncate">
                  Top: <span className="text-heading font-medium">{district.topOfficer.name}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
