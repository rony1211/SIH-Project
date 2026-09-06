'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  HiOutlineXMark, 
  HiOutlineCamera, 
  HiOutlineMapPin, 
  HiOutlineDocumentText,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

interface Task {
  id: string;
  type: string;
  landowner: string;
  village: string;
  project: string;
  priority: string;
  status: string;
  distance: string;
  dueDate: string;
  coordinates: { lat: number, lng: number };
  documentsRequired: string[];
}

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onComplete: (taskId: string, notes: string) => void;
  isPendingSync: boolean;
}

export default function TaskDetailModal({ task, onClose, onComplete, isPendingSync }: TaskDetailModalProps) {
  const [notes, setNotes] = useState('');
  const [capturedDocs, setCapturedDocs] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  if (!task) return null;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setIsCameraOpen(true);
      // Need a small timeout to let the video element render before attaching stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera. Please ensure permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    setCapturedDocs(prev => [...prev, `doc_${Date.now()}.jpg`]);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, []);

  const isCompleteDisabled = capturedDocs.length < task.documentsRequired.length || task.status === 'Completed' || isPendingSync;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Centered Modal Container */}
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-800">
        <div>
          <h2 className="text-lg font-bold text-heading">{task.type}</h2>
          <p className="text-sm text-muted">{task.id}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <HiOutlineXMark className="w-6 h-6 text-body" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        
        {/* Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Beneficiary Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Name</p>
              <p className="text-sm font-semibold text-heading">{task.landowner}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Village</p>
              <p className="text-sm font-semibold text-heading">{task.village}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted">Project</p>
              <p className="text-sm font-semibold text-heading">{task.project}</p>
            </div>
          </div>
        </div>

        {/* GPS Geotag Simulation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <HiOutlineMapPin className="w-4 h-4" /> Live Geotag
          </h3>
          <div className="w-full h-32 rounded-xl bg-slate-100 dark:bg-slate-700 relative overflow-hidden border border-black/10 dark:border-white/10 flex items-center justify-center">
            {/* Fake Map Background */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
            
            {/* Pulse Pin */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
              <HiOutlineMapPin className="w-8 h-8 text-blue-500 drop-shadow-md z-10" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-mono text-muted">
            <span>Lat: {task.coordinates.lat.toFixed(4)}</span>
            <span>Lng: {task.coordinates.lng.toFixed(4)}</span>
          </div>
        </div>

        {/* Document Capture Simulation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <HiOutlineDocumentText className="w-4 h-4" /> Required Documents
          </h3>
          <div className="space-y-3">
            {task.documentsRequired.map((doc, idx) => {
              const isCaptured = capturedDocs.length > idx;
              return (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isCaptured ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-50 dark:bg-slate-900 border-black/5 dark:border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    {isCaptured ? (
                      <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                    <span className={`text-sm font-medium ${isCaptured ? 'text-emerald-700 dark:text-emerald-300' : 'text-body'}`}>{doc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={startCamera}
            disabled={capturedDocs.length >= task.documentsRequired.length}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-heading font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineCamera className="w-5 h-5" />
            Capture Document
          </button>
        </div>

        {/* Field Notes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/5">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Field Notes</h3>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add observations or remarks..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm text-body focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-24"
          />
        </div>
      </div>

        {/* Floating Action Button area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 to-transparent pt-12">
          <button
            disabled={isCompleteDisabled}
            onClick={() => onComplete(task.id, notes)}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg
              ${isCompleteDisabled 
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-blue-500/25 active:scale-[0.98]'
              }`}
          >
            {task.status === 'Completed' || isPendingSync ? 'Task Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>

      {/* Live Camera Overlay */}
      {isCameraOpen && (
        <div className="absolute inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-200 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
            <span className="text-white font-medium drop-shadow-md">Scan Document</span>
            <button onClick={stopCamera} className="p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition">
              <HiOutlineXMark className="w-6 h-6" />
            </button>
          </div>
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent flex justify-center items-center">
            {/* Shutter Button */}
            <button 
              onClick={takePhoto}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-white rounded-full" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
