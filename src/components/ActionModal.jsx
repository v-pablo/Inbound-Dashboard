import React from 'react';
import { Users, Trophy, X } from 'lucide-react';

export default function ActionModal({ activeChannel, stats, onClose, onLog }) {
  if (!activeChannel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 max-w-md w-full shadow-2xl z-10 animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${activeChannel.color} shadow-lg`}>
              <activeChannel.icon size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeChannel.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition text-gray-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl text-center border border-green-100 dark:border-green-800">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{stats.assigned}</p>
            <p className="text-xs text-green-400 dark:text-green-300 font-bold uppercase tracking-wider">Assigned</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-800">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stats.converted}</p>
            <p className="text-xs text-blue-400 dark:text-blue-300 font-bold uppercase tracking-wider">Converted</p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => onLog('Assigned')}
            className="w-full px-4 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition-transform active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
          >
            <Users size={20} /> Log as Assigned
          </button>
          
          <button 
            onClick={() => onLog('Converted')}
            className="w-full px-4 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold transition-transform active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
          >
            <Trophy size={20} /> Log as Converted
          </button>
        </div>
      </div>
    </div>
  );
}