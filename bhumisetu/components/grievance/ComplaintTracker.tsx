'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GrievanceTimeline from './GrievanceTimeline';
import SatisfactionSurvey from './SatisfactionSurvey';
import {
  HiOutlineMagnifyingGlass, HiOutlineExclamationTriangle,
  HiOutlineMapPin, HiOutlineClock, HiOutlineUserCircle
} from 'react-icons/hi2';

interface Grievance {
  id: string;
  name: string;
  phone: string;
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

const priorityColors: Record<string, string> = {
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Low: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

const statusColors: Record<string, string> = {
  Filed: 'bg-sky-500/15 text-sky-400',
  'Under Review': 'bg-amber-500/15 text-amber-400',
  Assigned: 'bg-purple-500/15 text-purple-400',
  'In Progress': 'bg-saffron/15 text-saffron',
  Escalated: 'bg-red-500/15 text-red-400',
  Resolved: 'bg-emerald-500/15 text-emerald-400',
  Closed: 'bg-teal-500/15 text-teal-400',
};

export default function ComplaintTracker({ initialTicketId }: { initialTicketId?: string }) {
  const [ticketId, setTicketId] = useState(initialTicketId || '');
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performSearch = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setError('');
    setGrievance(null);

    try {
      const res = await fetch(`/api/grievances/${idToSearch.trim()}`);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      setGrievance(data.grievance);
    } catch {
      setError('No complaint found with this ticket ID. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch(ticketId);
  };

  useEffect(() => {
    if (initialTicketId) {
      setTicketId(initialTicketId);
      performSearch(initialTicketId);
    }
  }, [initialTicketId]);

  const getSlaStatus = (g: Grievance) => {
    if (g.resolvedDate) return { label: 'Resolved', color: 'text-emerald-400', urgent: false };
    const now = Date.now();
    const deadline = new Date(g.slaDeadline).getTime();
    const remaining = deadline - now;
    const totalSla = deadline - new Date(g.filedDate).getTime();
    const consumed = ((totalSla - remaining) / totalSla) * 100;

    if (remaining <= 0) return { label: 'SLA BREACHED', color: 'text-red-400', urgent: true };
    if (consumed > 80) return { label: `${Math.ceil(remaining / (1000 * 60 * 60 * 24))}d left — URGENT`, color: 'text-orange-400', urgent: true };
    return { label: `${Math.ceil(remaining / (1000 * 60 * 60 * 24))} days remaining`, color: 'text-emerald-400', urgent: false };
  };

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter your Ticket ID (e.g. GRV-2026-00001)"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/5
              border border-transparent focus:border-saffron/50 focus:outline-none
              text-heading placeholder:text-muted transition-all duration-200 tabular-nums"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !ticketId.trim()}
          className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron to-emerald
            text-white shadow-md hover:shadow-lg transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : 'Track'}
        </button>
      </div>

      {/* Example IDs */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[10px] text-muted">Try:</span>
        {['GRV-2026-00001', 'GRV-2026-00002', 'GRV-2026-00005'].map((id) => (
          <button
            key={id}
            onClick={() => { setTicketId(id); }}
            className="px-2 py-0.5 rounded-md text-[10px] text-saffron bg-saffron/10
              hover:bg-saffron/20 transition-colors tabular-nums"
          >
            {id}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-4 text-center text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Result Card */}
      <AnimatePresence>
        {grievance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-black/5 dark:border-white/5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Ticket ID</p>
                  <p className="text-lg font-bold text-saffron tabular-nums">{grievance.id}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border
                    ${priorityColors[grievance.priority] || ''}`}>
                    {grievance.priority}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium
                    ${statusColors[grievance.status] || ''}`}>
                    {grievance.status}
                  </span>
                </div>
              </div>

              {/* SLA Timer */}
              {(() => {
                const sla = getSlaStatus(grievance);
                return (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                    ${sla.urgent ? 'bg-red-500/10 border border-red-500/20' : 'bg-black/5 dark:bg-white/5'}`}>
                    <HiOutlineClock className={`w-4 h-4 ${sla.color} ${sla.urgent ? 'animate-pulse' : ''}`} />
                    <span className={`font-medium ${sla.color}`}>SLA: {sla.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted">Complainant</p>
                  <p className="text-heading font-medium flex items-center gap-1">
                    <HiOutlineUserCircle className="w-3.5 h-3.5" />
                    {grievance.name}
                  </p>
                </div>
                <div>
                  <p className="text-muted">Category</p>
                  <p className="text-heading font-medium">{grievance.category}</p>
                </div>
                <div>
                  <p className="text-muted">Project</p>
                  <p className="text-heading font-medium">{grievance.projectName}</p>
                </div>
                <div>
                  <p className="text-muted">Location</p>
                  <p className="text-heading font-medium flex items-center gap-1">
                    <HiOutlineMapPin className="w-3 h-3" />
                    {grievance.district}, {grievance.state}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Description</p>
                <p className="text-xs text-body leading-relaxed">{grievance.description}</p>
              </div>

              {/* Escalation Alert */}
              {grievance.status === 'Escalated' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <HiOutlineExclamationTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-xs text-red-400 font-medium">
                    This complaint has been escalated due to SLA breach risk
                  </span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="p-5 border-t border-black/5 dark:border-white/5">
              <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-3">
                Resolution Timeline
              </h4>
              <GrievanceTimeline events={grievance.timeline} />
            </div>

            {/* Satisfaction Survey */}
            {(grievance.status === 'Resolved' || grievance.status === 'Closed') && (
              <div className="p-5 border-t border-black/5 dark:border-white/5">
                <SatisfactionSurvey
                  existingRating={grievance.satisfactionRating}
                  existingComment={grievance.satisfactionComment || undefined}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
