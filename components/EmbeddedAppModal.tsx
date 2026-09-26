import React, { useState } from 'react';
import { X, ExternalLink, Monitor, Tablet, Smartphone, RefreshCw, Maximize2, Sparkles, ShieldAlert } from 'lucide-react';

interface EmbeddedAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  appTitle: string;
  appUrl: string;
  description?: string;
  tech?: string[];
}

export const EmbeddedAppModal: React.FC<EmbeddedAppModalProps> = ({
  isOpen,
  onClose,
  appTitle,
  appUrl,
  description,
  tech = []
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const getIframeWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[375px] h-[667px]';
      case 'tablet':
        return 'max-w-[768px] h-[800px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className={`flex flex-col bg-zinc-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 w-full ${isFullscreen ? 'h-full max-w-none' : 'max-w-6xl h-[90vh]'}`}>
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-zinc-900/90 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:opacity-80" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="ml-2 h-4 w-[1px] bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                <Sparkles size={10} /> AI Studio App
              </span>
              <h3 className="text-sm font-black text-white truncate max-w-[200px] sm:max-w-[300px]">
                {appTitle}
              </h3>
            </div>
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-zinc-800/80 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setDeviceMode('desktop')}
                title="Desktop View"
                className={`p-1.5 rounded-full transition-all ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                title="Tablet View"
                className={`p-1.5 rounded-full transition-all ${deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                title="Mobile View"
                className={`p-1.5 rounded-full transition-all ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <Smartphone size={14} />
              </button>
            </div>

            <button
              onClick={handleRefresh}
              title="Refresh App Frame"
              className="p-2 bg-zinc-800/80 border border-white/10 hover:border-white/20 rounded-full text-zinc-300 hover:text-white transition-all"
            >
              <RefreshCw size={14} />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Toggle Fullscreen"
              className="p-2 bg-zinc-800/80 border border-white/10 hover:border-white/20 rounded-full text-zinc-300 hover:text-white transition-all hidden sm:block"
            >
              <Maximize2 size={14} />
            </button>

            <a
              href={appUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-wider rounded-full transition-all"
            >
              <span>New Tab</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={onClose}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Info Strip */}
        {description && (
          <div className="px-6 py-2 bg-zinc-900/40 border-b border-white/5 flex items-center justify-between text-xs text-zinc-400">
            <span className="truncate mr-4">{description}</span>
            <div className="flex gap-2 shrink-0 hidden md:flex">
              {tech.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-zinc-800 text-[9px] uppercase tracking-widest text-zinc-300 font-extrabold rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Embed Canvas Area */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center overflow-auto p-2 sm:p-4 relative">
          <div className={`transition-all duration-300 mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black ${getIframeWidth()}`}>
            <iframe
              key={iframeKey}
              src={appUrl}
              title={appTitle}
              className="w-full h-full border-0 bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone; camera; geolocation"
              sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
            />
          </div>
        </div>

        {/* Footer help note */}
        <div className="px-6 py-2 bg-zinc-900/60 border-t border-white/5 text-[10px] text-zinc-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-amber-400" />
            Embedded live app preview hosted on AI Studio / Cloud Run container.
          </span>
          <a href={appUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
            Can't see the app? Click to open directly &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedAppModal;
