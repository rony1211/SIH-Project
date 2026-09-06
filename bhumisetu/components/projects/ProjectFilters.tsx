'use client';

import { motion } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  HiOutlineMagnifyingGlass, HiOutlineTableCells,
  HiOutlineSquares2X2, HiOutlineViewColumns,
  HiOutlineFunnel, HiOutlineExclamationTriangle
} from 'react-icons/hi2';

type ViewMode = 'grid' | 'kanban' | 'table';

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  state: string;
  onStateChange: (v: string) => void;
  agency: string;
  onAgencyChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  bottleneckOnly: boolean;
  onBottleneckToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
}

const states = ['All', 'Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Tamil Nadu', 'Rajasthan'];
const agencies = ['All', 'NHAI', 'DFCCIL', 'NWDA', 'SECI', 'DMRC'];
const statuses = [
  'All', 'Survey', 'Gazette Notification', 'Joint Measurement', 'Declaration',
  'Award & Disbursement', 'Compensation Disbursement', 'Possession Taken', 'Completed'
];

const viewModes: { key: ViewMode; icon: typeof HiOutlineSquares2X2; label: string }[] = [
  { key: 'grid', icon: HiOutlineSquares2X2, label: 'Grid' },
  { key: 'kanban', icon: HiOutlineViewColumns, label: 'Kanban' },
  { key: 'table', icon: HiOutlineTableCells, label: 'Table' },
];

export default function ProjectFilters({
  search, onSearchChange,
  state, onStateChange,
  agency, onAgencyChange,
  status, onStatusChange,
  bottleneckOnly, onBottleneckToggle,
  viewMode, onViewModeChange,
}: ProjectFiltersProps) {
  const { t } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass rounded-2xl p-4 space-y-3"
    >
      {/* Top Row: Search + View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={t('projects', 'search') || 'Search projects...'}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-white/5
              border border-transparent focus:border-saffron/50 focus:outline-none
              text-heading placeholder:text-muted transition-all duration-200"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5">
          {viewModes.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => onViewModeChange(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                transition-all duration-200
                ${viewMode === key
                  ? 'bg-gradient-to-r from-saffron to-emerald text-white shadow-md'
                  : 'text-muted hover:text-heading hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              title={label}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row: Dropdowns + Bottleneck Toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <HiOutlineFunnel className="w-4 h-4 text-muted" />

        {/* State Dropdown */}
        <select
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs bg-black/5 dark:bg-white/5
            text-heading border border-transparent focus:border-saffron/50
            focus:outline-none cursor-pointer transition-all duration-200"
        >
          {states.map((s) => (
            <option key={s} value={s}>{s === 'All' ? (t('projects', 'filterByState') || 'All States') : s}</option>
          ))}
        </select>

        {/* Agency Dropdown */}
        <select
          value={agency}
          onChange={(e) => onAgencyChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs bg-black/5 dark:bg-white/5
            text-heading border border-transparent focus:border-saffron/50
            focus:outline-none cursor-pointer transition-all duration-200"
        >
          {agencies.map((a) => (
            <option key={a} value={a}>{a === 'All' ? 'All Agencies' : a}</option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs bg-black/5 dark:bg-white/5
            text-heading border border-transparent focus:border-saffron/50
            focus:outline-none cursor-pointer transition-all duration-200"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === 'All' ? (t('projects', 'filterByStatus') || 'All Statuses') : s}</option>
          ))}
        </select>

        {/* Bottleneck Toggle */}
        <button
          onClick={onBottleneckToggle}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
            transition-all duration-200 border
            ${bottleneckOnly
              ? 'bg-red-500/15 border-red-500/40 text-red-400'
              : 'border-transparent bg-black/5 dark:bg-white/5 text-muted hover:text-heading'
            }`}
        >
          <HiOutlineExclamationTriangle className="w-3.5 h-3.5" />
          Critical Only
        </button>
      </div>
    </motion.div>
  );
}
