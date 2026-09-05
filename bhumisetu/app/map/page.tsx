'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { HiOutlineMap, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

// Dynamically import the MapViewer with SSR disabled since Leaflet relies on the window object
const MapViewer = dynamic(() => import('@/components/map/MapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse">
      <HiOutlineMap className="w-12 h-12 text-muted mb-4 opacity-50" />
      <p className="text-muted font-medium">Initializing Map Engine...</p>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Geospatial Map Viewer</h1>
          <p className="text-sm text-muted mt-1">Live cadastral mapping, parcel boundaries, and overlap detection</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass bg-white/50 dark:bg-black/20 text-sm font-medium hover:surface-hover transition-colors">
            <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
            Filters
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald" /> Acquired</div>
            <div className="flex items-center gap-1.5 ml-2"><div className="w-2.5 h-2.5 rounded-full bg-saffron" /> Notified</div>
            <div className="flex items-center gap-1.5 ml-2"><div className="w-2.5 h-2.5 rounded-full bg-danger" /> Disputed</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 glass-dark rounded-3xl p-2 relative overflow-hidden flex flex-col border border-black/5 dark:border-white/5 shadow-2xl"
      >
        {/* Decorative ambient gradients behind the map container */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 relative z-10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
          <MapViewer />
        </div>
      </motion.div>
    </div>
  );
}
