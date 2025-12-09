import React, { useState, useMemo, useEffect } from 'react';
import { Clipboard, Moon, Sun, Loader2 } from 'lucide-react';
import {supabase} from './supabaseClient'; // Import the database connection
import { CHANNELS, INITIAL_AGENTS } from './data/constants';
import AgentSelector from './components/AgentSelector';
import DateRangePill from './components/DateRangePill';
import DashboardStats from './components/DashboardStats';
import ChannelGrid from './components/ChannelGrid';
import RecentActivity from './components/RecentActivity';
import ActionModal from './components/ActionModal';

export default function App() {
  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(false);
  // (Simplified theme logic for brevity, you can keep your existing detailed logic)
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // --- DATA STATE ---
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
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

  // --- DATABASE: FETCH DATA ---
  useEffect(() => {
    fetchLeads();
  }, []); // Run once when app loads

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: true }); // Get all leads
      
      if (error) throw error;
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error.message);
      triggerToast('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FILTERING ---
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesAgent = lead.agent === selectedAgent;
      // Database returns YYYY-MM-DD so simple string comparison works
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

  // --- HANDLERS (UPDATED FOR DB) ---
  const handleLogLead = async (status) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Optimistic UI Update (Show it immediately before DB confirms)
    const tempId = Date.now();
    const newLead = {
      id: tempId,
      agent: selectedAgent,
      channel: activeChannel.name,
      status: status,
      timestamp: getTodayString(),
      time_logged: timeNow
    };
    
    // Update local state immediately
    setLeads(prev => [...prev, newLead]);
    triggerToast(`${status} logged!`);

    // Send to Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        agent: selectedAgent,
        channel: activeChannel.name,
        status: status,
        timestamp: getTodayString(),
        time_logged: timeNow
      }])
      .select();

    if (error) {
      console.error('Error inserting:', error);
      triggerToast('Failed to save to cloud!');
      // Revert change if it failed
      setLeads(prev => prev.filter(l => l.id !== tempId));
    } else {
      // Replace the temp local entry with the real DB entry (which has the real ID)
      setLeads(prev => prev.map(l => l.id === tempId ? data[0] : l));
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Delete this entry?')) {
      // Update local state immediately
      setLeads(prev => prev.filter(l => l.id !== id));
      triggerToast('Entry deleted');

      // Delete from Supabase
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting:', error);
        triggerToast('Failed to delete from cloud');
        fetchLeads(); // Reload data to sync up
      }
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
                <p className="text-xs text-white/80 font-medium uppercase tracking-widest flex items-center gap-2">
                  Inbound Tracker
                  {isLoading && <Loader2 size={12} className="animate-spin" />}
                </p>
              </div>
              <button onClick={handleCopyReport} className="ml-2 bg-white/10 p-2.5 rounded-xl hover:bg-white/20 text-white transition-all active:scale-95" title="Copy Report">
                <Clipboard size={18} />
              </button>
            </div>
            <button onClick={toggleTheme} className="lg:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
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
              <button onClick={toggleTheme} className="hidden lg:block p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
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