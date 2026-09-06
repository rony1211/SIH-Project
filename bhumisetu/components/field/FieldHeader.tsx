'use client';

import { HiOutlineWifi, HiOutlineArrowPath, HiOutlineUserCircle, HiOutlineBellAlert } from 'react-icons/hi2';

interface FieldHeaderProps {
  isOnline: boolean;
  isSyncing: boolean;
  onSync: () => void;
  pendingSyncCount: number;
}

export default function FieldHeader({ isOnline, isSyncing, onSync, pendingSyncCount }: FieldHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/5">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto relative">
        
        {/* Officer Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                <HiOutlineUserCircle className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
            </div>
            {/* Status Dot */}
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 
              ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-heading leading-tight">Officer Ramesh</h2>
            <p className="text-xs text-muted flex items-center gap-1 font-medium">
              <HiOutlineWifi className={`w-3 h-3 ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`} />
              {isOnline ? 'Connected' : 'Offline Mode'}
            </p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <HiOutlineBellAlert className="w-6 h-6 text-body" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {/* Sync Button */}
          <button 
            onClick={onSync}
            disabled={!isOnline || isSyncing || pendingSyncCount === 0}
            className={`relative p-2 rounded-full transition-all duration-300
              ${isSyncing ? 'bg-blue-500/20 text-blue-500' : 
                pendingSyncCount > 0 ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 
                'hover:bg-black/5 dark:hover:bg-white/5 text-body'}`}
          >
            <HiOutlineArrowPath className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
            {pendingSyncCount > 0 && !isSyncing && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {pendingSyncCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Offline Banner */}
      {!isOnline && (
        <div className="w-full bg-rose-500/10 border-b border-rose-500/20">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
            <HiOutlineWifi className="w-5 h-5" />
            No internet connection. Changes will sync when online.
          </div>
        </div>
      )}
    </div>
  );
}
