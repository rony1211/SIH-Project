import { NextResponse } from 'next/server';
import { getAllGrievances, createGrievance, GrievanceRecord } from '@/lib/grievancesStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');

  const all = getAllGrievances();
  let filtered = [...all];

  if (category && category !== 'All') {
    filtered = filtered.filter((g) => g.category === category);
  }
  if (status && status !== 'All') {
    filtered = filtered.filter((g) => g.status === status);
  }
  if (priority && priority !== 'All') {
    filtered = filtered.filter((g) => g.priority === priority);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.id.toLowerCase().includes(q) ||
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.projectName.toLowerCase().includes(q)
    );
  }

  const stats = {
    total: all.length,
    filed: all.filter((g) => g.status === 'Filed').length,
    inProgress: all.filter((g) => ['Under Review', 'Assigned', 'In Progress'].includes(g.status)).length,
    escalated: all.filter((g) => g.status === 'Escalated').length,
    resolved: all.filter((g) => g.status === 'Resolved' || g.status === 'Closed').length,
    avgResolutionDays: Math.round(
      all
        .filter((g) => g.resolvedDate)
        .reduce((sum, g) => {
          const filed = new Date(g.filedDate).getTime();
          const resolved = new Date(g.resolvedDate!).getTime();
          return sum + (resolved - filed) / (1000 * 60 * 60 * 24);
        }, 0) /
        Math.max(1, all.filter((g) => g.resolvedDate).length)
    ),
  };

  return NextResponse.json({ grievances: filtered, stats });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const all = getAllGrievances();
    const newId = `GRV-${new Date().getFullYear()}-${String(all.length + 1).padStart(5, '0')}`;

    const newGrievance: GrievanceRecord = {
      id: newId,
      name: body.name || 'Anonymous Citizen',
      phone: body.phone || '9999999999',
      projectId: body.projectId || 'PRJ-GEN-001',
      projectName: body.projectName || 'National Highway Project',
      district: body.district || 'General',
      state: body.state || 'India',
      category: body.category || 'General Concern',
      priority: 'Medium',
      status: 'Filed',
      description: body.description || '',
      filedDate: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedDate: null,
      satisfactionRating: null,
      satisfactionComment: null,
      timeline: [
        {
          timestamp: new Date().toISOString(),
          status: 'Filed',
          actor: 'Citizen (Self-Service)',
          note: 'Complaint registered via BhumiSetu citizen portal',
        },
      ],
    };

    createGrievance(newGrievance);

    return NextResponse.json({ grievance: newGrievance, success: true });
  } catch (err) {
    console.error('Failed to parse POST body:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
