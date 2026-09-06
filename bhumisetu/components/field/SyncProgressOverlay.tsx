'use client';

import { HiOutlineCloudArrowUp, HiOutlineCheckCircle } from 'react-icons/hi2';

interface SyncProgressOverlayProps {
  isVisible: boolean;
  isComplete: boolean;
  syncedCount: number;
}

export default function SyncProgressOverlay({ isVisible, isComplete, syncedCount }: SyncProgressOverlayProps) {
  if (!isVisible && !isComplete) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-xs w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        
        <div className="relative w-24 h-24 mb-6">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
          
          {isComplete ? (
            <div className="absolute inset-0 flex items-center justify-center text-emerald-500 animate-in zoom-in duration-500">
              <HiOutlineCheckCircle className="w-16 h-16" />
            </div>
          ) : (
            <>
              {/* Spinner */}
              <svg className="absolute inset-0 w-full h-full text-blue-500 animate-spin" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="46" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="289"
                  strokeDashoffset="72"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-blue-500 animate-pulse">
                <HiOutlineCloudArrowUp className="w-10 h-10" />
              </div>
            </>
          )}
        </div>

        <h3 className="text-xl font-bold text-heading mb-2">
          {isComplete ? 'Sync Complete!' : 'Syncing Data...'}
        </h3>
        
        <p className="text-sm text-muted">
          {isComplete 
            ? `Successfully pushed ${syncedCount} task${syncedCount !== 1 ? 's' : ''} to the server.` 
            : `Pushing ${syncedCount} offline task${syncedCount !== 1 ? 's' : ''} to the server. Please wait.`}
        </p>

        {isComplete && (
          <div className="mt-6 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            Up to date
          </div>
        )}
      </div>
    </div>
  );
}
