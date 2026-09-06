import { NextResponse } from 'next/server';
import { getAllFamilies, updateFamilyEntitlement, getRRStats, FamilyRecord } from '@/lib/rrStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const projectId = searchParams.get('projectId');
  const category = searchParams.get('category');
  const vulnerability = searchParams.get('vulnerability');
  const status = searchParams.get('status');

  const all = getAllFamilies();
  let filtered = [...all];

  if (projectId && projectId !== 'All') {
    filtered = filtered.filter((f) => f.projectId === projectId);
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((f) => f.category === category);
  }

  if (vulnerability && vulnerability !== 'All') {
    if (vulnerability === 'SC/ST') {
      filtered = filtered.filter((f) => f.vulnerability.includes('SC') || f.vulnerability.includes('ST'));
    } else {
      filtered = filtered.filter((f) => f.vulnerability.includes(vulnerability));
    }
  }

  if (status && status !== 'All') {
    if (status === 'Complete') {
      filtered = filtered.filter((f) => f.overallProgress === 100);
    } else if (status === 'In Progress') {
      filtered = filtered.filter((f) => f.overallProgress > 0 && f.overallProgress < 100);
    } else if (status === 'Critical Pending') {
      filtered = filtered.filter((f) => f.overallProgress <= 30);
    }
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.id.toLowerCase().includes(q) ||
        f.headOfFamily.toLowerCase().includes(q) ||
        f.village.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.projectName.toLowerCase().includes(q) ||
        f.aadhaarMasked.toLowerCase().includes(q)
    );
  }

  const stats = getRRStats();
  return NextResponse.json({ families: filtered, stats });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { familyId, entitlementKey, status, note } = body;

    if (!familyId || !entitlementKey || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const updated = updateFamilyEntitlement(
      familyId,
      entitlementKey as keyof FamilyRecord['entitlements'],
      status,
      note
    );

    if (!updated) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    const stats = getRRStats();
    return NextResponse.json({ success: true, family: updated, stats });
  } catch (err) {
    console.error('Failed to update R&R record:', err);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
