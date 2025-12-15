import React, { useState } from 'react';
import { ClipMetadata } from '../types';
import { Download, AlertTriangle, CheckCircle, Copy, Clock, Smartphone, Eye, FileJson, Terminal, X, ExternalLink } from 'lucide-react';

interface ClipCardProps {
  clip: ClipMetadata;
  sourceUrl?: string;
}

const ClipCard: React.FC<ClipCardProps> = ({ clip, sourceUrl }) => {
  const [showCommand, setShowCommand] = useState(false);
  const isHighRisk = clip.monetization_risk === 'not_recommended';
  const isCensorNeeded = clip.monetization_risk === 'needs_censor';

  const copyMetadata = () => {
    const text = JSON.stringify(clip, null, 2);
    navigator.clipboard.writeText(text);
    alert("Metadata copied to clipboard!");
  };

  const toggleCommand = () => {
    if (!sourceUrl) {
      alert("Please provide a Source URL in the Analysis Settings to generate download commands.");
      return;
    }
    setShowCommand(!showCommand);
  };

  // Generate yt-dlp command
  // Command structure: yt-dlp --download-sections "*start-end" "url" -o "output.mp4"
  const getDownloadCommand = () => {
    if (!sourceUrl) return '';
    // Ensure timestamps are treated as strings. The API returns MM:SS which yt-dlp understands.
    return `yt-dlp --download-sections "*${clip.start_time}-${clip.end_time}" "${sourceUrl}" -o "viral_clip_${clip.clip_id}.mp4" --force-keyframes-at-cuts`;
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(getDownloadCommand());
    alert("yt-dlp command copied! Run this in your terminal.");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 group flex flex-col h-full shadow-lg hover:shadow-purple-900/10 relative">
      
      {/* Command Overlay */}
      {showCommand && (
        <div className="absolute inset-0 bg-zinc-950/95 z-20 p-6 flex flex-col justify-center animate-fade-in backdrop-blur-sm">
           <button 
             onClick={() => setShowCommand(false)}
             className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
           >
             <X size={20} />
           </button>
           <div className="text-center mb-4">
             <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Terminal className="text-purple-400" size={20} />
             </div>
             <h4 className="text-white font-semibold">Download Clip</h4>
             <p className="text-xs text-zinc-500 mt-1">Run this command in your terminal (requires yt-dlp)</p>
           </div>
           
           <div className="bg-black/50 border border-zinc-800 rounded-lg p-3 font-mono text-[10px] text-zinc-300 break-all mb-4 relative group/code">
             {getDownloadCommand()}
           </div>

           <button 
             onClick={copyCommand}
             className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
           >
             <Copy size={14} /> Copy Command
           </button>
        </div>
      )}

      {/* Header / Score */}
      <div className="p-4 flex justify-between items-start border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex-1 pr-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {clip.category.slice(0, 2).map((cat, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded uppercase tracking-wide border border-purple-500/20">
                {cat}
              </span>
            ))}
            {isHighRisk && (
              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded uppercase tracking-wide border border-red-500/20 flex items-center gap-1">
                <AlertTriangle size={10} /> Risk
              </span>
            )}
            {isCensorNeeded && (
              <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded uppercase tracking-wide border border-yellow-500/20 flex items-center gap-1">
                <AlertTriangle size={10} /> Censor
              </span>
            )}
            {!isHighRisk && !isCensorNeeded && (
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase tracking-wide border border-green-500/20 flex items-center gap-1">
                <CheckCircle size={10} /> Safe
              </span>
            )}
          </div>
          <h3 className="text-zinc-100 font-semibold text-lg leading-tight line-clamp-2" title={clip.video_title}>
            {clip.video_title}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center bg-zinc-950 rounded-lg p-2 border border-zinc-800 min-w-[60px]">
          <div className={`text-2xl font-black ${clip.viral_score >= 9 ? 'text-green-400' : clip.viral_score >= 8 ? 'text-purple-400' : 'text-zinc-400'}`}>
            {clip.viral_score}
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Score</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 flex-grow">
        {/* Why it works */}
        <div className="space-y-1">
          <h4 className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider flex items-center gap-1">
             <Eye size={12} /> Viral Psychology
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed italic">
            "{clip.reason}"
          </p>
        </div>

        {/* Hook */}
        <div className="bg-zinc-800/30 border border-zinc-800 p-3 rounded-lg">
           <h4 className="text-[10px] uppercase text-purple-400 font-bold tracking-wider flex items-center gap-1 mb-1">
             <Smartphone size={12} /> Recommended Hook
          </h4>
          <p className="text-sm font-bold text-white">
            "{clip.on_screen_hook}"
          </p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
           <span className="flex items-center gap-1">
             <Clock size={12} /> {clip.start_time} - {clip.end_time}
           </span>
           <span>•</span>
           <span>{clip.duration}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={copyMetadata}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title="Copy JSON Metadata"
          >
            <FileJson size={16} />
          </button>
          
          <button 
            onClick={toggleCommand}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700"
            title="Get Download Command"
          >
            <Download size={14} /> 
            {sourceUrl ? 'Get Clip' : 'No Source'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClipCard;