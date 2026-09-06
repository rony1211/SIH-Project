'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineExclamationTriangle, HiOutlineArrowRight } from 'react-icons/hi2';

interface Project {
  id: string;
  name: string;
  agency: string;
  state: string;
  district: string;
  status: string;
  totalAreaHa: number;
  acquiredAreaHa: number;
  budgetCr: number;
  spentCr: number;
  criticalBottleneck: boolean;
  bottleneckReason?: string;
  milestones: { section: string; title: string; status: string }[];
}

interface ProjectKanbanViewProps {
  projects: Project[];
}

const kanbanStages = [
  { key: 'Survey', label: 'Sec 4 — Survey', color: 'border-sky-500', bg: 'bg-sky-500/10' },
  { key: 'Gazette Notification', label: 'Sec 11 — Notification', color: 'border-amber-500', bg: 'bg-amber-500/10' },
  { key: 'Joint Measurement', label: 'Sec 15 — Hearing', color: 'border-orange-500', bg: 'bg-orange-500/10' },
  { key: 'Declaration', label: 'Sec 19 — Declaration', color: 'border-indigo-500', bg: 'bg-indigo-500/10' },
  { key: 'Award & Disbursement', label: 'Sec 23 — Award', color: 'border-purple-500', bg: 'bg-purple-500/10' },
  { key: 'Compensation Disbursement', label: 'Sec 23 — Compensation', color: 'border-violet-500', bg: 'bg-violet-500/10' },
  { key: 'Possession Taken', label: 'Sec 38 — Possession', color: 'border-teal-500', bg: 'bg-teal-500/10' },
  { key: 'Completed', label: '✓ Completed', color: 'border-emerald-500', bg: 'bg-emerald-500/10' },
];

export default function ProjectKanbanView({ projects }: ProjectKanbanViewProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {kanbanStages.map((stage, si) => {
          const stageProjects = projects.filter(p => p.status === stage.key);

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: si * 0.05 }}
              className="w-72 flex-shrink-0"
            >
              {/* Stage Header */}
              <div className={`rounded-t-xl px-4 py-3 border-t-3 ${stage.color} ${stage.bg}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-heading uppercase tracking-wider">
                    {stage.label}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold
                    bg-black/10 dark:bg-white/10 text-heading tabular-nums">
                    {stageProjects.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 mt-3 min-h-[120px]">
                {stageProjects.length === 0 && (
                  <div className="glass rounded-xl p-4 text-center">
                    <p className="text-[11px] text-muted italic">No projects in this stage</p>
                  </div>
                )}

                {stageProjects.map((project, pi) => {
                  const acqPct = project.totalAreaHa > 0
                    ? Math.round((project.acquiredAreaHa / project.totalAreaHa) * 100) : 0;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: si * 0.05 + pi * 0.08 }}
                      className="glass rounded-xl p-3.5 space-y-2.5 hover:surface-hover
                        transition-all duration-200 group cursor-pointer"
                    >
                      {/* Bottleneck */}
                      {project.criticalBottleneck && (
                        <div className="flex items-center gap-1.5 text-red-400">
                          <HiOutlineExclamationTriangle className="w-3 h-3 animate-pulse" />
                          <span className="text-[9px] font-medium truncate">
                            {project.bottleneckReason || 'Bottleneck'}
                          </span>
                        </div>
                      )}

                      {/* Agency + ID */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-saffron uppercase">{project.agency}</span>
                        <span className="text-[9px] text-muted tabular-nums">{project.id}</span>
                      </div>

                      {/* Name */}
                      <p className="text-xs font-semibold text-heading leading-snug line-clamp-2">
                        {project.name}
                      </p>

                      {/* Location */}
                      <p className="text-[10px] text-muted">
                        {project.district}, {project.state}
                      </p>

                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-[9px] text-muted mb-0.5">
                          <span>Land Progress</span>
                          <span className="tabular-nums font-medium">{acqPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald to-teal-500 rounded-full transition-all duration-700"
                            style={{ width: `${acqPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted">Budget</span>
                        <span className="text-heading font-medium tabular-nums">
                          ₹{project.spentCr.toLocaleString('en-IN')} / ₹{project.budgetCr.toLocaleString('en-IN')} Cr
                        </span>
                      </div>

                      {/* View Link */}
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center justify-center gap-1 w-full py-1.5 rounded-lg text-[10px]
                          font-medium text-saffron hover:bg-saffron/10 transition-colors duration-200"
                      >
                        Details <HiOutlineArrowRight className="w-3 h-3" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
