import React from 'react';

export default function DashboardStats({ stats }) {
  // Simple currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Card 1: Assigned */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2 relative z-10">Assigned</p>
         <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">{stats.assigned}</p>
      </div>

      {/* Card 2: Converted Count */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2 relative z-10">Conversions</p>
         <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">{stats.converted}</p>
      </div>

      {/* Card 3: Revenue (NEW) */}
      <div className="bg-slate-900 dark:bg-blue-600 p-6 rounded-3xl shadow-lg border border-slate-800 dark:border-blue-500 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <p className="text-xs text-slate-400 dark:text-blue-200 font-bold uppercase tracking-wider mb-2 relative z-10">Revenue</p>
         <p className="text-3xl font-extrabold text-white relative z-10 truncate">
           {formatCurrency(stats.revenue)}
         </p>
      </div>
    </div>
  );
}