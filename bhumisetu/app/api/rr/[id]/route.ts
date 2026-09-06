import { NextResponse } from 'next/server';
import { getFamilyById } from '@/lib/rrStore';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const family = getFamilyById(id);

  if (!family) {
    return NextResponse.json({ error: 'Family record not found' }, { status: 404 });
  }

  return NextResponse.json({ family });
}
