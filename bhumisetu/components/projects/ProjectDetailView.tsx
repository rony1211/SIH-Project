'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineMapPin, HiOutlineBanknotes, HiOutlineUserGroup,
  HiOutlineCalendarDays, HiOutlineExclamationTriangle,
  HiOutlineArrowLeft, HiOutlineGlobeAlt, HiOutlineBuildingOffice
} from 'react-icons/hi2';
import ProjectTimeline from './ProjectTimeline';

interface Milestone {
  section: string;
  title: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  officer: string;
  remarks: string;
}

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
  coordinates?: { lat: number; lng: number };
  milestones: Milestone[];
}

interface ProjectDetailViewProps {
  project: Project;
}

const agencyColors: Record<string, string> = {
  NHAI: 'from-amber-500 to-orange-600',
  DFCCIL: 'from-blue-500 to-cyan-600',
  NWDA: 'from-teal-500 to-emerald-600',
  SECI: 'from-yellow-500 to-amber-600',
  DMRC: 'from-purple-500 to-pink-600',
};

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

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const acquiredPct = project.totalAreaHa > 0
    ? Math.round((project.acquiredAreaHa / project.totalAreaHa) * 100) : 0;
  const budgetPct = project.budgetCr > 0
    ? Math.round((project.spentCr / project.budgetCr) * 100) : 0;
  const resettlePct = project.familiesAffected > 0
    ? Math.round((project.familiesResettled / project.familiesAffected) * 100) : 0;
  const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-heading transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Top gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${agencyColors[project.agency] || 'from-gray-400 to-gray-500'}`} />

        {/* Critical Bottleneck Banner */}
        {project.criticalBottleneck && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
            flex items-center gap-3">
            <HiOutlineExclamationTriangle className="w-5 h-5 text-red-400 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">Critical Bottleneck Detected</p>
              <p className="text-xs text-red-400/80">{project.bottleneckReason || 'Requires immediate escalation'}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            {/* Agency + Status */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white
                bg-gradient-to-r ${agencyColors[project.agency] || 'from-gray-400 to-gray-500'}`}>
                {project.agency}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium border
                ${statusColors[project.status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
                {project.status}
              </span>
            </div>

            {/* Project Name */}
            <h1 className="text-xl md:text-2xl font-bold text-heading leading-tight">
              {project.name}
            </h1>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <HiOutlineBuildingOffice className="w-4 h-4" />
                {project.id}
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineMapPin className="w-4 h-4" />
                {project.district}, {project.state}
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineCalendarDays className="w-4 h-4" />
                {formatDate(project.startDate)} → {formatDate(project.targetDate)}
              </span>
              {project.coordinates && (
                <span className="flex items-center gap-1.5">
                  <HiOutlineGlobeAlt className="w-4 h-4" />
                  {project.coordinates.lat.toFixed(4)}°N, {project.coordinates.lng.toFixed(4)}°E
                </span>
              )}
            </div>

            {/* Overlap Warnings */}
            {project.overlapWarnings.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.overlapWarnings.map((w, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-medium
                    bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    ⚠ {w}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Milestone badge */}
          <div className="flex-shrink-0 text-center">
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                  className="text-black/10 dark:text-white/10"
                />
                <motion.path
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                  fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round"
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${(completedMilestones / project.milestones.length) * 100}, 100` }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-heading tabular-nums">{completedMilestones}</span>
                <span className="text-[9px] text-muted">of {project.milestones.length}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">Milestones</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Land Acquisition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald to-teal-500
              flex items-center justify-center">
              <HiOutlineGlobeAlt className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-muted uppercase tracking-wider">Land Acquisition</span>
          </div>
          <p className="text-xl font-bold text-heading tabular-nums">
            {project.acquiredAreaHa.toLocaleString('en-IN')} <span className="text-sm text-muted font-normal">/ {project.totalAreaHa.toLocaleString('en-IN')} Ha</span>
          </p>
          <div className="mt-2 w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${acquiredPct}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
          <p className="text-[11px] text-muted mt-1 tabular-nums">{acquiredPct}% acquired</p>
        </motion.div>

        {/* Financial Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal to-indigo-500
              flex items-center justify-center">
              <HiOutlineBanknotes className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-muted uppercase tracking-wider">Financial Status</span>
          </div>
          <p className="text-xl font-bold text-heading tabular-nums">
            ₹{project.spentCr.toLocaleString('en-IN')} <span className="text-sm text-muted font-normal">/ ₹{project.budgetCr.toLocaleString('en-IN')} Cr</span>
          </p>
          <div className="mt-2 w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-royal to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${budgetPct}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-[11px] text-muted mt-1 tabular-nums">{budgetPct}% disbursed</p>
        </motion.div>

        {/* Families */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500
              flex items-center justify-center">
              <HiOutlineUserGroup className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-muted uppercase tracking-wider">Families</span>
          </div>
          <p className="text-xl font-bold text-heading tabular-nums">
            {project.familiesResettled.toLocaleString('en-IN')} <span className="text-sm text-muted font-normal">/ {project.familiesAffected.toLocaleString('en-IN')}</span>
          </p>
          <div className="mt-2 w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${resettlePct}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
          <p className="text-[11px] text-muted mt-1 tabular-nums">{resettlePct}% resettled</p>
        </motion.div>
      </div>

      {/* Statutory Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
          <HiOutlineCalendarDays className="w-5 h-5 text-saffron" />
          RFCTLARR Act 2013 — Statutory Timeline
        </h2>
        <ProjectTimeline milestones={project.milestones} />
      </motion.div>
    </div>
  );
}
