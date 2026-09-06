'use client';

import { 
  HiOutlineShieldExclamation, 
  HiOutlineInformationCircle, 
  HiOutlineExclamationTriangle 
} from 'react-icons/hi2';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  severity: string;
}

export default function AuditLogViewer({ logs }: { logs: AuditLog[] }) {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return { color: 'text-rose-500', bg: 'bg-rose-500/10', icon: <HiOutlineShieldExclamation className="w-4 h-4 text-rose-500" /> };
      case 'Warning':
        return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <HiOutlineExclamationTriangle className="w-4 h-4 text-amber-500" /> };
      default:
        return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <HiOutlineInformationCircle className="w-4 h-4 text-blue-500" /> };
    }
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold text-heading">Immutable Audit Log</h2>
          <p className="text-xs text-muted mt-0.5">Chronological system action ledger</p>
        </div>
        <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Export Logs
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {logs.map((log, index) => {
          const style = getSeverityStyle(log.severity);
          return (
            <div key={log.id} className="relative pl-6">
              {/* Timeline Connector */}
              {index !== logs.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-black/5 dark:bg-white/5" />
              )}
              
              {/* Timeline Dot */}
              <div className={`absolute left-0 top-1 w-[22px] h-[22px] rounded-full flex items-center justify-center ${style.bg} border-2 border-white dark:border-slate-950 z-10`}>
                <div className={`w-2 h-2 rounded-full bg-current ${style.color}`} />
              </div>

              <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 ml-2 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <div className="flex items-center gap-2">
                    {style.icon}
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${style.color}`}>
                      {log.severity}
                    </span>
                    <span className="text-[10px] text-muted font-medium bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md">
                      {log.module}
                    </span>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <h4 className="text-sm font-semibold text-heading leading-snug">
                  {log.action}
                </h4>
                
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-heading">
                    {log.user.charAt(0)}
                  </div>
                  <span className="text-xs text-muted font-medium">
                    Triggered by <span className="text-heading">{log.user}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
