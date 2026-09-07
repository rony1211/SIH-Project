'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemHealthGrid from '@/components/admin/SystemHealthGrid';
import UserManagementTable from '@/components/admin/UserManagementTable';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import GlobalSettings from '@/components/admin/GlobalSettings';
import { 
  HiOutlineUserGroup, 
  HiOutlineClipboardDocumentList, 
  HiOutlineCog6Tooth 
} from 'react-icons/hi2';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'settings'>('users');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin-stats')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load admin data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-rose-500">
        Failed to load admin dashboard data.
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'User Management', icon: <HiOutlineUserGroup className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Logs', icon: <HiOutlineClipboardDocumentList className="w-4 h-4" /> },
    { id: 'settings', label: 'Global Settings', icon: <HiOutlineCog6Tooth className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <AdminHeader />
      
      <SystemHealthGrid health={data.systemHealth} />

      {/* Tabs */}
      <div className="flex border-b border-black/10 dark:border-white/10 gap-2 overflow-x-auto mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative whitespace-nowrap
              ${activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-muted hover:text-heading'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="adminTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <UserManagementTable users={data.users} />
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <AuditLogViewer logs={data.auditLogs} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <GlobalSettings initialSettings={data.settings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
