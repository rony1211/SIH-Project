'use client';

import { useState, useMemo } from 'react';
import { FamilyRecord } from '@/lib/rrStore';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
  HiOutlineCheckBadge,
  HiOutlineExclamationCircle,
  HiOutlineChevronUpDown,
} from 'react-icons/hi2';

interface FamilyTableProps {
  families: FamilyRecord[];
  onInspect: (family: FamilyRecord) => void;
}

const statusColors: Record<string, string> = {
  Allotted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'In Progress': 'bg-amber-500/15 text-saffron border-saffron/30',
  Pending: 'bg-red-500/15 text-red-400 border-red-500/30',
  'Not Applicable': 'bg-black/5 dark:bg-white/5 text-muted border-transparent',
};

export default function FamilyTable({ families, onInspect }: FamilyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'id' | 'headOfFamily' | 'overallProgress'>('overallProgress');
  const [sortAsc, setSortAsc] = useState(false);
  const itemsPerPage = 10;

  const sortedFamilies = useMemo(() => {
    return [...families].sort((a, b) => {
      if (sortField === 'overallProgress') {
        const diff = a.overallProgress - b.overallProgress;
        return sortAsc ? diff : -diff;
      }
      const valA = a[sortField].toLowerCase();
      const valB = b[sortField].toLowerCase();
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [families, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedFamilies.length / itemsPerPage);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedFamilies.slice(start, start + itemsPerPage);
  }, [sortedFamilies, currentPage]);

  const toggleSort = (field: 'id' | 'headOfFamily' | 'overallProgress') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02] text-muted uppercase text-[10px] tracking-wider">
              <th
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-heading transition-colors"
                onClick={() => toggleSort('id')}
              >
                <div className="flex items-center gap-1">
                  <span>Family ID</span>
                  <HiOutlineChevronUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-heading transition-colors"
                onClick={() => toggleSort('headOfFamily')}
              >
                <div className="flex items-center gap-1">
                  <span>Head of Family</span>
                  <HiOutlineChevronUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Project & Village</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th className="py-3.5 px-4 font-semibold">Housing</th>
              <th className="py-3.5 px-4 font-semibold">Livelihood</th>
              <th className="py-3.5 px-4 font-semibold">Annuity</th>
              <th
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-heading transition-colors"
                onClick={() => toggleSort('overallProgress')}
              >
                <div className="flex items-center gap-1">
                  <span>Progress</span>
                  <HiOutlineChevronUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {pagedItems.map((f) => (
              <tr
                key={f.id}
                className="hover:bg-black/5 dark:hover:bg-white/[0.04] transition-colors group cursor-pointer"
                onClick={() => onInspect(f)}
              >
                {/* Family ID */}
                <td className="py-3 px-4 font-mono font-bold text-saffron whitespace-nowrap">
                  {f.id}
                </td>

                {/* Head of Family + Verification */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-heading flex items-center gap-1.5">
                    <span>{f.headOfFamily}</span>
                    {f.bankDetails.dbtVerified ? (
                      <HiOutlineCheckBadge className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="DBT Verified" />
                    ) : (
                      <HiOutlineExclamationCircle className="w-3.5 h-3.5 text-red-400 shrink-0" title="DBT KYC Pending" />
                    )}
                  </div>
                  <div className="text-[10px] text-muted">
                    {f.familyMembers} members · {f.aadhaarMasked}
                  </div>
                </td>

                {/* Project & Village */}
                <td className="py-3 px-4 max-w-[200px]">
                  <div className="font-medium text-heading truncate" title={f.projectName}>
                    {f.projectName}
                  </div>
                  <div className="text-[10px] text-muted truncate">
                    {f.village}, {f.district}
                  </div>
                </td>

                {/* Category & Priority */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="text-[11px] font-medium text-heading">{f.category}</div>
                  <div className="text-[10px] text-saffron">{f.vulnerability}</div>
                </td>

                {/* Housing */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusColors[f.entitlements.housing.status] || ''}`}>
                    {f.entitlements.housing.status}
                  </span>
                </td>

                {/* Livelihood */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusColors[f.entitlements.employment.status] || ''}`}>
                    {f.entitlements.employment.status}
                  </span>
                </td>

                {/* Annuity */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusColors[f.entitlements.annuity.status] || ''}`}>
                    {f.entitlements.annuity.status}
                  </span>
                </td>

                {/* Overall Progress */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          f.overallProgress === 100
                            ? 'bg-emerald-400'
                            : f.overallProgress >= 60
                            ? 'bg-saffron'
                            : 'bg-red-400'
                        }`}
                        style={{ width: `${f.overallProgress}%` }}
                      />
                    </div>
                    <span className="font-bold text-heading tabular-nums text-[11px]">
                      {f.overallProgress}%
                    </span>
                  </div>
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspect(f);
                    }}
                    className="p-1.5 rounded-lg text-muted hover:text-saffron hover:bg-saffron/10 transition-colors"
                    title="View Entitlement Dossier"
                  >
                    <HiOutlineEye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {pagedItems.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-muted">
                  <p className="text-sm font-medium">No family records match the criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
        <div>
          Showing <span className="text-heading font-medium">{sortedFamilies.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="text-heading font-medium">{Math.min(currentPage * itemsPerPage, sortedFamilies.length)}</span> of{' '}
          <span className="text-heading font-medium">{sortedFamilies.length}</span> families
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
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === page
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
  );
}
