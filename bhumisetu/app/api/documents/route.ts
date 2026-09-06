import { NextResponse } from 'next/server';
import documentsData from '@/data/documents.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const projectId = searchParams.get('projectId');
  const search = searchParams.get('search');

  let filtered = [...documentsData];

  if (category && category !== 'All') {
    filtered = filtered.filter((doc) => doc.category === category);
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((doc) => doc.status === status);
  }

  if (projectId) {
    filtered = filtered.filter((doc) => doc.projectId === projectId);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.projectName.toLowerCase().includes(q) ||
        doc.state.toLowerCase().includes(q) ||
        doc.district.toLowerCase().includes(q) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Summary stats
  const stats = {
    total: documentsData.length,
    approved: documentsData.filter((d) => d.status === 'Approved').length,
    underReview: documentsData.filter((d) => d.status === 'Under Review').length,
    draft: documentsData.filter((d) => d.status === 'Draft').length,
    archived: documentsData.filter((d) => d.status === 'Archived').length,
  };

  return NextResponse.json({ documents: filtered, stats });
}
