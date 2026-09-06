import initialData from '@/data/grievances.json';

export interface GrievanceRecord {
  id: string;
  name: string;
  phone: string;
  projectId?: string;
  projectName: string;
  district: string;
  state: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  filedDate: string;
  slaDeadline: string;
  resolvedDate: string | null;
  satisfactionRating: number | null;
  satisfactionComment?: string | null;
  timeline: {
    timestamp: string;
    status: string;
    actor: string;
    note: string;
  }[];
}

// Global in-memory singleton for development and runtime persistence
declare global {
  // eslint-disable-next-line no-var
  var __grievanceStore: GrievanceRecord[] | undefined;
}

if (!globalThis.__grievanceStore) {
  globalThis.__grievanceStore = [...(initialData as unknown as GrievanceRecord[])];
}

export function getAllGrievances(): GrievanceRecord[] {
  return globalThis.__grievanceStore || [];
}

export function getGrievanceById(id: string): GrievanceRecord | undefined {
  const store = globalThis.__grievanceStore || [];
  return store.find((g) => g.id.toLowerCase() === id.trim().toLowerCase());
}

export function createGrievance(record: GrievanceRecord): GrievanceRecord {
  if (!globalThis.__grievanceStore) {
    globalThis.__grievanceStore = [...(initialData as unknown as GrievanceRecord[])];
  }
  globalThis.__grievanceStore.unshift(record);
  return record;
}
