'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GrievanceTimeline from './GrievanceTimeline';
import SatisfactionSurvey from './SatisfactionSurvey';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlineEye,
  HiOutlineChevronUpDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowDownTray,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';

export interface GrievanceItem {
  id: string;
  name: string;
  phone: string;
  projectId?: string;
  projectName: string;
  district: string;
  state: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  filedDate: string;
  slaDeadline: string;
  resolvedDate: string | null;
  satisfactionRating: number | null;
  satisfactionComment?: string | null;
  timeline: { timestamp: string; status: string; actor: string; note: string }[];
}

interface GrievanceTableProps {
  grievances: GrievanceItem[];
  onSelectTicket?: (ticketId: string) => void;
}

const statusColors: Record<string, string> = {
  Filed: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  'Under Review': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  Assigned: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  'In Progress': 'bg-amber-500/15 text-saffron border border-saffron/30',
  Escalated: 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse',
  Resolved: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  Closed: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
};

const priorityColors: Record<string, string> = {
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Low: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

export default function GrievanceTable({ grievances, onSelectTicket }: GrievanceTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceItem | null>(null);
  const [sortField, setSortField] = useState<'filedDate' | 'slaDeadline' | 'priority'>('filedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories = useMemo(() => {
    const set = new Set(grievances.map((g) => g.category));
    return ['All', ...Array.from(set)];
  }, [grievances]);

  const statuses = ['All', 'Filed', 'Under Review', 'Assigned', 'In Progress', 'Escalated', 'Resolved', 'Closed'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const getSlaInfo = (g: GrievanceItem) => {
    if (g.resolvedDate) {
      return { label: 'Resolved', isBreached: false, isUrgent: false, color: 'text-emerald-400' };
    }
    const deadline = new Date(g.slaDeadline).getTime();
    const now = Date.now();
    const remainingMs = deadline - now;
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    if (remainingDays < 0) {
      return { label: `${Math.abs(remainingDays)}d overdue`, isBreached: true, isUrgent: true, color: 'text-red-400' };
    }
    if (remainingDays <= 5) {
      return { label: `${remainingDays}d left`, isBreached: false, isUrgent: true, color: 'text-orange-400' };
    }
    return { label: `${remainingDays}d left`, isBreached: false, isUrgent: false, color: 'text-emerald-400' };
  };

  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      if (categoryFilter !== 'All' && g.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && g.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && g.priority !== priorityFilter) return false;

      const sla = getSlaInfo(g);
      if (urgentOnly && !sla.isUrgent && !sla.isBreached && g.status !== 'Escalated') return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = g.id.toLowerCase().includes(q);
        const matchName = g.name.toLowerCase().includes(q);
        const matchProject = g.projectName.toLowerCase().includes(q);
        const matchDistrict = g.district.toLowerCase().includes(q);
        const matchDesc = g.description.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchProject && !matchDistrict && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortField === 'priority') {
        const order: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        const diff = (order[b.priority] || 0) - (order[a.priority] || 0);
        return sortAsc ? -diff : diff;
      }
      const timeA = new Date(a[sortField]).getTime();
      const timeB = new Date(b[sortField]).getTime();
      return sortAsc ? timeA - timeB : timeB - timeA;
    });
  }, [grievances, categoryFilter, statusFilter, priorityFilter, urgentOnly, search, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredGrievances.length / itemsPerPage);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGrievances.slice(start, start + itemsPerPage);
  }, [filteredGrievances, currentPage]);

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Complainant', 'Phone', 'Project', 'District', 'State', 'Category', 'Priority', 'Status', 'Filed Date', 'SLA Deadline'];
    const rows = filteredGrievances.map((g) => [
      g.id,
      g.name,
      g.phone,
      `"${g.projectName.replace(/"/g, '""')}"`,
      g.district,
      g.state,
      g.category,
      g.priority,
      g.status,
      new Date(g.filedDate).toLocaleDateString('en-IN'),
      new Date(g.slaDeadline).toLocaleDateString('en-IN'),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhumisetu_grievances_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ticket ID, citizen name, project, or district..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-white/5
                border border-transparent focus:border-saffron/50 focus:outline-none
                text-heading placeholder:text-muted transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-heading"
              >
                <HiOutlineXMark className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUrgentOnly(!urgentOnly);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all
                ${urgentOnly
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 text-muted hover:text-heading border border-transparent'
                }`}
            >
              <HiOutlineExclamationTriangle className="w-3.5 h-3.5" />
              <span>SLA At Risk ({grievances.filter((g) => getSlaInfo(g).isUrgent || g.status === 'Escalated').length})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5
                text-muted hover:text-heading border border-transparent hover:border-black/10 dark:hover:border-white/10
                flex items-center gap-1.5 transition-all"
            >
              <HiOutlineArrowDownTray className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <HiOutlineFunnel className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-heading
              border border-black/10 dark:border-white/10 focus:outline-none focus:border-saffron"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-heading
              border border-black/10 dark:border-white/10 focus:outline-none focus:border-saffron"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Status: {s}
              </option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-heading
              border border-black/10 dark:border-white/10 focus:outline-none focus:border-saffron"
          >
            {priorities.map((p) => (
              <option key={p} value={p} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Priority: {p}
              </option>
            ))}
          </select>

          {/* Sort Switcher */}
          <button
            onClick={() => {
              if (sortField === 'filedDate') setSortField('slaDeadline');
              else if (sortField === 'slaDeadline') setSortField('priority');
              else setSortField('filedDate');
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 text-muted hover:text-heading
              border border-black/10 dark:border-white/10 flex items-center gap-1 transition-colors ml-auto"
          >
            <HiOutlineChevronUpDown className="w-3.5 h-3.5" />
            <span>Sort: {sortField === 'filedDate' ? 'Date Filed' : sortField === 'slaDeadline' ? 'SLA Deadline' : 'Priority'}</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="glass rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02] text-muted uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Ticket ID</th>
                <th className="py-3.5 px-4 font-semibold">Citizen / Phone</th>
                <th className="py-3.5 px-4 font-semibold">Project & Location</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">SLA Window</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {pagedItems.map((g) => {
                const sla = getSlaInfo(g);
                return (
                  <tr
                    key={g.id}
                    className="hover:bg-black/5 dark:hover:bg-white/[0.04] transition-colors group cursor-pointer"
                    onClick={() => setSelectedGrievance(g)}
                  >
                    {/* Ticket ID */}
                    <td className="py-3 px-4 font-mono font-bold text-saffron whitespace-nowrap">
                      {g.id}
                    </td>

                    {/* Citizen / Phone */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-heading">{g.name}</div>
                      <div className="text-[10px] text-muted">{g.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1-****-$2')}</div>
                    </td>

                    {/* Project & Location */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-medium text-heading truncate flex items-center gap-1" title={g.projectName}>
                        <HiOutlineBuildingOffice2 className="w-3 h-3 text-muted shrink-0" />
                        <span className="truncate">{g.projectName}</span>
                      </div>
                      <div className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                        <HiOutlineMapPin className="w-2.5 h-2.5 shrink-0" />
                        <span>{g.district}, {g.state}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-muted font-medium text-[11px]">
                        {g.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${priorityColors[g.priority] || ''}`}>
                        {g.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${statusColors[g.status] || ''}`}>
                        {g.status}
                      </span>
                    </td>

                    {/* SLA Window */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineClock className={`w-3.5 h-3.5 ${sla.color} ${sla.isUrgent ? 'animate-pulse' : ''}`} />
                        <span className={`font-medium ${sla.color}`}>
                          {sla.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">
                        Due: {new Date(g.slaDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGrievance(g);
                        }}
                        className="p-1.5 rounded-lg text-muted hover:text-saffron hover:bg-saffron/10 transition-colors"
                        title="View Full Lifecycle"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pagedItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    <p className="text-sm font-medium">No grievances match the specified criteria.</p>
                    <p className="text-xs mt-1">Try resetting filters or clear your search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div>
            Showing <span className="text-heading font-medium">{filteredGrievances.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-heading font-medium">{Math.min(currentPage * itemsPerPage, filteredGrievances.length)}</span> of{' '}
            <span className="text-heading font-medium">{filteredGrievances.length}</span> complaints
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                    ${currentPage === page
                      ? 'bg-saffron text-white font-bold shadow-sm'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-heading'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grievance Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedGrievance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10 dark:border-white/10"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-start justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-saffron tabular-nums">{selectedGrievance.id}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${priorityColors[selectedGrievance.priority]}`}>
                      {selectedGrievance.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${statusColors[selectedGrievance.status]}`}>
                      {selectedGrievance.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Filed on {new Date(selectedGrievance.filedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Complainant & Project Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl text-xs">
                  <div>
                    <p className="text-muted text-[10px] uppercase tracking-wider">Complainant</p>
                    <p className="font-semibold text-heading text-sm mt-0.5">{selectedGrievance.name}</p>
                    <p className="text-muted mt-0.5">📞 {selectedGrievance.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted text-[10px] uppercase tracking-wider">Project & Location</p>
                    <p className="font-semibold text-heading mt-0.5">{selectedGrievance.projectName}</p>
                    <p className="text-muted mt-0.5">📍 {selectedGrievance.district}, {selectedGrievance.state}</p>
                  </div>
                  <div>
                    <p className="text-muted text-[10px] uppercase tracking-wider">Category</p>
                    <p className="font-medium text-heading mt-0.5">{selectedGrievance.category}</p>
                  </div>
                  <div>
                    <p className="text-muted text-[10px] uppercase tracking-wider">SLA Target</p>
                    <p className="font-medium text-heading mt-0.5">
                      Deadline: {new Date(selectedGrievance.slaDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">Complaint Statement</h4>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 text-xs text-body leading-relaxed">
                    {selectedGrievance.description}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-3">Audit Trail & Chain of Custody</h4>
                  <GrievanceTimeline events={selectedGrievance.timeline} />
                </div>

                {/* Post-Resolution Satisfaction */}
                {(selectedGrievance.status === 'Resolved' || selectedGrievance.status === 'Closed') && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <SatisfactionSurvey
                      existingRating={selectedGrievance.satisfactionRating}
                      existingComment={selectedGrievance.satisfactionComment || undefined}
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                {onSelectTicket && (
                  <button
                    onClick={() => {
                      const id = selectedGrievance.id;
                      setSelectedGrievance(null);
                      onSelectTicket(id);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-saffron bg-saffron/10 hover:bg-saffron/20 transition-colors"
                  >
                    Open in Live Tracker →
                  </button>
                )}
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
