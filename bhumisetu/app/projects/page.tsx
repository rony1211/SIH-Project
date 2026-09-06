'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import ProjectStatsHeader from '@/components/projects/ProjectStatsHeader';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectKanbanView from '@/components/projects/ProjectKanbanView';
import ProjectTableView from '@/components/projects/ProjectTableView';

type ViewMode = 'grid' | 'kanban' | 'table';

export default function ProjectsPage() {
  const { t } = useLocale();
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalAreaHa: 0,
    acquiredAreaHa: 0,
    totalBudgetCr: 0,
    totalSpentCr: 0,
    criticalBottlenecks: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [state, setState] = useState('All');
  const [agency, setAgency] = useState('All');
  const [status, setStatus] = useState('All');
  const [bottleneckOnly, setBottleneckOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (state !== 'All') params.append('state', state);
        if (agency !== 'All') params.append('agency', agency);
        if (status !== 'All') params.append('status', status);
        if (bottleneckOnly) params.append('bottleneck', 'true');
        if (search) params.append('search', search);

        const res = await fetch(`/api/projects?${params.toString()}`);
        const data = await res.json();
        setProjects(data.projects);
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(timer);
  }, [state, agency, status, bottleneckOnly, search]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-heading">
          {t('projects', 'title') || 'Project Lifecycle Tracker'}
        </h1>
        <p className="text-sm text-muted mt-1">
          Track RFCTLARR Act 2013 statutory milestones across national infrastructure projects
        </p>
      </motion.div>

      {/* Stats Row */}
      <ProjectStatsHeader stats={stats} />

      {/* Filters */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        state={state}
        onStateChange={setState}
        agency={agency}
        onAgencyChange={setAgency}
        status={status}
        onStatusChange={setStatus}
        bottleneckOnly={bottleneckOnly}
        onBottleneckToggle={() => setBottleneckOnly(!bottleneckOnly)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content Area */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm font-medium animate-pulse">
            Loading project pipeline...
          </p>
        </div>
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
              {projects.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted">
                  No projects found matching your criteria.
                </div>
              )}
            </div>
          )}

          {viewMode === 'kanban' && (
            <ProjectKanbanView projects={projects} />
          )}

          {viewMode === 'table' && (
            <ProjectTableView projects={projects} />
          )}
        </motion.div>
      )}
    </div>
  );
}
