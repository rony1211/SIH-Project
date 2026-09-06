'use client';

import { 
  HiOutlineMapPin, 
  HiOutlineCalendar, 
  HiOutlineDocumentDuplicate,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineUserCircle
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

interface TaskQueueProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  pendingSyncIds: Set<string>;
}

export default function TaskQueue({ tasks, onSelectTask, pendingSyncIds }: TaskQueueProps) {
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Urgent': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string, isPendingSync: boolean) => {
    if (isPendingSync) return <HiOutlineExclamationCircle className="w-5 h-5 text-amber-500" />;
    if (status === 'Completed') return <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />;
    return <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />;
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto w-full pb-24">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-heading">Today's Tasks</h3>
        <span className="text-sm font-medium bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-muted">
          {tasks.filter(t => t.status !== 'Completed').length} Remaining
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tasks.map(task => {
        const isPendingSync = pendingSyncIds.has(task.id);
        const isCompleted = task.status === 'Completed' && !isPendingSync;

        return (
          <div 
            key={task.id}
            onClick={() => onSelectTask(task)}
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer group
              ${isCompleted 
                ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/20 opacity-70' 
                : 'bg-white/60 dark:bg-slate-800/60 border-white/20 dark:border-white/10 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1'
              }`}
          >
            {/* Top gradient accent */}
            <div className={`absolute top-0 left-0 w-full h-1 ${isCompleted ? 'bg-emerald-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`} />
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border w-max
                    ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <h4 className="text-base font-bold text-heading leading-tight mt-1">{task.type}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status, isPendingSync)}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-body">
                  <HiOutlineUserCircle className="w-4 h-4 text-muted" />
                  <span className="font-medium">{task.landowner}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <HiOutlineMapPin className="w-4 h-4" />
                    <span>{task.village}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                    {task.distance} away
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-black/5 dark:bg-white/5 px-4 py-3 flex items-center justify-between border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-1 text-xs font-medium text-muted">
                <HiOutlineCalendar className="w-4 h-4" />
                Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-muted">
                <HiOutlineDocumentDuplicate className="w-4 h-4" />
                {task.documentsRequired.length} Docs
              </div>
            </div>
          </div>
        );
      })}
      </div>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
          <HiOutlineCheckCircle className="w-12 h-12 text-emerald-500 mb-3 opacity-50" />
          <p className="text-body font-medium">All caught up!</p>
          <p className="text-sm text-muted">No tasks assigned for today.</p>
        </div>
      )}
    </div>
  );
}
