import React, { useState, useMemo, useEffect } from 'react';
import { Clipboard, Moon, Sun } from 'lucide-react';
import { CHANNELS, INITIAL_AGENTS } from './data/constants';
import AgentSelector from './components/AgentSelector';
import DateRangePill from './components/DateRangePill';
import DashboardStats from './components/DashboardStats';
import ChannelGrid from './components/ChannelGrid';
import RecentActivity from './components/RecentActivity';
import ActionModal from './components/ActionModal';

export default function App() {
  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    } catch (e) { return false; }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- DATA STATE ---
const [leads, setLeads] = useState(() => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('rentalTallyLeads');
    // Check if 'saved' exists and is not the string "undefined"
    if (saved && saved !== "undefined") {
      return JSON.parse(saved);
    }
    return [];
  } catch (e) {
    console.error("Storage error:", e);
    return [];
  }
});

  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState(INITIAL_AGENTS[0]);
  
  const getTodayString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - (offset * 60 * 1000));
    return local.toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState({ start: getTodayString(), end: getTodayString() });
  const [activeChannel, setActiveChannel] = useState(null); 
  const [toast, setToast] = useState(null);

  // Persistence
 useEffect(() => {
  if (leads && Array.isArray(leads)) {
    localStorage.setItem('rentalTallyLeads', JSON.stringify(leads));
  }
}, [leads]);

  // --- FILTERING ---
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesAgent = lead.agent === selectedAgent;
      const matchesDate = lead.timestamp >= dateRange.start && lead.timestamp <= dateRange.end;
      return matchesAgent && matchesDate;
    });
  }, [leads, selectedAgent, dateRange]);

  const dashboardStats = {
    assigned: filteredLeads.filter(l => l.status === 'Assigned').length,
    converted: filteredLeads.filter(l => l.status === 'Converted').length,
  };

  const modalStats = useMemo(() => {
    if (!activeChannel) return { assigned: 0, converted: 0 };
    const channelLeads = filteredLeads.filter(l => l.channel === activeChannel.name);
    return {
      assigned: channelLeads.filter(l => l.status === 'Assigned').length,
      converted: channelLeads.filter(l => l.status === 'Converted').length,
    };
  }, [filteredLeads, activeChannel]);

  // --- HANDLERS ---
  const handleLogLead = (status) => {
    const newLead = {
      id: Date.now(),
      agent: selectedAgent,
      channel: activeChannel.name,
      status: status,
      timestamp: getTodayString(),
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLeads(prev => [...prev, newLead]);
    triggerToast(`${status} logged!`);
  };

  const handleDeleteLead = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
      triggerToast('Entry deleted');
    }
  };

  const handleCopyReport = () => {
    const report = `
📊 *Rental Tally Report* (${dateRange.start})
------------------
👤 Agent: ${selectedAgent}
✅ Assigned: ${dashboardStats.assigned}
🏆 Converted: ${dashboardStats.converted}
------------------
*Breakdown:*
${CHANNELS.map(c => {
  const count = filteredLeads.filter(l => l.channel === c.name).length;
  return count > 0 ? `${c.name}: ${count}` : null;
}).filter(Boolean).join('\n')}
    `.trim();

    navigator.clipboard.writeText(report);
    triggerToast('Report copied!');
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  // --- RENDER ---
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 selection:bg-green-200 dark:selection:bg-green-900 ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className="bg-shuttlers-green p-6 shadow-sm border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Rental Tally</h1>
                <p className="text-xs text-white/80 font-medium uppercase tracking-widest">Inbound Tracker</p>
              </div>
              <button onClick={handleCopyReport} className="ml-2 bg-white/10 p-2.5 rounded-xl hover:bg-white/20 text-white transition-all active:scale-95" title="Copy Report">
                <Clipboard size={18} />
              </button>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="lg:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-start sm:items-center">
            <DateRangePill 
              start={dateRange.start} 
              end={dateRange.end}
              onChangeStart={(val) => setDateRange({...dateRange, start: val})}
              onChangeEnd={(val) => setDateRange({...dateRange, end: val})}
            />
            <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <AgentSelector 
                agents={agents} 
                selected={selectedAgent} 
                onSelect={setSelectedAgent}
                onAdd={(name) => { setAgents([...agents, name]); setSelectedAgent(name); }}
              />
              <button onClick={() => setDarkMode(!darkMode)} className="hidden lg:block p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DashboardStats stats={dashboardStats} />
        
        <ChannelGrid 
          channels={CHANNELS} 
          activeChannel={activeChannel}
          onSelect={setActiveChannel}
          getChannelTotal={(name) => filteredLeads.filter(l => l.channel === name).length}
        />

        <RecentActivity 
          leads={filteredLeads.slice().reverse().slice(0, 5)} 
          onDelete={handleDeleteLead}
        />
      </div>
      
      {/* MODAL & TOAST */}
      <ActionModal 
        activeChannel={activeChannel}
        stats={modalStats}
        onClose={() => setActiveChannel(null)}
        onLog={handleLogLead}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 z-50 font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {toast}
        </div>
      )}
    </div>
  );
}