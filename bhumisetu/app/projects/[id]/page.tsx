'use client';

import { useState, useEffect, use } from 'react';
import ProjectDetailView from '@/components/projects/ProjectDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setProject(data.project);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
        <p className="text-muted text-sm font-medium animate-pulse">
          Loading project details...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-xl font-bold text-heading">Project Not Found</p>
        <p className="text-sm text-muted">The requested project ID does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <ProjectDetailView project={project} />
    </div>
  );
}
