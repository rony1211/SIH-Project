'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChevronDown, HiOutlineChevronUp,
  HiOutlineDocumentText, HiOutlineNewspaper,
  HiOutlineDocumentCheck, HiOutlineClipboardDocumentCheck,
  HiOutlineScale, HiOutlineBanknotes,
  HiOutlineGlobeAlt, HiOutlineUserGroup
} from 'react-icons/hi2';
import HashVerifier from './HashVerifier';
import AuditTrailTimeline from './AuditTrailTimeline';

interface AuditEvent {
  timestamp: string;
  actor: string;
  action: string;
  type: 'upload' | 'review' | 'approval' | 'rejection' | 'verification';
}

interface Document {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  category: string;
  state: string;
  district: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  version: number;
  status: string;
  verificationHash: string;
  tags: string[];
  auditTrail: AuditEvent[];
}

interface DocumentTableProps {
  documents: Document[];
}

const categoryConfig: Record<string, { icon: React.ElementType; color: string }> = {
  'Gazette Notification': { icon: HiOutlineNewspaper, color: 'bg-saffron/10 text-saffron' },
  'Title Deed': { icon: HiOutlineDocumentCheck, color: 'bg-emerald/10 text-emerald' },
  'Joint Measurement Survey': { icon: HiOutlineClipboardDocumentCheck, color: 'bg-royal/10 text-royal' },
  'Court Order': { icon: HiOutlineScale, color: 'bg-danger/10 text-danger' },
  'Compensation Award': { icon: HiOutlineBanknotes, color: 'bg-purple-500/10 text-purple-500' },
  'Environmental Clearance': { icon: HiOutlineGlobeAlt, color: 'bg-cyan-500/10 text-cyan-500' },
  'R&R Plan': { icon: HiOutlineUserGroup, color: 'bg-amber-500/10 text-amber-500' },
  'Possession Certificate': { icon: HiOutlineDocumentText, color: 'bg-emerald/10 text-emerald' },
};

const statusConfig: Record<string, { class: string; glow: string }> = {
  'Approved': { class: 'bg-emerald/15 text-emerald', glow: 'shadow-emerald/20' },
  'Under Review': { class: 'bg-saffron/15 text-saffron animate-pulse', glow: 'shadow-saffron/20' },
  'Draft': { class: 'bg-white/10 text-muted', glow: '' },
  'Archived': { class: 'bg-white/5 text-muted opacity-60', glow: '' },
};

