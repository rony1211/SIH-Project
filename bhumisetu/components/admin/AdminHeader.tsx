'use client';

import { motion } from 'framer-motion';
import { HiOutlineCog6Tooth, HiOutlineServerStack } from 'react-icons/hi2';

export default function AdminHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-heading">
            Admin Command Center
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1 shadow-sm">
            <HiOutlineCog6Tooth className="w-3 h-3 animate-spin-slow" />
            System Control
          </span>
        </div>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Global platform settings, user access control, system health monitoring, and immutable audit logs.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Server Status */}
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Master Server</span>
            <span className="text-xs font-semibold text-heading flex items-center gap-1">
              <HiOutlineServerStack className="w-3.5 h-3.5 text-emerald-500" />
              Online & Syncing
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
