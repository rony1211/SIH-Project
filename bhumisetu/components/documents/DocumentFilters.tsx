'use client';

import { motion } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  HiOutlineMagnifyingGlass, HiOutlineTableCells,
  HiOutlineSquares2X2, HiOutlineArrowUpTray,
  HiOutlineFunnel
} from 'react-icons/hi2';

const categories = [
  'All',
  'Gazette Notification',
  'Title Deed',
  'Joint Measurement Survey',
  'Court Order',
  'Compensation Award',
  'Environmental Clearance',
  'R&R Plan',
  'Possession Certificate',
];

const statuses = ['All', 'Draft', 'Under Review', 'Approved', 'Archived'];

interface DocumentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onUploadClick: () => void;
}

export default function DocumentFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onUploadClick,
}: DocumentFiltersProps) {
  const { t } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('documents', 'searchDocuments') || 'Search documents...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5
              border border-transparent focus:border-saffron/30 focus:bg-black/8 dark:focus:bg-white/8
              text-sm text-heading placeholder-muted outline-none transition-all duration-200"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl bg-black/5 dark:bg-white/5
              border border-transparent focus:border-saffron/30
              text-sm text-heading outline-none transition-all duration-200
              appearance-none cursor-pointer min-w-[160px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{cat}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-xl bg-black/5 dark:bg-white/5
              border border-transparent focus:border-saffron/30
              text-sm text-heading outline-none transition-all duration-200
              appearance-none cursor-pointer min-w-[130px]"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{s}</option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-xl bg-black/5 dark:bg-white/5 p-1">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-2 rounded-lg transition-all duration-200
              ${viewMode === 'table'
                ? 'bg-saffron/15 text-saffron shadow-sm'
                : 'text-muted hover:text-heading'
              }`}
            aria-label="Table view"
          >
            <HiOutlineTableCells className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-all duration-200
              ${viewMode === 'grid'
                ? 'bg-saffron/15 text-saffron shadow-sm'
                : 'text-muted hover:text-heading'
              }`}
            aria-label="Grid view"
          >
            <HiOutlineSquares2X2 className="w-4 h-4" />
          </button>
        </div>

        {/* Upload button */}
        <button
          onClick={onUploadClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-saffron to-orange-600 text-white font-medium text-sm
            shadow-lg shadow-saffron/25 hover:shadow-saffron/40 hover:scale-[1.02]
            transition-all duration-300 flex-shrink-0"
        >
          <HiOutlineArrowUpTray className="w-4 h-4" />
          {t('documents', 'uploadDocument') || 'Upload'}
        </button>
      </div>
    </motion.div>
  );
}
