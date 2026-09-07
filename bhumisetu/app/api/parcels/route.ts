import { NextResponse } from 'next/server';

export interface Parcel {
  id: string;
  owner: string;
  area: string;
  status: 'acquired' | 'notified' | 'disputed';
  coordinates: [number, number][];
}

// Coordinates for different hubs
const GUJARAT_LAT = 23.0250;
const GUJARAT_LNG = 72.5730;

const JHARKHAND_LAT = 23.3441; // Ranchi (Central Jharkhand)
const JHARKHAND_LNG = 85.3096;

const owners = [
  'Ramesh Patel', 'Suresh Kumar', 'Gram Panchayat', 'State Government',
  'Private Logistics Co.', 'Ashok Desai', 'Reliance Ind.', 'Municipal Corp',
  'NHAI', 'Adani Ports', 'Kisan Union', 'Local Trust', 'Mehta Family',
  'Industrial Estate', 'Railway Board'
];

const generateRandomParcels = (count: number, centerLat: number, centerLng: number, prefix: string, radiusMultiplier: number = 0.15): Parcel[] => {
  const parcels: Parcel[] = [];
  const statuses: Parcel['status'][] = ['acquired', 'notified', 'disputed'];

  for (let i = 0; i < count; i++) {
    // Generate random center for this parcel
    const latOffset = (Math.random() - 0.5) * radiusMultiplier;
    const lngOffset = (Math.random() - 0.5) * radiusMultiplier;
    
    const lat = centerLat + latOffset;
    const lng = centerLng + lngOffset;

    // Randomize parcel size (from very small to medium)
    const sizeLat = 0.001 + Math.random() * 0.003; 
    const sizeLng = 0.001 + Math.random() * 0.003; 

    const coordinates: [number, number][] = [
      [lat, lng],
      [lat + sizeLat, lng],
      [lat + sizeLat, lng + sizeLng],
      [lat, lng + sizeLng]
    ];

    // Add some probability weights (more acquired/notified than disputed)
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    const rand = Math.random();
    if (rand < 0.4) status = 'acquired';
    else if (rand < 0.8) status = 'notified';
    else status = 'disputed';

    parcels.push({
      id: `${prefix}-${1000 + i}`,
      owner: owners[Math.floor(Math.random() * owners.length)],
      area: `${(Math.random() * 10 + 0.5).toFixed(1)} Ha`,
      status,
      coordinates
    });
  }

  // Inject some specific overlapping disputed ones to make it look interesting
  parcels.push({
    id: `${prefix}-999`,
    owner: 'Gram Panchayat (Overlap)',
    area: '0.8 Ha',
    status: 'disputed',
    coordinates: [
      [centerLat + 0.001, centerLng],
      [centerLat + 0.003, centerLng],
      [centerLat + 0.003, centerLng + 0.003],
      [centerLat + 0.001, centerLng + 0.003],
    ]
  });

  return parcels;
};

// Generate random parcels distributed across different regions
const parcelsDB: Parcel[] = [
  ...generateRandomParcels(40, GUJARAT_LAT, GUJARAT_LNG, 'GJ', 0.15),
  ...generateRandomParcels(150, JHARKHAND_LAT, JHARKHAND_LNG, 'JH', 3.0) // 3.0 degree span covers the state
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
