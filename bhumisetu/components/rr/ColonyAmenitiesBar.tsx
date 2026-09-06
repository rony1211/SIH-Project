'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineBolt,
  HiOutlineTruck,
  HiOutlineAcademicCap,
  HiOutlineHeart,
} from 'react-icons/hi2';

interface Amenity {
  name: string;
  icon: typeof HiOutlineSparkles;
  statutorySchedule: string;
  readinessRate: number;
  description: string;
}

const statutoryAmenities: Amenity[] = [
  {
    name: '24x7 Potable Water',
    icon: HiOutlineCheckCircle,
    statutorySchedule: 'Third Schedule, Item 2',
    readinessRate: 94,
    description: 'Individual household tap connection with overhead reservoir',
  },
  {
    name: 'Electrification & Solar',
    icon: HiOutlineBolt,
    statutorySchedule: 'Third Schedule, Item 4',
    readinessRate: 98,
    description: 'Underground cabling, solar streetlights, 3-phase domestic feed',
  },
  {
    name: 'All-Weather Roads',
    icon: HiOutlineTruck,
    statutorySchedule: 'Third Schedule, Item 1',
    readinessRate: 91,
    description: 'Bituminous pucca internal roads connected to district highway',
  },
  {
    name: 'School & Anganwadi',
    icon: HiOutlineAcademicCap,
    statutorySchedule: 'Third Schedule, Item 6',
    readinessRate: 85,
    description: 'Primary school within 500m + functional Anganwadi nutrition centre',
  },
  {
    name: 'Primary Health Centre',
    icon: HiOutlineHeart,
    statutorySchedule: 'Third Schedule, Item 7',
    readinessRate: 88,
    description: 'Sub-centre with regular visiting Medical Officer & maternity ward',
  },
];

export default function ColonyAmenitiesBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-5 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <HiOutlineSparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-bold text-heading">
              Model Resettlement Colony Civic Infrastructure (Schedule III Mandate)
            </h3>
            <p className="text-[11px] text-muted">
              Statutory 25 civic amenities required before physical possession handover under RFCTLARR Act 2013
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
          91.2% Overall Civic Readiness
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {statutoryAmenities.map((amenity, idx) => {
          const Icon = amenity.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-heading truncate">{amenity.name}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 tabular-nums">
                  {amenity.readinessRate}%
                </span>
              </div>

              <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald to-teal-400 rounded-full"
                  style={{ width: `${amenity.readinessRate}%` }}
                />
              </div>

              <p className="text-[10px] text-muted line-clamp-2 leading-tight">
                {amenity.description}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
