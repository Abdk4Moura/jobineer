import React from 'react';
import { JobApplication, JobStats, JobStatus } from '../types';
import { StatsCard } from './StatsCard';
import { Inbox, Briefcase, UserCheck, Trophy } from 'lucide-react';
import { JobCard } from './JobCard';
import { MagicInput } from './MagicInput';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  jobs: JobApplication[];
  onAddJob: (job: JobApplication) => void;
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDeleteJob: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ jobs, onAddJob, onUpdateStatus, onDeleteJob }) => {
  
  const stats: JobStats = {
    total: jobs.length,
    inbox: jobs.filter(j => j.status === JobStatus.INBOX).length,
    applied: jobs.filter(j => j.status === JobStatus.APPLIED).length,
    interviewing: jobs.filter(j => j.status === JobStatus.INTERVIEWING).length,
    offers: jobs.filter(j => j.status === JobStatus.OFFER).length,
  };

  const pieData = [
    { name: 'Inbox', value: stats.inbox, color: '#94a3b8' },
    { name: 'Applied', value: stats.applied, color: '#6366f1' },
    { name: 'Interviewing', value: stats.interviewing, color: '#f59e0b' },
    { name: 'Offers', value: stats.offers, color: '#10b981' },
  ].filter(d => d.value > 0);

  const inboxJobs = jobs.filter(j => j.status === JobStatus.INBOX);
  const activeJobs = jobs.filter(j => [JobStatus.APPLIED, JobStatus.INTERVIEWING].includes(j.status));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Inbox" value={stats.inbox} icon={Inbox} colorClass="text-gray-400" />
        <StatsCard title="Applied" value={stats.applied} icon={Briefcase} colorClass="text-space-accent" trend="+2 this week" />
        <StatsCard title="Interviewing" value={stats.interviewing} icon={UserCheck} colorClass="text-warning" />
        <StatsCard title="Offers" value={stats.offers} icon={Trophy} colorClass="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Magic Input & Inbox */}
        <div className="lg:col-span-2 space-y-8">
            <MagicInput onJobAdded={onAddJob} />

            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Inbox className="w-5 h-5" />
                    Pending Action ({stats.inbox})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inboxJobs.length > 0 ? (
                        inboxJobs.map(job => (
                            <JobCard 
                                key={job.id} 
                                job={job} 
                                onUpdateStatus={onUpdateStatus} 
                                onDelete={onDeleteJob}
                            />
                        ))
                    ) : (
                        <div className="col-span-full border-2 border-dashed border-space-700 rounded-xl p-8 text-center text-gray-500">
                            No pending jobs. Paste a description above to get started.
                        </div>
                    )}
                </div>
            </div>

             <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Active Applications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeJobs.map(job => (
                         <JobCard 
                            key={job.id} 
                            job={job} 
                            onUpdateStatus={onUpdateStatus} 
                            onDelete={onDeleteJob}
                        />
                    ))}
                </div>
             </div>
        </div>

        {/* Right Column: Analytics & Quick View */}
        <div className="space-y-8">
            <div className="bg-space-800 border border-space-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Pipeline Health</h3>
                <div className="h-64 w-full">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            Not enough data
                        </div>
                    )}
                </div>
                <div className="mt-4 space-y-2">
                    {pieData.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-300">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                {entry.name}
                            </span>
                            <span className="font-mono text-gray-400">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};