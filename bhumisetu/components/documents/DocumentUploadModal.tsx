'use client';

import { useState, useRef, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import {
  HiOutlineXMark, HiOutlineArrowUpTray,
  HiOutlineDocument, HiOutlineDocumentText,
  HiOutlineDocumentCheck
} from 'react-icons/hi2';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  'Gazette Notification',
  'Title Deed',
  'Joint Measurement Survey',
  'Court Order',
  'Compensation Award',
  'Environmental Clearance',
  'R&R Plan',
  'Possession Certificate',
];

export default function DocumentUploadModal({ isOpen, onClose, onSuccess }: DocumentUploadModalProps) {
  const { t } = useLocale();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Gazette Notification',
    projectId: '',
    tags: '',
  });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.title || !formData.projectId) return;

    setUploading(true);
    setProgress(0);

    // Simulate upload progress and hash generation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            onSuccess();
            onClose();
          }, 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!uploading ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-dark rounded-3xl overflow-hidden shadow-2xl
              border border-white/10 dark:border-white/10 flex flex-col max-h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-orange-500
                  flex items-center justify-center shadow-lg">
                  <HiOutlineArrowUpTray className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-heading">Upload Document</h2>
                  <p className="text-sm text-muted">Securely store and hash documents on the ledger</p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 text-muted hover:text-heading transition-colors"
                >
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="overflow-y-auto p-6">
              <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-300
                    flex flex-col items-center justify-center p-8 text-center
                    ${isDragging ? 'border-saffron bg-saffron/5 scale-[1.02]' : 'border-white/20 hover:border-saffron/50 hover:bg-white/5'}
                    ${file ? 'border-emerald/50 bg-emerald/5' : ''}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center mb-3">
                        <HiOutlineDocumentCheck className="w-8 h-8 text-emerald" />
                      </div>
                      <p className="text-heading font-medium text-lg truncate max-w-sm">{file.name}</p>
                      <p className="text-muted text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {!uploading && (
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="mt-4 text-sm text-danger hover:underline"
                        >
                          Remove file
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <HiOutlineDocument className="w-8 h-8 text-muted" />
                      </div>
                      <p className="text-heading font-medium mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-muted text-sm mb-4">
                        or click to browse from your computer
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-heading text-sm font-medium transition-colors pointer-events-auto"
                      >
                        Browse Files
                      </button>
                      <p className="text-xs text-muted/60 mt-4">
                        Supported formats: PDF, DOCX, JPG, PNG, TIFF (Max 20MB)
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-heading ml-1">Document Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-white/10
                        focus:border-saffron/50 outline-none transition-colors text-sm text-heading placeholder-muted"
                      placeholder="e.g. Gazette Notification Section 11..."
                      disabled={uploading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-heading ml-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-white/10
                        focus:border-saffron/50 outline-none transition-colors text-sm text-heading appearance-none"
                      disabled={uploading}
                    >
                      {categories.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-heading ml-1">Project ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-white/10
                        focus:border-saffron/50 outline-none transition-colors text-sm text-heading font-mono placeholder-muted"
                      placeholder="e.g. PRJ-NHAI-001"
                      disabled={uploading}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-heading ml-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-white/10
                        focus:border-saffron/50 outline-none transition-colors text-sm text-heading placeholder-muted"
                      placeholder="e.g. Phase 1, Highway, Signed"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20 dark:bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted">
                <HiOutlineDocumentText className="w-4 h-4" />
                Auto-generates SHA-256 integrity hash on upload
              </div>
              
              <div className="flex gap-3">
                {!uploading && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  form="upload-form"
                  disabled={!file || !formData.title || !formData.projectId || uploading}
                  className={`relative px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden
                    ${!file || !formData.title || !formData.projectId
                      ? 'bg-white/10 text-muted cursor-not-allowed'
                      : uploading 
                        ? 'bg-saffron/20 text-saffron'
                        : 'bg-gradient-to-r from-saffron to-orange-600 text-white shadow-lg shadow-saffron/25 hover:scale-105'
                    }`}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
                      Encrypting... {Math.round(progress)}%
                      
                      {/* Progress bar background */}
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-saffron transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : (
                    'Upload & Seal'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
