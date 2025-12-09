import React from 'react';

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75"></div>
         <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2 relative z-10">Assigned</p>
         <p className="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">{stats.assigned}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75"></div>
         <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2 relative z-10">Converted</p>
         <p className="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">{stats.converted}</p>
      </div>
    </div>
  );
}