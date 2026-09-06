import { NextResponse } from 'next/server';
import projectsData from '@/data/projects.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const agency = searchParams.get('agency');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const bottleneck = searchParams.get('bottleneck');

  let filtered = [...projectsData];

  if (state && state !== 'All') {
    filtered = filtered.filter((p) => p.state === state);
  }
  if (agency && agency !== 'All') {
    filtered = filtered.filter((p) => p.agency === agency);
  }
  if (status && status !== 'All') {
    filtered = filtered.filter((p) => p.status === status);
  }
  if (bottleneck === 'true') {
    filtered = filtered.filter((p) => p.criticalBottleneck);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.agency.toLowerCase().includes(q)
    );
  }

  // Compute aggregate stats from ALL projects (not filtered)
  const all = projectsData;
  const stats = {
    totalProjects: all.length,
    totalAreaHa: all.reduce((s, p) => s + p.totalAreaHa, 0),
    acquiredAreaHa: all.reduce((s, p) => s + p.acquiredAreaHa, 0),
    totalBudgetCr: all.reduce((s, p) => s + p.budgetCr, 0),
    totalSpentCr: all.reduce((s, p) => s + p.spentCr, 0),
    totalFamiliesAffected: all.reduce((s, p) => s + p.familiesAffected, 0),
    totalFamiliesResettled: all.reduce((s, p) => s + p.familiesResettled, 0),
    criticalBottlenecks: all.filter((p) => p.criticalBottleneck).length,
    completedProjects: all.filter((p) => p.status === 'Completed').length,
  };

  return NextResponse.json({ projects: filtered, stats });
}
