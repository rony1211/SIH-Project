import { NextResponse } from 'next/server';

export interface Parcel {
  id: string;
  owner: string;
  area: string;
  status: 'acquired' | 'notified' | 'disputed';
  coordinates: [number, number][];
}

// In a real application, this would query a database (e.g., PostgreSQL + PostGIS)
const parcelsDB: Parcel[] = [
  {
    id: 'P-101',
    owner: 'Ramesh Patel',
    area: '2.5 Ha',
    status: 'acquired',
    coordinates: [
      [23.0225, 72.5714],
      [23.0250, 72.5714],
      [23.0250, 72.5750],
      [23.0225, 72.5750],
    ],
  },
  {
    id: 'P-102',
    owner: 'Suresh Kumar',
    area: '1.2 Ha',
    status: 'notified',
    coordinates: [
      [23.0250, 72.5714],
      [23.0270, 72.5714],
      [23.0270, 72.5740],
      [23.0250, 72.5750],
    ],
  },
  {
    id: 'P-103',
    owner: 'Gram Panchayat (Overlap)',
    area: '0.8 Ha',
    status: 'disputed',
    coordinates: [
      [23.0260, 72.5730],
      [23.0280, 72.5730],
      [23.0280, 72.5760],
      [23.0260, 72.5760],
    ],
  },
  // Let's add a few more to make the API feel richer
  {
    id: 'P-104',
    owner: 'State Government',
    area: '5.4 Ha',
    status: 'acquired',
    coordinates: [
      [23.0200, 72.5760],
      [23.0240, 72.5760],
      [23.0240, 72.5790],
      [23.0200, 72.5790],
    ],
  },
  {
    id: 'P-105',
    owner: 'Private Logistics Co.',
    area: '3.1 Ha',
    status: 'notified',
    coordinates: [
      [23.0280, 72.5760],
      [23.0310, 72.5760],
      [23.0310, 72.5790],
      [23.0280, 72.5790],
    ],
  }
];

export async function GET() {
  // Simulate network latency (e.g. database query time)
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json({
    success: true,
    data: parcelsDB,
    timestamp: new Date().toISOString(),
  });
}
