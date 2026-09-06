'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineBolt, HiOutlineCheckBadge, HiOutlineHeart,
  HiOutlineShieldCheck, HiOutlineStar, HiOutlineMoon,
  HiOutlineSparkles, HiOutlineFire, HiOutlineBell,
  HiOutlineTrophy, HiOutlineAcademicCap, HiOutlineLightBulb,
  HiOutlineLockClosed
} from 'react-icons/hi2';

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  criteria: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

const ALL_BADGES: BadgeInfo[] = [
  {
    id: 'speed-demon', name: 'Speed Demon',
    description: 'Lightning-fast case processing',
    criteria: 'Avg processing under 10 days for 3 consecutive months',
    icon: <HiOutlineBolt className="w-6 h-6" />,
    color: 'from-yellow-400 to-amber-500', glowColor: 'shadow-yellow-500/30',
  },
  {
    id: 'zero-backlog', name: 'Zero Backlog',
    description: 'No pending cases at month-end',
    criteria: 'Clear all assigned cases before deadline — 3 months running',
    icon: <HiOutlineCheckBadge className="w-6 h-6" />,
    color: 'from-emerald to-teal-500', glowColor: 'shadow-emerald/30',
  },
  {
    id: 'citizen-champion', name: 'Citizen Champion',
    description: 'Outstanding citizen satisfaction',
    criteria: 'Maintain 90%+ citizen feedback score across 50+ cases',
    icon: <HiOutlineHeart className="w-6 h-6" />,
    color: 'from-pink-400 to-rose-500', glowColor: 'shadow-pink-500/30',
  },
  {
    id: 'sla-guardian', name: 'SLA Guardian',
    description: 'Never misses a deadline',
    criteria: '95%+ SLA compliance for 6 consecutive months',
    icon: <HiOutlineShieldCheck className="w-6 h-6" />,
    color: 'from-royal to-indigo-600', glowColor: 'shadow-royal/30',
  },
  {
    id: 'century-club', name: 'Century Club',
    description: 'Processed 100+ cases in a year',
    criteria: 'Complete 100 or more cases within a calendar year',
    icon: <HiOutlineStar className="w-6 h-6" />,
    color: 'from-violet-400 to-purple-600', glowColor: 'shadow-violet-500/30',
  },
  {
    id: 'night-owl', name: 'Night Owl',
    description: 'Dedicated after-hours worker',
    criteria: 'Log 20+ after-hours approvals in a quarter',
    icon: <HiOutlineMoon className="w-6 h-6" />,
    color: 'from-indigo-400 to-blue-600', glowColor: 'shadow-indigo-500/30',
  },
  {
    id: 'district-star', name: 'District Star',
    description: 'Top performer in the district',
    criteria: 'Rank #1 in your district for 2 consecutive months',
    icon: <HiOutlineSparkles className="w-6 h-6" />,
    color: 'from-amber-400 to-orange-500', glowColor: 'shadow-amber-500/30',
  },
  {
    id: 'streak-master', name: 'Streak Master',
    description: 'Unbroken streak of excellence',
    criteria: 'Maintain 30+ day streak meeting daily SLA targets',
    icon: <HiOutlineFire className="w-6 h-6" />,
    color: 'from-red-400 to-rose-600', glowColor: 'shadow-red-500/30',
  },
  {
    id: 'first-responder', name: 'First Responder',
    description: 'Swift initial case action',
    criteria: 'Respond to 90% of new cases within 2 hours of assignment',
    icon: <HiOutlineBell className="w-6 h-6" />,
    color: 'from-cyan-400 to-sky-500', glowColor: 'shadow-cyan-500/30',
  },
  {
    id: 'compliance-king', name: 'Compliance King',
    description: 'Perfect regulatory adherence',
    criteria: 'Zero compliance violations for 6 months',
    icon: <HiOutlineTrophy className="w-6 h-6" />,
    color: 'from-yellow-500 to-amber-600', glowColor: 'shadow-yellow-600/30',
  },
  {
    id: 'mentor-badge', name: 'Mentor',
    description: 'Training new officers',
    criteria: 'Successfully mentor 3+ junior officers to Silver level',
    icon: <HiOutlineAcademicCap className="w-6 h-6" />,
    color: 'from-teal-400 to-emerald', glowColor: 'shadow-teal-500/30',
  },
  {
    id: 'innovation-award', name: 'Innovator',
    description: 'Process improvement pioneer',
    criteria: 'Propose and implement a workflow improvement adopted district-wide',
    icon: <HiOutlineLightBulb className="w-6 h-6" />,
    color: 'from-fuchsia-400 to-pink-600', glowColor: 'shadow-fuchsia-500/30',
  },
];

interface BadgeShowcaseProps {
  earnedBadges: string[];
  officerName?: string;
}

export default function BadgeShowcase({ earnedBadges, officerName }: BadgeShowcaseProps) {
  return (
    <div>
      {officerName && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-heading">Achievement Badges</h3>
            <p className="text-[10px] text-muted mt-0.5">
              {earnedBadges.length} of {ALL_BADGES.length} unlocked
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron/10 border border-saffron/20">
            <HiOutlineTrophy className="w-4 h-4 text-saffron" />
            <span className="text-xs font-bold text-saffron">{earnedBadges.length}/{ALL_BADGES.length}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {ALL_BADGES.map((badge, i) => {
          const isEarned = earnedBadges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group relative rounded-2xl p-4 text-center transition-all duration-300
                ${isEarned
                  ? `glass ${badge.glowColor} shadow-lg hover:shadow-xl hover:scale-105`
                  : 'bg-black/3 dark:bg-white/3 opacity-50 hover:opacity-70'
                }`}
            >
              {/* Badge Icon */}
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300
                ${isEarned
                  ? `bg-gradient-to-br ${badge.color} text-white shadow-lg group-hover:scale-110`
                  : 'bg-black/5 dark:bg-white/5 text-muted'
                }`}>
                {isEarned ? badge.icon : <HiOutlineLockClosed className="w-5 h-5" />}
              </div>

              {/* Badge Name */}
              <p className={`text-[11px] font-bold mb-0.5 ${isEarned ? 'text-heading' : 'text-muted'}`}>
                {badge.name}
              </p>
              <p className="text-[9px] text-muted leading-tight">{badge.description}</p>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl
                glass-dark text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300
                pointer-events-none z-10 shadow-xl">
                <p className="font-bold text-heading text-[11px] mb-1">{badge.name}</p>
                <p className="text-muted leading-relaxed">
                  <span className="font-semibold text-saffron">Unlock: </span>{badge.criteria}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export { ALL_BADGES };