type SortKey = 'title' | 'category' | 'status' | 'version' | 'uploadedAt';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('uploadedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...documents].sort((a, b) => {
    let valA: string | number = '';
    let valB: string | number = '';

    switch (sortKey) {
      case 'title': valA = a.title; valB = b.title; break;
      case 'category': valA = a.category; valB = b.category; break;
      case 'status': valA = a.status; valB = b.status; break;
      case 'version': valA = a.version; valB = b.version; break;
      case 'uploadedAt': valA = a.uploadedAt; valB = b.uploadedAt; break;
    }

    if (typeof valA === 'string') {
      return sortDir === 'asc'
        ? valA.localeCompare(valB as string)
        : (valB as string).localeCompare(valA);
    }
    return sortDir === 'asc' ? valA - (valB as number) : (valB as number) - valA;
  });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <HiOutlineChevronDown className="w-3 h-3 text-muted/40" />;
    return sortDir === 'asc'
      ? <HiOutlineChevronUp className="w-3 h-3 text-saffron" />
      : <HiOutlineChevronDown className="w-3 h-3 text-saffron" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5">
              {[
                { key: 'title' as SortKey, label: 'Document' },
                { key: 'category' as SortKey, label: 'Category' },
                { key: 'status' as SortKey, label: 'Status' },
                { key: 'version' as SortKey, label: 'Ver.' },
                { key: 'uploadedAt' as SortKey, label: 'Uploaded' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider
                    cursor-pointer hover:text-heading transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon column={key} />
                  </div>
                </th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                State
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                Hash
              </th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((doc, i) => {
              const isExpanded = expandedRow === doc.id;
              const catCfg = categoryConfig[doc.category] || categoryConfig['Gazette Notification'];
              const CatIcon = catCfg.icon;
              const statusCfg = statusConfig[doc.status] || statusConfig['Draft'];

              return (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="contents"
                >
                  {/* Main row as a wrapper */}
                  <tr
                    onClick={() => setExpandedRow(isExpanded ? null : doc.id)}
                    className={`border-b border-black/3 dark:border-white/3 cursor-pointer transition-all duration-200
                      hover:bg-black/3 dark:hover:bg-white/3
                      ${isExpanded ? 'bg-black/5 dark:bg-white/5' : ''}`}
                  >
                    {/* Document */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-[250px]">
                        <div className={`w-9 h-9 rounded-lg ${catCfg.color} flex items-center justify-center flex-shrink-0`}>
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-heading truncate max-w-[280px]">{doc.title}</p>
                          <p className="text-[11px] text-muted truncate">{doc.projectName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px]
                        font-semibold uppercase tracking-wider ${catCfg.color}`}>
                        {doc.category.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px]
                        font-semibold uppercase tracking-wider ${statusCfg.class} ${statusCfg.glow}`}>
                        {doc.status === 'Approved' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald mr-1.5" />
                        )}
                        {doc.status}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-body bg-black/5 dark:bg-white/5
                        px-2 py-0.5 rounded">v{doc.version}</span>
                    </td>

                    {/* Uploaded */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-xs text-body">{formatDate(doc.uploadedAt)}</p>
                        <p className="text-[10px] text-muted">{doc.uploadedBy}</p>
                      </div>
                    </td>

                    {/* State */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-xs text-body">{doc.state}</p>
                        <p className="text-[10px] text-muted">{doc.district}</p>
                      </div>
                    </td>

                    {/* Hash */}
                    <td className="px-4 py-3.5">
                      <HashVerifier
                        hash={doc.verificationHash}
                        verified={doc.status === 'Approved' || doc.status === 'Archived'}
                        compact
                      />
                    </td>

                    {/* Expand toggle */}
                    <td className="px-4 py-3.5">
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HiOutlineChevronDown className="w-4 h-4 text-muted" />
                      </motion.div>
                    </td>
                  </tr>

                  {/* Expanded audit trail row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8}>
                        <AnimatePresence>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-5 bg-black/3 dark:bg-white/3
                              border-b border-black/5 dark:border-white/5">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-saffron to-emerald" />
                                <h4 className="text-sm font-semibold text-heading">
                                  Chain of Custody — Audit Trail
                                </h4>
                                <span className="text-[10px] text-muted bg-black/5 dark:bg-white/5
                                  px-2 py-0.5 rounded-full">
                                  {doc.auditTrail.length} events
                                </span>
                              </div>

                              <div className="grid lg:grid-cols-2 gap-6">
                                {/* Timeline */}
                                <AuditTrailTimeline events={doc.auditTrail} />

                                {/* Document metadata */}
                                <div className="space-y-3">
                                  <div className="glass rounded-xl p-4">
                                    <p className="text-[10px] text-muted uppercase tracking-wider mb-2">
                                      Document Integrity
                                    </p>
                                    <HashVerifier
                                      hash={doc.verificationHash}
                                      verified={doc.status === 'Approved' || doc.status === 'Archived'}
                                    />
                                  </div>

                                  <div className="glass rounded-xl p-4">
                                    <p className="text-[10px] text-muted uppercase tracking-wider mb-2">
                                      Tags
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {doc.tags.map((tag, ti) => (
                                        <span key={ti} className="px-2 py-0.5 rounded-full text-[10px]
                                          bg-black/5 dark:bg-white/5 text-body font-medium">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="glass rounded-xl p-4 grid grid-cols-2 gap-3">
                                    <div>
                                      <p className="text-[10px] text-muted">File Size</p>
                                      <p className="text-sm font-medium text-heading">{doc.fileSize}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-muted">File Type</p>
                                      <p className="text-sm font-medium text-heading">PDF</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-muted">Project ID</p>
                                      <p className="text-sm font-medium text-heading font-mono">{doc.projectId}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-muted">Document ID</p>
                                      <p className="text-sm font-medium text-heading font-mono">{doc.id}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </td>
                    </tr>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <HiOutlineDocumentText className="w-12 h-12 text-muted/30 mb-3" />
          <p className="text-sm text-muted">No documents match your filters</p>
        </div>
      )}
    </motion.div>
  );
}
