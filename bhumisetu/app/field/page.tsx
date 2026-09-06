'use client';

import { useState, useEffect } from 'react';
import FieldHeader from '@/components/field/FieldHeader';
import TaskQueue from '@/components/field/TaskQueue';
import TaskDetailModal from '@/components/field/TaskDetailModal';
import SyncProgressOverlay from '@/components/field/SyncProgressOverlay';

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

export default function FieldVerificationPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncTasks, setPendingSyncTasks] = useState<Map<string, any>>(new Map());
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [syncVisible, setSyncVisible] = useState(false);

  // Initial fetch
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/field-tasks');
        const json = await res.json();
        if (json.success) setTasks(json.data);
      } catch (e) {
        console.error('Failed to fetch tasks', e);
      }
    };
    fetchTasks();
  }, []);

  // Simulate network connectivity drops
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance to drop connection just for demonstration
      if (Math.random() > 0.8) setIsOnline(prev => !prev);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteTask = (taskId: string, notes: string) => {
    // Optimistic offline update
    setPendingSyncTasks(prev => {
      const next = new Map(prev);
      next.set(taskId, { id: taskId, notes, completedAt: new Date().toISOString() });
      return next;
    });

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    setSelectedTask(null);
  };

  const handleSync = async () => {
    if (!isOnline || pendingSyncTasks.size === 0) return;
    
    setIsSyncing(true);
    setSyncVisible(true);
    setSyncComplete(false);

    try {
      const updates = Array.from(pendingSyncTasks.values());
      const res = await fetch('/api/field-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updates })
      });
      
      const json = await res.json();
      if (json.success) {
        // Mock a little network delay for the cool animation
        setTimeout(() => {
          setSyncComplete(true);
          setIsSyncing(false);
          setPendingSyncTasks(new Map());
          
          // Hide overlay after success
          setTimeout(() => {
            setSyncVisible(false);
          }, 2000);
        }, 1500);
      }
    } catch (e) {
      console.error('Sync failed', e);
      setIsSyncing(false);
      setSyncVisible(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative">
      <FieldHeader 
        isOnline={isOnline}
        isSyncing={isSyncing}
        onSync={handleSync}
        pendingSyncCount={pendingSyncTasks.size}
      />

      <main className="relative pt-4">
        {/* Background glow effects for premium look */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <TaskQueue 
          tasks={tasks}
          onSelectTask={setSelectedTask}
          pendingSyncIds={new Set(pendingSyncTasks.keys())}
        />
      </main>

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onComplete={handleCompleteTask}
          isPendingSync={pendingSyncTasks.has(selectedTask.id)}
        />
      )}

      <SyncProgressOverlay 
        isVisible={syncVisible}
        isComplete={syncComplete}
        syncedCount={pendingSyncTasks.size}
      />
    </div>
  );
}
