import { NextResponse } from 'next/server';
import states from '@/data/states.json';
import projects from '@/data/projects.json';
import families from '@/data/families.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800));

  switch (type) {
    case 'states':
      return NextResponse.json({ success: true, data: states });
    case 'projects':
      return NextResponse.json({ success: true, data: projects });
    case 'families':
      return NextResponse.json({ success: true, data: families });
    case 'national-summary':
      return NextResponse.json({
        success: true,
        data: {
          totalProjects: 214,
          landNotifiedHa: 57200,
          landAcquiredHa: 39300,
          compensationAssessedCr: 21600,
          compensationDisbursedCr: 14650,
          familiesAffected: 62000,
          familiesResettled: 40900,
          nationalProgress: 68
        }
      });
    default:
      return NextResponse.json(
        { success: false, error: 'Invalid data type requested' },
        { status: 400 }
      );
  }
}
