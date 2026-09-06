'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineChevronUp, HiOutlineChevronDown,
  HiOutlineArrowRight, HiOutlineExclamationTriangle
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
  budgetCr: number;
  spentCr: number;
  familiesAffected: number;
  familiesResettled: number;
  criticalBottleneck: boolean;
  startDate: string;
  targetDate: string;
  milestones: { section: string; title: string; status: string }[];
}

interface ProjectTableViewProps {
  projects: Project[];
}

type SortKey = 'name' | 'agency' | 'state' | 'status' | 'totalAreaHa' | 'acquiredPct' | 'budgetCr';

const statusColors: Record<string, string> = {
  'Survey': 'bg-sky-500/15 text-sky-400',
  'Gazette Notification': 'bg-amber-500/15 text-amber-400',
  'Joint Measurement': 'bg-orange-500/15 text-orange-400',
  'Declaration': 'bg-indigo-500/15 text-indigo-400',
  'Award & Disbursement': 'bg-purple-500/15 text-purple-400',
  'Compensation Disbursement': 'bg-violet-500/15 text-violet-400',
  'Possession Taken': 'bg-teal-500/15 text-teal-400',
  'Completed': 'bg-emerald-500/15 text-emerald-400',
};

export default function ProjectTableView({ projects }: ProjectTableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...projects].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'name': cmp = a.name.localeCompare(b.name); break;
      case 'agency': cmp = a.agency.localeCompare(b.agency); break;
      case 'state': cmp = a.state.localeCompare(b.state); break;
      case 'status': cmp = a.status.localeCompare(b.status); break;
      case 'totalAreaHa': cmp = a.totalAreaHa - b.totalAreaHa; break;
      case 'acquiredPct': {
        const ap = a.totalAreaHa > 0 ? a.acquiredAreaHa / a.totalAreaHa : 0;
        const bp = b.totalAreaHa > 0 ? b.acquiredAreaHa / b.totalAreaHa : 0;
        cmp = ap - bp;
        break;
      }
      case 'budgetCr': cmp = a.budgetCr - b.budgetCr; break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <HiOutlineChevronDown className="w-3 h-3 opacity-30" />;
    return sortAsc
      ? <HiOutlineChevronUp className="w-3 h-3 text-saffron" />
      : <HiOutlineChevronDown className="w-3 h-3 text-saffron" />;
  };

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: 'name', label: 'Project' },
    { key: 'agency', label: 'Agency' },
    { key: 'state', label: 'State / District' },
    { key: 'status', label: 'Status' },
    { key: 'totalAreaHa', label: 'Land (Ha)', align: 'text-right' },
    { key: 'acquiredPct', label: 'Progress', align: 'text-center' },
    { key: 'budgetCr', label: 'Budget (₹ Cr)', align: 'text-right' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3.5 text-[11px] font-bold text-muted uppercase tracking-wider
                    cursor-pointer hover:text-heading transition-colors select-none
                    ${col.align || 'text-left'}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3.5 text-[11px] font-bold text-muted uppercase tracking-wider text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {sorted.map((project, i) => {
              const acqPct = project.totalAreaHa > 0
                ? Math.round((project.acquiredAreaHa / project.totalAreaHa) * 100) : 0;

              return (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Project Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {project.criticalBottleneck && (
                        <HiOutlineExclamationTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 animate-pulse" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-heading line-clamp-1">{project.name}</p>
                        <p className="text-[10px] text-muted tabular-nums">{project.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Agency */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-saffron">{project.agency}</span>
                  </td>

                  {/* State / District */}
                  <td className="px-4 py-3">
                    <p className="text-xs text-heading">{project.state}</p>
                    <p className="text-[10px] text-muted">{project.district}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-medium
                      ${statusColors[project.status] || 'bg-gray-500/15 text-gray-400'}`}>
                      {project.status}
                    </span>
                  </td>

                  {/* Land */}
                  <td className="px-4 py-3 text-right tabular-nums">
                    <p className="text-xs text-heading font-medium">
                      {project.acquiredAreaHa.toLocaleString('en-IN')} / {project.totalAreaHa.toLocaleString('en-IN')}
                    </p>
                  </td>

                  {/* Progress Bar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald to-teal-500 rounded-full transition-all"
                          style={{ width: `${acqPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-heading tabular-nums w-8 text-right">
                        {acqPct}%
                      </span>
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="px-4 py-3 text-right tabular-nums">
                    <p className="text-xs text-heading font-medium">
                      ₹{project.budgetCr.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-muted">
                      ₹{project.spentCr.toLocaleString('en-IN')} spent
                    </p>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px]
                        font-medium text-saffron hover:bg-saffron/10 transition-colors"
                    >
                      Details <HiOutlineArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </motion.tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-muted text-sm">
                  No projects found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
