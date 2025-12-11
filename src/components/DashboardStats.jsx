import React from 'react';
import { TrendingUp } from 'lucide-react';

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
    // UPDATED: Changed grid to 4 columns on large screens (lg:grid-cols-4)
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Card 1: Assigned */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75"></div>
         <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2 relative z-10">Assigned</p>
         <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">{stats.assigned}</p>
      </div>

      {/* Card 2: Converted Count */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75"></div>
         <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2 relative z-10">Conversions</p>
         <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">{stats.converted}</p>
      </div>

      {/* Card 3: Conversion Rate (NEW) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-violet-50 dark:bg-violet-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-75"></div>
         <div className="flex justify-between items-start relative z-10">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">Win Rate</p>
            {/* Visual Indicator icon */}
            <div className={`p-1.5 rounded-full ${stats.rate >= 50 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <TrendingUp size={14} />
            </div>
         </div>
         <div className="flex items-baseline gap-1 relative z-10">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.rate}%</p>
         </div>
      </div>

      {/* Card 4: Revenue */}
      <div className="bg-slate-900 dark:bg-blue-600 p-6 rounded-3xl shadow-lg border border-slate-800 dark:border-blue-500 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <p className="text-xs text-slate-400 dark:text-blue-200 font-bold uppercase tracking-wider mb-2 relative z-10">Revenue</p>
         <p className="text-2xl sm:text-3xl font-extrabold text-white relative z-10 truncate">
           {formatCurrency(stats.revenue)}
         </p>
      </div>

    </div>
  );
}