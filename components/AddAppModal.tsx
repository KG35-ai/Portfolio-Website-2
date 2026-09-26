import React, { useState } from 'react';
import { X, Sparkles, Plus, Link, Code, Image as ImageIcon, Layers } from 'lucide-react';

export interface ProjectApp {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
  embedUrl?: string;
  isAiStudio?: boolean;
}

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: ProjectApp) => void;
}

export const AddAppModal: React.FC<AddAppModalProps> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const techArray = techInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const defaultImage = image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
    const appLink = link || embedUrl || "https://ai.studio/build";
    const appEmbed = embedUrl || link || "https://ai.studio/build";

    onAddProject({
      id: Date.now().toString(),
      title,
      description,
      tech: techArray.length > 0 ? techArray : ["Gemini AI", "React", "TypeScript"],
      image: defaultImage,
      link: appLink,
      embedUrl: appEmbed,
      isAiStudio: true
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setTechInput('');
    setImage('');
    setLink('');
    setEmbedUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-zinc-950 border border-white/15 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
          <Sparkles size={14} /> AI Studio Integration
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-6">Integrate AI Studio App</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              App Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Diketo AI Heritage Agent"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of what this AI Studio app does..."
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Link size={12} /> AI Studio Live App / Preview URL
            </label>
            <input
              type="url"
              value={embedUrl}
              onChange={e => setEmbedUrl(e.target.value)}
              placeholder="https://ais-pre-...run.app or AI Studio URL"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Code size={12} /> GitHub / Specs Link
            </label>
            <input
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://github.com/KG35-ai/..."
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers size={12} /> Tech Stack (comma separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              placeholder="Gemini 3 Flash, React, TypeScript, Cloud Run"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <ImageIcon size={12} /> Thumbnail Image URL (optional)
            </label>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Embed App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppModal;
