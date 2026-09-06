import { NextResponse } from 'next/server';
import officersData from '@/data/officers.json';

export interface OfficerRecord {
  id: string;
  name: string;
  initials: string;
  designation: string;
  district: string;
  state: string;
  postedSince: string;
  xp: number;
  level: string;
  casesThisMonth: number;
  casesThisQuarter: number;
  casesThisYear: number;
  avgProcessingDays: number;
  slaCompliance: number;
  approvalTurnaroundHrs: number;
  badges: string[];
  currentStreak: number;
  bestStreak: number;
  rankChange: number;
  monthlyTrend: { month: string; cases: number; avgDays: number; sla: number }[];
  radarScores: { speed: number; accuracy: number; volume: number; compliance: number; citizenScore: number };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const level = searchParams.get('level');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'xp';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const all: OfficerRecord[] = officersData as OfficerRecord[];
  let filtered = [...all];

  if (state && state !== 'All') {
    filtered = filtered.filter((o) => o.state === state);
  }
  if (level && level !== 'All') {
    filtered = filtered.filter((o) => o.level === level);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.district.toLowerCase().includes(q) ||
        o.designation.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }

  // Sorting
  const sortKey = sortBy as keyof OfficerRecord;
  filtered.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return 0;
  });

  // Aggregate stats
  const totalOfficers = all.length;
  const avgSlaCompliance = Math.round((all.reduce((s, o) => s + o.slaCompliance, 0) / all.length) * 10) / 10;
  const totalCasesMonth = all.reduce((s, o) => s + o.casesThisMonth, 0);
  const topPerformer = [...all].sort((a, b) => b.xp - a.xp)[0];
  const activeStreaks = all.filter((o) => o.currentStreak >= 7).length;

  const stats = {
    totalOfficers,
    avgSlaCompliance,
    totalCasesMonth,
    topPerformerName: topPerformer?.name || '',
    topPerformerXp: topPerformer?.xp || 0,
    activeStreaks,
  };

  // Unique states for filter
  const states = [...new Set(all.map((o) => o.state))].sort();

  return NextResponse.json({ officers: filtered, stats, states });
}
