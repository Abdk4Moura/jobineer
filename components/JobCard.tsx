import React from 'react';
import { Mail, MessageCircle, ExternalLink, Clock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { JobApplication, ActionType, JobStatus } from '../types';

interface JobCardProps {
  job: JobApplication;
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onUpdateStatus, onDelete }) => {
  
  const getActionIcon = () => {
    switch (job.actionType) {
      case ActionType.EMAIL: return <Mail className="w-4 h-4 text-blue-400" />;
      case ActionType.WHATSAPP: return <MessageCircle className="w-4 h-4 text-green-400" />;
      default: return <ExternalLink className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleAction = () => {
    switch (job.actionType) {
      case ActionType.EMAIL:
        window.open(`mailto:${job.contactTarget}?subject=Application for ${job.roleTitle} at ${job.companyName}`);
        break;
      case ActionType.WHATSAPP:
        // Strip non-numeric for deep link
        const cleanNumber = job.contactTarget.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNumber}?text=Hi, I'm interested in the ${job.roleTitle} role.`);
        break;
      default:
        window.open(job.contactTarget, '_blank');
    }
  };

  return (
    <div className="bg-space-800 border border-space-700 rounded-xl p-4 mb-4 hover:border-space-600 transition-all shadow-sm group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">{job.companyName}</h3>
          <p className="text-space-accent font-medium text-sm">{job.roleTitle}</p>
        </div>
        <div className="p-2 bg-space-900 rounded-lg border border-space-700">
            {getActionIcon()}
        </div>
      </div>

      <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
        {job.summary}
      </p>

      <div className="flex items-center justify-between mt-4 border-t border-space-700 pt-3">
        <div className="flex gap-2">
          {job.status === JobStatus.INBOX && (
             <button 
                onClick={handleAction}
                className="text-xs bg-space-700 hover:bg-space-600 text-white px-3 py-1.5 rounded-md transition-colors"
             >
                {job.actionType === 'EMAIL' ? 'Draft Email' : 'Open Link'}
             </button>
          )}
          
          <div className="relative group/status">
            <button className="text-xs border border-space-600 text-gray-400 hover:text-white px-2 py-1.5 rounded-md transition-colors">
              Move
            </button>
            <div className="absolute left-0 mt-1 w-32 bg-space-900 border border-space-700 rounded-lg shadow-xl hidden group-hover/status:block z-20">
              <div className="py-1">
                {Object.values(JobStatus).map((status) => (
                    <button
                        key={status}
                        onClick={() => onUpdateStatus(job.id, status)}
                        className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-space-800"
                    >
                        {status}
                    </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button 
            onClick={() => onDelete(job.id)}
            className="text-gray-600 hover:text-red-400 transition-colors p-1"
        >
            <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};