'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineExclamationTriangle, HiOutlineMapPin,
  HiOutlineBuildingOffice, HiOutlineArrowRight
} from 'react-icons/hi2';

interface Project {
  id: string;
  name: string;
  agency: string;
  state: string;
  district: string;
  status: string;
  totalAreaHa: number;
  acquiredAreaHa: number;
  startDate: string;
  targetDate: string;
  familiesAffected: number;
  familiesResettled: number;
  budgetCr: number;
  spentCr: number;
  criticalBottleneck: boolean;
  bottleneckReason?: string;
  overlapWarnings: string[];
  milestones: { section: string; title: string; status: string }[];
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusColors: Record<string, string> = {
  'Survey': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  'Gazette Notification': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Joint Measurement': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Declaration': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  'Award & Disbursement': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Compensation Disbursement': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'Possession Taken': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  'Completed': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const agencyColors: Record<string, string> = {
  NHAI: 'from-amber-500 to-orange-600',
  DFCCIL: 'from-blue-500 to-cyan-600',
  NWDA: 'from-teal-500 to-emerald-600',
  SECI: 'from-yellow-500 to-amber-600',
  DMRC: 'from-purple-500 to-pink-600',
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const acquiredPct = project.totalAreaHa > 0
    ? Math.round((project.acquiredAreaHa / project.totalAreaHa) * 100) : 0;
  const budgetPct = project.budgetCr > 0
    ? Math.round((project.spentCr / project.budgetCr) * 100) : 0;

  const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = project.milestones.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass rounded-2xl overflow-hidden group hover:surface-hover
        transition-all duration-300 relative"
    >
      {/* Top gradient accent */}
      <div className={`h-1.5 bg-gradient-to-r ${agencyColors[project.agency] || 'from-gray-400 to-gray-500'}`} />

      {/* Critical Alert Banner */}
      {project.criticalBottleneck && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
          <HiOutlineExclamationTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-[11px] text-red-400 font-medium truncate">
            {project.bottleneckReason || 'Critical Bottleneck'}
          </span>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header: Agency Badge + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white
            bg-gradient-to-r ${agencyColors[project.agency] || 'from-gray-400 to-gray-500'}`}>
            {project.agency}
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border
            ${statusColors[project.status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
            {project.status}
          </span>
        </div>

        {/* Project Name */}
        <div>
          <h3 className="text-sm font-semibold text-heading leading-snug line-clamp-2 
            group-hover:text-saffron transition-colors duration-200">
            {project.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <HiOutlineMapPin className="w-3 h-3" />
              {project.district}, {project.state}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineBuildingOffice className="w-3 h-3" />
              {project.id}
            </span>
          </div>
        </div>

        {/* Radial Progress Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-black/10 dark:text-white/10"
              />
              <motion.path
                d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${acquiredPct}, 100` }}
                transition={{ duration: 1.2, delay: 0.3 + index * 0.06, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-heading tabular-nums">{acquiredPct}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex justify-between text-[10px] text-muted mb-0.5">
                <span>Land Acquired</span>
                <span className="tabular-nums">{project.acquiredAreaHa.toLocaleString('en-IN')} / {project.totalAreaHa.toLocaleString('en-IN')} Ha</span>
              </div>
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${acquiredPct}%` }}
                  transition={{ duration: 1, delay: 0.4 + index * 0.06 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-muted mb-0.5">
                <span>Budget Utilized</span>
                <span className="tabular-nums">₹{project.spentCr.toLocaleString('en-IN')} / ₹{project.budgetCr.toLocaleString('en-IN')} Cr</span>
              </div>
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-royal to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetPct}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.06 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div>
          <div className="flex justify-between text-[10px] text-muted mb-1.5">
            <span>Statutory Milestones</span>
            <span className="tabular-nums font-medium text-heading">{completedMilestones}/{totalMilestones}</span>
          </div>
          <div className="flex gap-1">
            {project.milestones.map((m, mi) => (
              <div
                key={mi}
                className={`flex-1 h-2 rounded-full transition-all duration-300
                  ${m.status === 'completed' ? 'bg-emerald-500'
                    : m.status === 'in-progress' ? 'bg-saffron animate-pulse'
                    : 'bg-black/10 dark:bg-white/10'
                  }`}
                title={`${m.section}: ${m.title} — ${m.status}`}
              />
            ))}
          </div>
        </div>

        {/* Overlap Warnings */}
        {project.overlapWarnings.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.overlapWarnings.map((w, wi) => (
              <span key={wi} className="px-2 py-0.5 rounded-md text-[9px] font-medium
                bg-amber-500/10 text-amber-400 border border-amber-500/20">
                ⚠ {w}
              </span>
            ))}
          </div>
        )}

        {/* View Details Link */}
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium
            bg-gradient-to-r from-saffron/10 to-emerald/10 text-saffron
            hover:from-saffron/20 hover:to-emerald/20 transition-all duration-200
            border border-saffron/20 hover:border-saffron/40"
        >
          View Statutory Details
          <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
