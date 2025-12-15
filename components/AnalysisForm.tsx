import React, { useState } from 'react';
import { AnalysisSettings } from '../types';
import { Sparkles, Play, Settings2, FileText, AlignLeft, Link } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (transcript: string, settings: AnalysisSettings) => void;
  isLoading: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading }) => {
  const [transcript, setTranscript] = useState('');
  const [settings, setSettings] = useState<AnalysisSettings>({
    platform: 'TikTok',
    clipLength: '30s',
    niche: 'Podcast',
    language: 'English',
    sourceUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    onAnalyze(transcript, settings);
  };

  const handleChange = (field: keyof AnalysisSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm sticky top-6">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
          <Settings2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Analysis Engine</h2>
          <p className="text-xs text-zinc-500">Configure your viral criteria</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Source URL Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Link size={14} /> Source Video URL <span className="text-zinc-600 normal-case">(Optional)</span>
          </label>
          <input
            type="url"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 placeholder-zinc-700"
            placeholder="https://youtube.com/watch?v=..."
            value={settings.sourceUrl}
            onChange={(e) => handleChange('sourceUrl', e.target.value)}
            disabled={isLoading}
          />
          <p className="text-[10px] text-zinc-500">Required to generate mp4 download commands.</p>
        </div>

        {/* Transcript Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <AlignLeft size={14} /> Paste Transcript
          </label>
          <textarea
            className="w-full h-48 bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none font-mono"
            placeholder="Paste raw transcript text here... (Podcast, Interview, Video Script)"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 font-medium">Platform</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50"
              value={settings.platform}
              onChange={(e) => handleChange('platform', e.target.value)}
              disabled={isLoading}
            >
              <option value="TikTok">TikTok</option>
              <option value="Reels">Instagram Reels</option>
              <option value="Shorts">YouTube Shorts</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 font-medium">Clip Length</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50"
              value={settings.clipLength}
              onChange={(e) => handleChange('clipLength', e.target.value)}
              disabled={isLoading}
            >
              <option value="15s">15 Seconds</option>
              <option value="30s">30 Seconds</option>
              <option value="60s">60 Seconds</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 font-medium">Niche/Topic</label>
            <input
              type="text"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 placeholder-zinc-700"
              placeholder="e.g. Finance, Comedy"
              value={settings.niche}
              onChange={(e) => handleChange('niche', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 font-medium">Language</label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              disabled={isLoading}
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
              <option value="Mixed">Mixed</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !transcript.trim()}
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
            isLoading || !transcript.trim()
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-900/40 hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
              ANALYZING VIRALITY...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              RUN ANALYSIS ENGINE
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;