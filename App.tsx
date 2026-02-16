import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { JobApplication, JobStatus } from './types';
import { LayoutDashboard, Rocket } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'job-mission-control-data';

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load jobs", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job: JobApplication) => {
    setJobs(prev => [job, ...prev]);
  };

  const updateJobStatus = (id: string, status: JobStatus) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  };

  const deleteJob = (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
        setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-space-900 text-gray-200 font-sans selection:bg-space-accent selection:text-white">
      
      {/* Sidebar / Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-space-800 border-r border-space-700 z-50 transition-all flex flex-col">
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-space-700">
          <div className="w-10 h-10 bg-gradient-to-br from-space-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Rocket className="text-white w-6 h-6" />
          </div>
          <span className="ml-3 font-bold text-white text-lg hidden md:block tracking-tight">Mission Control</span>
        </div>

        <nav className="flex-1 py-8 space-y-2 px-3">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-space-700 text-white shadow-md' : 'text-gray-400 hover:bg-space-800 hover:text-gray-200'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:block font-medium">Dashboard</span>
          </button>
        </nav>

        <div className="p-4 border-t border-space-700">
             <div className="bg-space-900 rounded-lg p-3">
                <p className="text-xs text-gray-500 text-center md:text-left">
                    <span className="hidden md:inline">API Status: </span>
                    <span className="inline-flex items-center gap-1 text-success">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        <span className="hidden md:inline">Online</span>
                    </span>
                </p>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-20 md:pl-64 min-h-screen">
        <header className="h-20 border-b border-space-700 bg-space-900/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            <div>
                <h1 className="text-xl font-bold text-white">
                    {view === 'dashboard' ? 'Overview' : 'Settings'}
                </h1>
                <p className="text-sm text-gray-500">Welcome back, Commander.</p>
            </div>
            
            <div className="flex items-center gap-4">
               {/* User Avatar Placeholder */}
               <div className="w-10 h-10 rounded-full bg-space-700 border border-space-600 flex items-center justify-center">
                    <span className="font-bold text-sm text-gray-300">CM</span>
               </div>
            </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
            {view === 'dashboard' && (
                <Dashboard 
                    jobs={jobs} 
                    onAddJob={addJob} 
                    onUpdateStatus={updateJobStatus} 
                    onDeleteJob={deleteJob}
                />
            )}
        </div>
      </main>
    </div>
  );
}