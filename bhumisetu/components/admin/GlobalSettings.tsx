'use client';

import { useState } from 'react';
import { HiOutlineCheck, HiOutlineCog } from 'react-icons/hi2';

interface Settings {
  autoApproveDBT: boolean;
  strictSLAEnforcement: boolean;
  maxFieldSyncRetries: number;
  dataRetentionDays: number;
  maintenanceMode: boolean;
}

export default function GlobalSettings({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5">
        <h2 className="text-lg font-bold text-heading flex items-center gap-2">
          <HiOutlineCog className="w-5 h-5 text-muted" />
          Global Configuration
        </h2>
        <p className="text-xs text-muted mt-0.5">Platform-wide system parameters</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div>
              <h4 className="text-sm font-semibold text-heading">Strict SLA Enforcement</h4>
              <p className="text-xs text-muted mt-1">Automatically escalate grievances breaching 24h SLA</p>
            </div>
            <button 
              onClick={() => handleToggle('strictSLAEnforcement')}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.strictSLAEnforcement ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.strictSLAEnforcement ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div>
              <h4 className="text-sm font-semibold text-heading">Auto-Approve Low-Value DBT</h4>
              <p className="text-xs text-muted mt-1">Bypass manual review for compensation &lt; ₹50,000</p>
            </div>
            <button 
              onClick={() => handleToggle('autoApproveDBT')}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.autoApproveDBT ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.autoApproveDBT ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div>
              <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400">Maintenance Mode</h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">Block all non-admin access to the portal</p>
            </div>
            <button 
              onClick={() => handleToggle('maintenanceMode')}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-rose-500/30'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Input Settings */}
        <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-heading">Data Retention Period (Days)</label>
            <input 
              type="number" 
              value={settings.dataRetentionDays}
              onChange={(e) => setSettings(prev => ({ ...prev, dataRetentionDays: parseInt(e.target.value) || 0 }))}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        {showSuccess && (
          <span className="text-sm font-medium text-emerald-500 flex items-center gap-1">
            <HiOutlineCheck className="w-4 h-4" />
            Settings saved
          </span>
        )}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <HiOutlineCog className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </button>
      </div>
    </div>
  );
}
