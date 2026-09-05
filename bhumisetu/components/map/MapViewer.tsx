'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icons in Next.js
const initLeaflet = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

interface Parcel {
  id: string;
  owner: string;
  area: string;
  status: 'acquired' | 'notified' | 'disputed';
  coordinates: [number, number][];
}

const mockParcels: Parcel[] = [
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
];

const getStatusColor = (status: Parcel['status']) => {
  switch (status) {
    case 'acquired': return '#10B981'; // Emerald
    case 'notified': return '#F97316'; // Saffron
    case 'disputed': return '#EF4444'; // Red
    default: return '#3B82F6';
  }
};

export default function MapViewer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initLeaflet();
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse">
      <p className="text-muted font-medium">Loading Map Data...</p>
    </div>
  );

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner">
      <MapContainer 
        center={[23.0250, 72.5730]} 
        zoom={15} 
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {mockParcels.map(parcel => (
          <Polygon 
            key={parcel.id}
            positions={parcel.coordinates}
            pathOptions={{ 
              fillColor: getStatusColor(parcel.status),
              fillOpacity: 0.5,
              color: getStatusColor(parcel.status),
              weight: 2
            }}
          >
            <Popup className="premium-popup">
              <div className="p-1 min-w-[150px]">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-black/10">
                  <strong className="text-sm text-slate-800">{parcel.id}</strong>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white`}
                    style={{ backgroundColor: getStatusColor(parcel.status) }}>
                    {parcel.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-1"><strong>Owner:</strong> {parcel.owner}</p>
                <p className="text-xs text-slate-600"><strong>Area:</strong> {parcel.area}</p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}
