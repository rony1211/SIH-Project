'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText, HiOutlineScale,
  HiOutlineClipboardDocumentCheck, HiOutlineNewspaper,
  HiOutlineBanknotes, HiOutlineGlobeAlt,
  HiOutlineUserGroup, HiOutlineDocumentCheck,
  HiOutlineEye
} from 'react-icons/hi2';
import HashVerifier from './HashVerifier';

interface DocumentCardProps {
  doc: {
    id: string;
    title: string;
    projectName: string;
    category: string;
    state: string;
    district: string;
    status: string;
    version: number;
    uploadedBy: string;
    uploadedAt: string;
    fileSize: string;
    verificationHash: string;
  };
  index: number;
}

const categoryConfig: Record<string, { icon: React.ElementType; gradient: string; color: string }> = {
  'Gazette Notification': { icon: HiOutlineNewspaper, gradient: 'from-saffron to-orange-500', color: 'bg-saffron/10 text-saffron' },
  'Title Deed': { icon: HiOutlineDocumentCheck, gradient: 'from-emerald to-teal-500', color: 'bg-emerald/10 text-emerald' },
  'Joint Measurement Survey': { icon: HiOutlineClipboardDocumentCheck, gradient: 'from-royal to-indigo-500', color: 'bg-royal/10 text-royal' },
  'Court Order': { icon: HiOutlineScale, gradient: 'from-danger to-rose-500', color: 'bg-danger/10 text-danger' },
  'Compensation Award': { icon: HiOutlineBanknotes, gradient: 'from-purple-500 to-pink-500', color: 'bg-purple-500/10 text-purple-500' },
  'Environmental Clearance': { icon: HiOutlineGlobeAlt, gradient: 'from-cyan-500 to-blue-500', color: 'bg-cyan-500/10 text-cyan-500' },
  'R&R Plan': { icon: HiOutlineUserGroup, gradient: 'from-amber-500 to-yellow-500', color: 'bg-amber-500/10 text-amber-500' },
  'Possession Certificate': { icon: HiOutlineDocumentText, gradient: 'from-emerald to-cyan-500', color: 'bg-emerald/10 text-emerald' },
};

const statusConfig: Record<string, string> = {
  'Approved': 'bg-emerald/15 text-emerald border border-emerald/20',
  'Under Review': 'bg-saffron/15 text-saffron border border-saffron/20',
  'Draft': 'bg-white/10 text-muted border border-white/10',
  'Archived': 'bg-white/5 text-muted border border-white/5 opacity-70',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function DocumentCard({ doc, index }: DocumentCardProps) {
  const catConfig = categoryConfig[doc.category] || categoryConfig['Gazette Notification'];
  const Icon = catConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass rounded-2xl p-5 hover:surface-hover transition-all duration-300
        group cursor-pointer hover:scale-[1.02] hover:shadow-xl relative overflow-hidden
        border border-transparent hover:border-black/5 dark:hover:border-white/5"
    >
      {/* Top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${catConfig.gradient}
        opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl
        flex items-end justify-center pb-6 pointer-events-none z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15
          backdrop-blur-sm text-white text-sm font-medium pointer-events-auto">
          <HiOutlineEye className="w-4 h-4" />
          View Details
        </div>
      </div>

      {/* Category icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catConfig.gradient}
        flex items-center justify-center mb-4 shadow-lg
        group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-heading line-clamp-2 mb-2 leading-snug min-h-[40px]">
        {doc.title}
      </h3>

      {/* Project name */}
      <p className="text-xs text-muted mb-3 truncate">{doc.projectName}</p>

      {/* Category + Status pills */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
          ${catConfig.color}`}>
          {doc.category.split(' ')[0]}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
          ${statusConfig[doc.status] || statusConfig['Draft']}`}>
          {doc.status}
        </span>
      </div>

      {/* Meta */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Version</span>
          <span className="text-body font-medium">v{doc.version}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted">Size</span>
          <span className="text-body font-medium">{doc.fileSize}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted">Uploaded</span>
          <span className="text-body font-medium">{formatDate(doc.uploadedAt)}</span>
        </div>
      </div>

      {/* Hash */}
      <div className="pt-3 border-t border-black/5 dark:border-white/5">
        <HashVerifier hash={doc.verificationHash} verified={doc.status === 'Approved'} compact />
      </div>
    </motion.div>
  );
}
