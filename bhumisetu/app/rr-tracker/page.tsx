'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import { FamilyRecord } from '@/lib/rrStore';
import RRStatsOverview from '@/components/rr/RRStatsOverview';
import ColonyAmenitiesBar from '@/components/rr/ColonyAmenitiesBar';
import RRFilters from '@/components/rr/RRFilters';
import FamilyCard from '@/components/rr/FamilyCard';
import FamilyTable from '@/components/rr/FamilyTable';
import FamilyDetailModal from '@/components/rr/FamilyDetailModal';
import { HiOutlineArrowPath } from 'react-icons/hi2';

export default function RRTrackerPage() {
  const { t } = useLocale();
  const [families, setFamilies] = useState<FamilyRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    displaced: 0,
    affected: 0,
    housingAllotted: 0,
    housingEligible: 0,
    housingPercent: 0,
    jobDelivered: 0,
    jobEligible: 0,
    jobPercent: 0,
    vulnerableCount: 0,
    avgProgress: 0,
    totalDbtCr: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVulnerability, setSelectedVulnerability] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [inspectingFamily, setInspectingFamily] = useState<FamilyRecord | null>(null);

  const fetchFamilies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedProject !== 'All') params.append('projectId', selectedProject);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedVulnerability !== 'All') params.append('vulnerability', selectedVulnerability);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);

      const res = await fetch(`/api/rr?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFamilies(data.families || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load R&R families:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedProject, selectedCategory, selectedVulnerability, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFamilies();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchFamilies]);

  const projectOptions = useMemo(() => {
    const map = new Map<string, string>();
    families.forEach((f) => {
      if (!map.has(f.projectId)) {
        map.set(f.projectId, f.projectName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [families]);

  const handleUpdateEntitlement = async (
    familyId: string,
    entitlementKey: keyof FamilyRecord['entitlements'],
    status: any,
    note: string
  ) => {
    try {
      const res = await fetch('/api/rr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId, entitlementKey, status, note }),
      });

      if (res.ok) {
        const data = await res.json();
        setInspectingFamily(data.family);
        fetchFamilies();
      }
    } catch (err) {
      console.error('Failed to disburse entitlement:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Family ID',
      'Head of Family',
      'Aadhaar Masked',
      'Members',
      'Project',
      'Village',
      'District',
      'State',
      'Category',
      'Vulnerability',
      'DBT Verified',
      'Housing Status',
      'Employment Status',
      'Annuity Status',
      'Shifting Grant',
      'Overall Progress %',
    ];

    const rows = families.map((f) => [
      f.id,
      `"${f.headOfFamily.replace(/"/g, '""')}"`,
      f.aadhaarMasked,
      f.familyMembers,
      `"${f.projectName.replace(/"/g, '""')}"`,
      f.village,
      f.district,
      f.state,
      f.category,
      `"${f.vulnerability.replace(/"/g, '""')}"`,
      f.bankDetails.dbtVerified ? 'Yes' : 'No',
      f.entitlements.housing.status,
      f.entitlements.employment.status,
      f.entitlements.annuity.status,
      f.entitlements.transportationAllowance.status,
      f.overallProgress,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhumisetu_rr_compliance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              {t('rr', 'title') || 'Rehabilitation & Resettlement (R&R) Tracker'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron/15 text-saffron border border-saffron/30">
              RFCTLARR Act 2013 Schedules II & III
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            {t('rr', 'subtitle') ||
              'Real-time tracking of family entitlements, DBT disbursements, and model resettlement colony infrastructure'}
          </p>
        </div>

        <button
          onClick={fetchFamilies}
          className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
            text-muted hover:text-heading transition-colors self-start md:self-auto flex items-center gap-2 text-xs font-medium"
          title="Refresh Data"
        >
          <HiOutlineArrowPath className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </motion.div>

      {/* KPI Stats Overview */}
      <RRStatsOverview stats={stats} />

      {/* Statutory Model Colony Amenities Readiness */}
      <ColonyAmenitiesBar />

      {/* Filter and View Controls */}
      <RRFilters
        search={search}
        onSearchChange={setSearch}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedVulnerability={selectedVulnerability}
        onVulnerabilityChange={setSelectedVulnerability}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        projectOptions={projectOptions}
        onExportCSV={handleExportCSV}
      />

      {/* Content Area */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm font-medium animate-pulse">Loading R&R family ledger...</p>
        </div>
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {families.map((family, idx) => (
                <FamilyCard
                  key={family.id}
                  family={family}
                  index={idx}
                  onInspect={(f) => setInspectingFamily(f)}
                />
              ))}
              {families.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted">
                  <p className="text-base font-semibold">No families match the selected filters.</p>
                  <p className="text-xs mt-1">Try resetting the project or category filters.</p>
                </div>
              )}
            </div>
          ) : (
            <FamilyTable
              families={families}
              onInspect={(f) => setInspectingFamily(f)}
            />
          )}
        </motion.div>
      )}

      {/* Detail Modal */}
      <FamilyDetailModal
        family={inspectingFamily}
        onClose={() => setInspectingFamily(null)}
        onUpdateEntitlement={handleUpdateEntitlement}
      />
    </div>
  );
}
