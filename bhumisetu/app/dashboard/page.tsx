'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import StatsCard from '@/components/dashboard/StatsCard';
import AcquisitionChart from '@/components/dashboard/AcquisitionChart';
import CompensationTracker from '@/components/dashboard/CompensationTracker';
import TimelineChart from '@/components/dashboard/TimelineChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import StateTable from '@/components/dashboard/StateTable';
import {
  HiOutlineFolder, HiOutlineMapPin, HiOutlineBanknotes,
  HiOutlineUserGroup
} from 'react-icons/hi2';

export default function DashboardPage() {
  const { t } = useLocale();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-heading">
          {t('dashboard', 'title')}
        </h1>
        <p className="text-sm text-muted mt-1">
          {t('dashboard', 'subtitle')}
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<HiOutlineFolder className="w-5 h-5 text-white" />}
          label={t('stats', 'totalProjects')}
          initialValue={214}
          trend={{ value: 12, isUp: true }}
          color="from-saffron to-orange-500"
          delay={0}
        />
        <StatsCard
          icon={<HiOutlineMapPin className="w-5 h-5 text-white" />}
          label={t('stats', 'landAcquired')}
          initialValue={39300}
          suffix=" Ha"
          trend={{ value: 8, isUp: true }}
          color="from-emerald to-teal-500"
          delay={0.1}
        />
        <StatsCard
          icon={<HiOutlineBanknotes className="w-5 h-5 text-white" />}
          label={t('stats', 'compensationDisbursed')}
          initialValue={14650}
          prefix="₹"
          suffix=" Cr"
          trend={{ value: 5, isUp: true }}
          color="from-royal to-indigo-500"
          delay={0.2}
        />
        <StatsCard
          icon={<HiOutlineUserGroup className="w-5 h-5 text-white" />}
          label={t('stats', 'familiesResettled')}
          initialValue={40900}
          trend={{ value: 3, isUp: false }}
          color="from-purple-500 to-pink-500"
          delay={0.3}
        />
      </div>

      {/* Charts Row 1: Acquisition + Compensation */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AcquisitionChart title={t('dashboard', 'notifiedVsAcquired')} />
        </div>
        <div>
          <CompensationTracker title={t('dashboard', 'compensationFlow')} />
        </div>
      </div>

      {/* Charts Row 2: Timeline + Activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TimelineChart title={t('dashboard', 'timeline')} />
        </div>
        <div>
          <RecentActivity title={t('dashboard', 'recentActivity')} />
        </div>
      </div>

      {/* State Table */}
      <StateTable title={t('dashboard', 'stateWise')} />
    </div>
  );
}
