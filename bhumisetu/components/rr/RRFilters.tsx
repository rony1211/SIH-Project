'use client';

import {
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineFunnel,
  HiOutlineSquares2X2,
  HiOutlineTableCells,
  HiOutlineArrowDownTray,
} from 'react-icons/hi2';

interface RRFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedProject: string;
  onProjectChange: (v: string) => void;
  selectedCategory: string;
  onCategoryChange: (v: string) => void;
  selectedVulnerability: string;
  onVulnerabilityChange: (v: string) => void;
  selectedStatus: string;
  onStatusChange: (v: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (v: 'grid' | 'table') => void;
  projectOptions: { id: string; name: string }[];
  onExportCSV: () => void;
}

export default function RRFilters({
  search,
  onSearchChange,
  selectedProject,
  onProjectChange,
  selectedCategory,
  onCategoryChange,
  selectedVulnerability,
  onVulnerabilityChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  projectOptions,
  onExportCSV,
}: RRFiltersProps) {
  return (
    <div className="glass rounded-2xl p-4 space-y-3 shadow-sm">
      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Family ID, Head of Family name, village, or Aadhaar..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-white/5
              border border-transparent focus:border-saffron/50 focus:outline-none
              text-heading placeholder:text-muted transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-heading"
            >
              <HiOutlineXMark className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-saffron text-white shadow-sm font-semibold'
                  : 'text-muted hover:text-heading'
              }`}
              title="Card Grid View"
            >
              <HiOutlineSquares2X2 className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-saffron text-white shadow-sm font-semibold'
                  : 'text-muted hover:text-heading'
              }`}
              title="Administrative Ledger Table"
            >
              <HiOutlineTableCells className="w-4 h-4" />
              <span className="hidden sm:inline">Ledger</span>
            </button>
          </div>

          <button
            onClick={onExportCSV}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5
              text-muted hover:text-heading border border-transparent hover:border-black/10 dark:hover:border-white/10
              flex items-center gap-1.5 transition-all"
            title="Export R&R Compliance CSV"
          >
            <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <HiOutlineFunnel className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Project */}
        <select
          value={selectedProject}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-heading
            border border-black/10 dark:border-white/10 focus:outline-none focus:border-saffron max-w-[200px] truncate"
        >
          <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Project: All Projects</option>
          {projectOptions.map((p) => (
            <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {p.name}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-heading
            border border-black/10 dark:border-white/10 focus:outline-none focus:border-saffron"
        >
          <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Category: All</option>
          <option value="Physically Displaced" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Physically Displaced</option>
          <option value="Economically Affected" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Economically Affected</option>
        </select>

        {/* Vulnerability */}
        <select
          value={selectedVulnerability}
          onChange={(e) => onVulnerabilityChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-heading
            border border-black/10 dark:border-white/10 focus:outline-none focus:border-saffron"
        >
          <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Priority: All Groups</option>
          <option value="SC/ST" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">SC/ST Special Safeguard</option>
          <option value="Widow" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Widow / BPL Priority</option>
        </select>

        {/* Compliance Status */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-heading
            border border-black/10 dark:border-white/10 focus:outline-none focus:border-saffron"
        >
          <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Compliance: All Statuses</option>
          <option value="Complete" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Fully Settled (100%)</option>
          <option value="In Progress" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">In Progress</option>
          <option value="Critical Pending" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Lagging (&lt;30%)</option>
        </select>

        {/* Reset */}
        {(selectedProject !== 'All' || selectedCategory !== 'All' || selectedVulnerability !== 'All' || selectedStatus !== 'All' || search) && (
          <button
            onClick={() => {
              onSearchChange('');
              onProjectChange('All');
              onCategoryChange('All');
              onVulnerabilityChange('All');
              onStatusChange('All');
            }}
            className="px-2 py-1 text-[11px] text-saffron hover:underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
