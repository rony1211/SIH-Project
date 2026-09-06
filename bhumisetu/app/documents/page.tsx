'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/components/providers/LocaleProvider';
import DocumentStatsRow from '@/components/documents/DocumentStatsRow';
import DocumentFilters from '@/components/documents/DocumentFilters';
import DocumentTable from '@/components/documents/DocumentTable';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';

export default function DocumentsPage() {
  const { t } = useLocale();
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    underReview: 0,
    draft: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (status !== 'All') queryParams.append('status', status);
        if (search) queryParams.append('search', search);

        const res = await fetch(`/api/documents?${queryParams.toString()}`);
        const data = await res.json();
        setDocuments(data.documents);
        
        // Only update stats on initial load or if we want global stats always
        // Here we'll update it based on filtered results for context
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchDocuments();
    }, 300);

    return () => clearTimeout(timer);
  }, [category, status, search]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-heading">
          {t('documents', 'title') || 'Secure Document Repository'}
        </h1>
        <p className="text-sm text-muted mt-1">
          {t('documents', 'subtitle') || 'Centralized, tamper-proof storage with chain-of-custody tracking'}
        </p>
      </motion.div>

      {/* Stats Row */}
      <DocumentStatsRow stats={stats} />

      {/* Filters Bar */}
      <DocumentFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* Content Area */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm font-medium animate-pulse">Loading secure ledger...</p>
        </div>
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {viewMode === 'table' ? (
            <DocumentTable documents={documents} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {documents.map((doc, i) => (
                <DocumentCard key={(doc as any).id} doc={doc} index={i} />
              ))}
              {documents.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted">
                  No documents found matching your criteria.
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          // Re-fetch or simply show toast
          setSearch('');
          setCategory('All');
          setStatus('All');
        }}
      />
    </div>
  );
}
