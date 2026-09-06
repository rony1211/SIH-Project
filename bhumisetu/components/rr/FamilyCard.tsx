'use client';

import { motion } from 'framer-motion';
import { FamilyRecord } from '@/lib/rrStore';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineTruck,
  HiOutlineMapPin,
  HiOutlineBuildingOffice2,
  HiOutlineCheckBadge,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';

interface FamilyCardProps {
  family: FamilyRecord;
  index: number;
  onInspect: (family: FamilyRecord) => void;
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

export default function FamilyCard({ family, index, onInspect }: FamilyCardProps) {
  const getProgressColor = (val: number) => {
    if (val === 100) return 'from-emerald to-teal-400';
    if (val >= 60) return 'from-saffron to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="glass rounded-2xl p-5 hover:surface-hover transition-all duration-300
        flex flex-col justify-between group relative overflow-hidden shadow-sm hover:shadow-lg border border-black/5 dark:border-white/5"
    >
      {/* Top Bar Accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getProgressColor(
          family.overallProgress
        )}`}
      />

      <div className="space-y-4">
        {/* Header: ID + Category Badges */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-saffron">{family.id}</span>
              {family.bankDetails.dbtVerified ? (
                <span
                  className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                  title="Aadhaar Payment Bridge DBT Verified"
                >
                  <HiOutlineCheckBadge className="w-3 h-3" />
                  <span>DBT Verified</span>
                </span>
              ) : (
                <span
                  className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded"
                  title="Aadhaar DBT Linking Pending"
                >
                  <HiOutlineExclamationCircle className="w-3 h-3" />
                  <span>DBT Pending</span>
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-heading mt-1 group-hover:text-saffron transition-colors">
              {family.headOfFamily}
            </h3>
            <p className="text-[11px] text-muted">
              {family.familyMembers} family members · Aadhaar: {family.aadhaarMasked}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                family.category === 'Physically Displaced'
                  ? 'bg-amber-500/15 text-saffron border-saffron/30'
                  : 'bg-royal/15 text-royal border-royal/30'
              }`}
            >
              {family.category}
            </span>

            {family.vulnerability.includes('SC') || family.vulnerability.includes('ST') ? (
              <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                Sec 41 Special Priority
              </span>
            ) : null}
          </div>
        </div>

        {/* Location & Project */}
        <div className="bg-black/5 dark:bg-white/[0.03] p-2.5 rounded-xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-muted truncate">
            <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 shrink-0 text-muted" />
            <span className="truncate">{family.projectName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted">
            <HiOutlineMapPin className="w-3.5 h-3.5 shrink-0 text-muted" />
            <span>
              {family.village}, {family.district}, {family.state}
            </span>
          </div>
        </div>

        {/* 4 Entitlement Status Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Housing */}
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted flex items-center gap-1">
                <HiOutlineHome className="w-3 h-3" /> Housing
              </span>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                  statusColors[family.entitlements.housing.status] || ''
                }`}
              >
                {family.entitlements.housing.status}
              </span>
            </div>
            <p className="text-[11px] text-heading font-medium truncate" title={family.entitlements.housing.details}>
              {family.entitlements.housing.value}
            </p>
          </div>

          {/* Livelihood / Job */}
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted flex items-center gap-1">
                <HiOutlineBriefcase className="w-3 h-3" /> Job / Grant
              </span>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                  statusColors[family.entitlements.employment.status] || ''
                }`}
              >
                {family.entitlements.employment.status}
              </span>
            </div>
            <p className="text-[11px] text-heading font-medium truncate" title={family.entitlements.employment.details}>
              {family.entitlements.employment.value}
            </p>
          </div>

          {/* Annuity */}
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted flex items-center gap-1">
                <HiOutlineCurrencyRupee className="w-3 h-3" /> Annuity
              </span>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                  statusColors[family.entitlements.annuity.status] || ''
                }`}
              >
                {family.entitlements.annuity.status}
              </span>
            </div>
            <p className="text-[11px] text-heading font-medium truncate" title={family.entitlements.annuity.details}>
              {family.entitlements.annuity.value}
            </p>
          </div>

          {/* Shifting */}
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted flex items-center gap-1">
                <HiOutlineTruck className="w-3 h-3" /> Shifting
              </span>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                  statusColors[family.entitlements.transportationAllowance.status] || ''
                }`}
              >
                {family.entitlements.transportationAllowance.status}
              </span>
            </div>
            <p className="text-[11px] text-heading font-medium truncate">
              {family.entitlements.transportationAllowance.value}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Progress bar + Action button */}
      <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted text-[11px]">R&R Entitlement Fulfillment</span>
            <span className="font-bold text-heading tabular-nums">{family.overallProgress}%</span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor(family.overallProgress)} rounded-full`}
              style={{ width: `${family.overallProgress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => onInspect(family)}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/5
            hover:bg-saffron/15 hover:text-saffron text-heading border border-transparent
            hover:border-saffron/30 transition-all flex items-center justify-center gap-1"
        >
          <span>Inspect Entitlement Dossier</span>
          <span>→</span>
        </button>
      </div>
    </motion.div>
  );
}
