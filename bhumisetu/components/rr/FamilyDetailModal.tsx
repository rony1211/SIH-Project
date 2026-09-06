'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FamilyRecord } from '@/lib/rrStore';
import {
  HiOutlineXMark,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineTruck,
  HiOutlineBuildingStorefront,
  HiOutlineSparkles,
  HiOutlineCheckBadge,
  HiOutlineExclamationCircle,
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

interface FamilyDetailModalProps {
  family: FamilyRecord | null;
  onClose: () => void;
  onUpdateEntitlement: (
    familyId: string,
    entitlementKey: keyof FamilyRecord['entitlements'],
    status: any,
    note: string
  ) => Promise<void>;
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

export default function FamilyDetailModal({
  family,
  onClose,
  onUpdateEntitlement,
}: FamilyDetailModalProps) {
  const [selectedEntitlement, setSelectedEntitlement] = useState<keyof FamilyRecord['entitlements']>('housing');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!family) return null;

  const entitlementKeys: {
    key: keyof FamilyRecord['entitlements'];
    label: string;
    icon: typeof HiOutlineHome;
    scheduleRef: string;
  }[] = [
    { key: 'housing', label: 'Housing Allotment', icon: HiOutlineHome, scheduleRef: 'Schedule II, Para 1' },
    { key: 'employment', label: 'Employment / Livelihood', icon: HiOutlineBriefcase, scheduleRef: 'Schedule II, Para 4' },
    { key: 'annuity', label: 'Subsistence Annuity', icon: HiOutlineCurrencyRupee, scheduleRef: 'Schedule II, Para 5' },
    { key: 'transportationAllowance', label: 'Transportation Allowance', icon: HiOutlineTruck, scheduleRef: 'Schedule II, Para 8' },
    { key: 'resettlementGrant', label: 'Statutory Resettlement Grant', icon: HiOutlineSparkles, scheduleRef: 'Schedule II, Para 7' },
    { key: 'cattleShedGrant', label: 'Cattle Shed / Artisan Grant', icon: HiOutlineBuildingStorefront, scheduleRef: 'Schedule II, Para 9' },
  ];

  const handleSimulateDisbursement = async () => {
    setIsUpdating(true);
    setSuccessMessage('');
    try {
      const isHousing = selectedEntitlement === 'housing';
      const isJob = selectedEntitlement === 'employment';
      const targetStatus = isHousing ? 'Allotted' : isJob ? 'Delivered' : 'Paid';
      const note = `Disbursed via PFMS Aadhaar Payment Bridge (Txn Ref: DBT${Math.floor(1000000 + Math.random() * 9000000)})`;

      await onUpdateEntitlement(family.id, selectedEntitlement, targetStatus, note);
      setSuccessMessage(`Statutory benefit successfully credited to ${family.headOfFamily}'s bank account.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="glass rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10 dark:border-white/10"
        >
          {/* Header */}
          <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-start justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-saffron font-mono">{family.id}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    family.category === 'Physically Displaced'
                      ? 'bg-amber-500/15 text-saffron border-saffron/30'
                      : 'bg-royal/15 text-royal border-royal/30'
                  }`}
                >
                  {family.category}
                </span>
                {family.vulnerability.includes('SC') || family.vulnerability.includes('ST') ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                    Sec 41 Special Priority
                  </span>
                ) : null}
              </div>
              <h2 className="text-xl font-bold text-heading mt-1">{family.headOfFamily}</h2>
              <p className="text-xs text-muted">
                {family.village}, {family.district}, {family.state} · {family.familyMembers} Family Members
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Success Toast */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
              >
                <HiOutlineCheckCircle className="w-5 h-5 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Profile & Banking Verification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/5 dark:bg-white/5 p-4 rounded-xl text-xs">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Infrastructure Project</p>
                <p className="font-semibold text-heading mt-0.5">{family.projectName}</p>
                <p className="text-[11px] text-muted mt-0.5">Project Code: {family.projectId}</p>
              </div>

              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Aadhaar & Verification</p>
                <p className="font-semibold text-heading mt-0.5">UID: {family.aadhaarMasked}</p>
                <p className="text-[11px] text-saffron mt-0.5">{family.vulnerability}</p>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <p className="text-[10px] text-muted uppercase tracking-wider">Bank & Direct Benefit Transfer (DBT)</p>
                <p className="font-medium text-heading mt-0.5">
                  {family.bankDetails.bankName} (A/C: {family.bankDetails.accountNo})
                </p>
                <p className="text-[10px] text-muted">IFSC: {family.bankDetails.ifsc}</p>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <p className="text-[10px] text-muted uppercase tracking-wider">DBT Verification Status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {family.bankDetails.dbtVerified ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                      <HiOutlineCheckBadge className="w-4 h-4" />
                      Aadhaar NPCI Mapped (Ready for Immediate Credit)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold text-xs">
                      <HiOutlineExclamationCircle className="w-4 h-4" />
                      Pending NPCI Aadhaar Seeding
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RFCTLARR Act Second Schedule Entitlements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-heading uppercase tracking-wider">
                  RFCTLARR Act 2013 — Second Schedule Entitlements
                </h3>
                <span className="text-xs font-bold text-saffron tabular-nums">
                  {family.overallProgress}% Complete
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entitlementKeys.map((item) => {
                  const ent = family.entitlements[item.key];
                  const Icon = item.icon;
                  const isSelected = selectedEntitlement === item.key;
                  return (
                    <div
                      key={item.key}
                      onClick={() => setSelectedEntitlement(item.key)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-saffron bg-saffron/5 shadow-sm'
                          : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-saffron' : 'text-muted'}`} />
                          <span className="text-xs font-bold text-heading">{item.label}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${statusColors[ent.status] || ''}`}>
                          {ent.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-muted">{item.scheduleRef}</span>
                        <span className="font-bold text-heading">{ent.value}</span>
                      </div>

                      <p className="text-[10px] text-body line-clamp-2 leading-relaxed">
                        {ent.details}
                      </p>

                      {ent.completedDate && (
                        <p className="text-[9px] text-emerald-400 mt-1">
                          ✓ Fulfilled on {new Date(ent.completedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Third Schedule Resettlement Colony Amenities */}
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-heading uppercase tracking-wider">
                  Third Schedule Resettlement Colony Allocation
                </h4>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    family.colonyDetails.possessionHandedOver
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-amber-500/15 text-saffron'
                  }`}
                >
                  {family.colonyDetails.possessionHandedOver ? 'Possession Handed Over' : 'Colony Under Construction'}
                </span>
              </div>
              <p className="text-xs text-heading font-medium">{family.colonyDetails.name}</p>
              {family.colonyDetails.amenitiesReady.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {family.colonyDetails.amenitiesReady.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Administrative Action Bar */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-saffron/10 via-emerald/10 to-royal/10 border border-saffron/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-heading flex items-center gap-1.5">
                    <HiOutlineBanknotes className="w-4 h-4 text-saffron" />
                    <span>Disburse / Fulfill Entitlement ({selectedEntitlement})</span>
                  </h4>
                  <p className="text-[11px] text-muted mt-0.5">
                    Trigger automated PFMS DBT electronic transfer or certify physical asset handover
                  </p>
                </div>

                <button
                  disabled={
                    isUpdating ||
                    ['Allotted', 'Delivered', 'Paid', 'Active', 'Not Applicable'].includes(
                      family.entitlements[selectedEntitlement].status
                    )
                  }
                  onClick={handleSimulateDisbursement}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron to-emerald
                    text-white shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Transacting...' : '⚡ Release DBT / Fulfill'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-black/10 dark:border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
