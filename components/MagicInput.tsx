import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { parseJobDescription } from '../services/geminiService';
import { JobApplication, JobStatus, ActionType } from '../types';

interface MagicInputProps {
  onJobAdded: (job: JobApplication) => void;
}

export const MagicInput: React.FC<MagicInputProps> = ({ onJobAdded }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const parsedData = await parseJobDescription(text);
      
      const newJob: JobApplication = {
        id: crypto.randomUUID(),
        ...parsedData,
        rawContent: text,
        status: JobStatus.INBOX,
        createdAt: Date.now(),
      };

      onJobAdded(newJob);
      setText(''); // Clear input on success
    } catch (error) {
      console.error("Failed to process", error);
      alert("Failed to process job. Check console.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-space-800 border border-space-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-space-accent opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-700"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-space-accent" />
          <h2 className="text-lg font-semibold text-white">Magic Paste</h2>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste job description, email content, or WhatsApp message here..."
          className="w-full h-32 bg-space-900 border border-space-700 rounded-xl p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-space-accent focus:border-transparent resize-none font-mono text-sm placeholder-gray-600 mb-4 transition-all"
        />

        <div className="flex justify-end">
          <button
            onClick={handleProcess}
            disabled={isProcessing || !text.trim()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all
              ${isProcessing || !text.trim() 
                ? 'bg-space-700 cursor-not-allowed text-gray-400' 
                : 'bg-space-accent hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 active:scale-95'}`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing with Gemini...
              </>
            ) : (
              <>
                Analyze & Save
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};