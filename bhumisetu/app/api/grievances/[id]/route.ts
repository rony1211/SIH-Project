import { NextResponse } from 'next/server';
import { getGrievanceById } from '@/lib/grievancesStore';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const grievance = getGrievanceById(id);

  if (!grievance) {
    return NextResponse.json({ error: 'Grievance not found' }, { status: 404 });
  }

  return NextResponse.json({ grievance });
}
