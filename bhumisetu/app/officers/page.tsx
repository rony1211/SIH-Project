'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import OfficerStatsHeader from '@/components/officers/OfficerStatsHeader';
import LeaderboardTable, { Officer } from '@/components/officers/LeaderboardTable';
import BadgeShowcase from '@/components/officers/BadgeShowcase';
import PerformanceTrends from '@/components/officers/PerformanceTrends';
import DistrictHeatmap from '@/components/officers/DistrictHeatmap';
import {
  HiOutlineTrophy,
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineMapPin,
  HiOutlineArrowPath,
} from 'react-icons/hi2';

type TabKey = 'leaderboard' | 'badges' | 'trends' | 'heatmap';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

export default function OfficersPage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<TabKey>('leaderboard');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalOfficers: 0,
    avgSlaCompliance: 0,
    totalCasesMonth: 0,
    topPerformerName: '',
    topPerformerXp: 0,
    activeStreaks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');

  const fetchOfficers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (stateFilter !== 'All') params.set('state', stateFilter);

      const res = await fetch(`/api/officers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOfficers(data.officers || []);
        if (data.stats) setStats(data.stats);
        if (data.states) setStates(data.states);
      }
    } catch (err) {
      console.error('Failed to load officers:', err);
    } finally {
      setLoading(false);
    }
  }, [search, stateFilter]);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  // Collect all badges from all officers for the "All Badges" showcase
  const allEarnedBadges = [...new Set(officers.flatMap((o) => o.badges))];

  const tabs: TabItem[] = [
    { key: 'leaderboard', label: t('officers', 'leaderboard') || 'Leaderboard', icon: <HiOutlineTrophy className="w-4 h-4" /> },
    { key: 'badges', label: t('officers', 'badges') || 'Badges & Achievements', icon: <HiOutlineSparkles className="w-4 h-4" /> },
    { key: 'trends', label: t('officers', 'trends') || 'Performance Trends', icon: <HiOutlineChartBar className="w-4 h-4" /> },
    { key: 'heatmap', label: t('officers', 'heatmap') || 'District Heatmap', icon: <HiOutlineMapPin className="w-4 h-4" /> },
  ];

  const handleDistrictClick = (state: string) => {
    setStateFilter(state);
    setActiveTab('leaderboard');
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
              {t('officers', 'title') || 'Officer Performance Dashboard'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-saffron/15 to-amber-500/15 text-saffron border border-saffron/30">
              🎯 Gamified
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            {t('officers', 'subtitle') || 'Incentivizing excellence through leaderboards, badges, and performance tracking'}
          </p>
        </div>

        <button
          onClick={fetchOfficers}
          className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
            text-muted hover:text-heading transition-colors self-start md:self-auto flex items-center gap-2 text-xs font-medium"
          title="Refresh Data"
        >
          <HiOutlineArrowPath className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </motion.div>

      {/* KPI Stats */}
      <OfficerStatsHeader stats={stats} />

      {/* Navigation Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold transition-all relative whitespace-nowrap
              ${activeTab === tab.key
                ? 'text-saffron'
                : 'text-muted hover:text-heading'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="officerTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'leaderboard' && (
          <motion.div
            key="tab-leaderboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <LeaderboardTable
              officers={officers}
              search={search}
              onSearchChange={setSearch}
              stateFilter={stateFilter}
              onStateChange={setStateFilter}
              states={states}
            />
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="tab-badges"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5">
                <h2 className="text-lg font-bold text-heading">
                  {t('officers', 'allBadges') || 'All Achievement Badges'}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {t('officers', 'badgesSubtitle') || '12 unique badges to earn — incentivizing speed, accuracy, and citizen satisfaction'}
                </p>
              </div>
              <BadgeShowcase earnedBadges={allEarnedBadges} officerName="All Officers" />
            </div>
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            key="tab-trends"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <PerformanceTrends officers={officers} />
          </motion.div>
        )}

        {activeTab === 'heatmap' && (
          <motion.div
            key="tab-heatmap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5">
                <h2 className="text-lg font-bold text-heading">
                  {t('officers', 'districtHeatmap') || 'District Performance Heatmap'}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {t('officers', 'heatmapSubtitle') || 'At-a-glance district-level performance comparison — click any district to filter the leaderboard'}
                </p>
              </div>
              <DistrictHeatmap officers={officers} onDistrictClick={handleDistrictClick} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
