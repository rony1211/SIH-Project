'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import GrievanceStatsBar from '@/components/grievance/GrievanceStatsBar';
import ComplaintForm from '@/components/grievance/ComplaintForm';
import ComplaintTracker from '@/components/grievance/ComplaintTracker';
import GrievanceTable, { GrievanceItem } from '@/components/grievance/GrievanceTable';
import {
  HiOutlineDocumentPlus,
  HiOutlineMagnifyingGlass,
  HiOutlineTableCells,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlineArrowPath,
} from 'react-icons/hi2';

export default function GrievancePage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<'file' | 'track' | 'registry'>('file');
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    filed: 0,
    inProgress: 0,
    escalated: 0,
    resolved: 0,
    avgResolutionDays: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [selectedTrackerId, setSelectedTrackerId] = useState<string>('GRV-2026-00001');

  const fetchGrievances = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/grievances');
      if (res.ok) {
        const data = await res.json();
        setGrievances(data.grievances || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load grievances:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  const handleComplaintSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        const newTicket = data.grievance.id;
        setSubmittedTicketId(newTicket);
        setSelectedTrackerId(newTicket);
        // Refresh grievance list & stats
        fetchGrievances();
      }
    } catch (err) {
      console.error('Failed to submit complaint:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectTicketFromTable = (ticketId: string) => {
    setSelectedTrackerId(ticketId);
    setActiveTab('track');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-heading">
              {t('grievance', 'title') || 'Citizen Grievance & SLA Portal'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Zero-Login Access
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            {t('grievance', 'subtitle') || 'Transparent, statutory timeline-enforced grievance redressal for land acquisition & R&R'}
          </p>
        </div>

        <button
          onClick={fetchGrievances}
          className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
            text-muted hover:text-heading transition-colors self-start md:self-auto flex items-center gap-2 text-xs font-medium"
          title="Refresh Data"
        >
          <HiOutlineArrowPath className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </motion.div>

      {/* KPI Stats Bar */}
      <GrievanceStatsBar stats={stats} />

      {/* Citizens Assurance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center shrink-0">
            <HiOutlineShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-heading">No Login Required</h4>
            <p className="text-[11px] text-muted">File immediately with name & mobile number</p>
          </div>
        </div>

        <div className="glass rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <HiOutlineClock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-heading">30-Day Statutory SLA</h4>
            <p className="text-[11px] text-muted">Automatic escalation to District Collector</p>
          </div>
        </div>

        <div className="glass rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-royal/15 text-royal flex items-center justify-center shrink-0">
            <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-heading">SMS Milestone Updates</h4>
            <p className="text-[11px] text-muted">Instant tracking SMS upon stage advancements</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('file')}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold transition-all relative
            ${activeTab === 'file'
              ? 'text-saffron'
              : 'text-muted hover:text-heading'
            }`}
        >
          <HiOutlineDocumentPlus className="w-4 h-4" />
          <span>File a Complaint</span>
          {activeTab === 'file' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold transition-all relative
            ${activeTab === 'track'
              ? 'text-saffron'
              : 'text-muted hover:text-heading'
            }`}
        >
          <HiOutlineMagnifyingGlass className="w-4 h-4" />
          <span>Track Complaint Status</span>
          {activeTab === 'track' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('registry')}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold transition-all relative
            ${activeTab === 'registry'
              ? 'text-saffron'
              : 'text-muted hover:text-heading'
            }`}
        >
          <HiOutlineTableCells className="w-4 h-4" />
          <span>Public Registry & SLA Board</span>
          <span className="px-2 py-0.2 rounded-full text-[10px] bg-black/5 dark:bg-white/10 font-normal">
            {grievances.length}
          </span>
          {activeTab === 'registry' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron"
            />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'file' && (
          <motion.div
            key="tab-file"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Form Wizard */}
            <div className="lg:col-span-8 glass rounded-2xl p-6 md:p-8">
              <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-heading">Submit Grievance or Dispute</h2>
                  <p className="text-xs text-muted mt-0.5">
                    Your complaint will be recorded with an immutable timestamp and assigned directly to the Competent Authority.
                  </p>
                </div>
                {submittedTicketId && (
                  <button
                    onClick={() => {
                      setSubmittedTicketId(null);
                    }}
                    className="text-xs font-semibold text-saffron hover:underline"
                  >
                    + File Another
                  </button>
                )}
              </div>

              <ComplaintForm
                onSubmit={handleComplaintSubmit}
                isSubmitting={isSubmitting}
                submittedId={submittedTicketId}
              />

              {submittedTicketId && (
                <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 text-center">
                  <button
                    onClick={() => {
                      setSelectedTrackerId(submittedTicketId);
                      setActiveTab('track');
                    }}
                    className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron to-emerald text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Track This Ticket Now →
                  </button>
                </div>
              )}
            </div>

            {/* Side Assistance & SLA Guidelines Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="glass rounded-2xl p-6 space-y-4 border-l-4 border-saffron">
                <div className="flex items-center gap-2">
                  <HiOutlineSparkles className="w-5 h-5 text-saffron" />
                  <h3 className="text-sm font-bold text-heading">Citizen Rights under RFCTLARR</h3>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, all affected families are legally entitled to:
                </p>
                <ul className="space-y-2 text-xs text-muted list-disc list-inside">
                  <li>Full compensation payout prior to possession handover</li>
                  <li>Solatium equivalent to 100% of market value calculation</li>
                  <li>Time-bound R&R benefits including housing or employment</li>
                  <li>Hearing before the Land Acquisition Authority for disputes</li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-6 space-y-3">
                <h4 className="text-xs font-bold text-heading uppercase tracking-wider">Escalation Matrix</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <span className="text-muted">Level 1 (Day 1-15)</span>
                    <span className="font-medium text-heading">CALA / Competent Authority</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <span className="text-muted">Level 2 (Day 16-25)</span>
                    <span className="font-medium text-heading">District Collector</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-red-400">Level 3 (Day 26+)</span>
                    <span className="font-bold text-red-400">State Revenue Secretary</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'track' && (
          <motion.div
            key="tab-track"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-heading">Live Grievance Tracking</h2>
                <p className="text-xs text-muted mt-1">
                  Track real-time officer progress, SLA countdown timers, and post-resolution satisfaction.
                </p>
              </div>

              <ComplaintTracker initialTicketId={selectedTrackerId} />
            </div>
          </motion.div>
        )}

        {activeTab === 'registry' && (
          <motion.div
            key="tab-registry"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <GrievanceTable
              grievances={grievances}
              onSelectTicket={handleSelectTicketFromTable}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
