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

const getStatusColor = (status: Parcel['status']) => {
  switch (status) {
    case 'acquired': return '#10B981'; // Emerald
    case 'notified': return '#F97316'; // Saffron
    case 'disputed': return '#EF4444'; // Red
    default: return '#3B82F6';
  }
};

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

interface MapViewerProps {
  searchCenter?: [number, number] | null;
}

export default function MapViewer({ searchCenter = null }: MapViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    initLeaflet();
    setMounted(true);

    // Fetch data from real API
    const fetchParcels = async () => {
      try {
        const response = await fetch('/api/parcels');
        const result = await response.json();
        if (result.success) {
          setParcels(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch parcels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  if (!mounted || loading) return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse">
      <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-muted font-medium">Loading Map Data via API...</p>
    </div>
  );

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner">
      <MapContainer 
        center={[23.0250, 72.5730]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
      >
        <MapController center={searchCenter} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {parcels.map(parcel => (
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
