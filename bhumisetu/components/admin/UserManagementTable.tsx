'use client';

import { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineEllipsisVertical } from 'react-icons/hi2';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastActive: string;
}

export default function UserManagementTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col h-full border border-black/5 dark:border-white/5">
      <div className="p-5 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/5 dark:bg-white/5">
        <div>
          <h2 className="text-lg font-bold text-heading">User Access Control</h2>
          <p className="text-xs text-muted mt-0.5">Manage officers, field agents, and admins</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64"
            />
          </div>
          <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition">
            <HiOutlineFunnel className="w-5 h-5 text-heading" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 text-xs font-semibold text-muted uppercase tracking-wider bg-black/5 dark:bg-white/5">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last Active</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredUsers.map((user, i) => (
              <tr 
                key={user.id} 
                className={`group hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${i !== filteredUsers.length - 1 ? 'border-b border-black/5 dark:border-white/5' : ''}`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-heading">{user.name}</div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-medium text-body">{user.role}</span>
                </td>
                <td className="px-5 py-4 text-muted text-xs">
                  {user.department}
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block
                    ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
                      user.status === 'Inactive' ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20' : 
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-muted">
                  {new Date(user.lastActive).toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition opacity-0 group-hover:opacity-100">
                    <HiOutlineEllipsisVertical className="w-5 h-5 text-muted" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
