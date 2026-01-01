import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Code, Palette, Cpu, Globe, Bot, Phone } from 'lucide-react';
import Scene from './components/Scene';
import ChatBot from './components/ChatBot';

// Project Data - Updated to reflect Resume Tech Stack and actual builds
const PROJECTS = [
  {
    title: "AgileTask Flutter",
    description: "A cross-platform task management system built with Flutter and Firebase, featuring real-time state sync and agile boards.",
    tech: ["Flutter", "Firebase", "Dart"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600",
    link: "https://github.com/KG35-ai"
  },
  {
    title: "AI Agent Workflow",
    description: "Built during the Kaggle Intensive, this project automates data preprocessing using Gemini-powered intelligent agents.",
    tech: ["Python", "Gemini API", "SQL"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
    link: "https://github.com/KG35-ai"
  },
  {
    title: "NeonVerse UI",
    description: "High-fidelity prototype and design system for a 3D commerce platform, focusing on immersive interactive web experiences.",
    tech: ["Figma", "UI/UX", "Wireframing"],
    image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=600",
    link: "https://github.com/KG35-ai"
  }
];

// Skill Data - Organized by Resume Categories
const SKILLS = [
  { 
    name: "Development", 
    icon: <Code size={24} />, 
    items: ["Flutter & Firebase", "Full-Stack Web", "Git & GitHub", "React & TypeScript"] 
  },
  { 
    name: "Management & Design", 
    icon: <Palette size={24} />, 
    items: ["Agile & Scrum", "Project Coordination", "Figma & Prototyping", "Wireframing"] 
  },
  { 
    name: "AI & Data", 
    icon: <Cpu size={24} />, 
    items: ["AI Agent Fundamentals", "Model Workflows", "SQL & Data Prep", "Machine Learning"] 
  },
];

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const githubUrl = "https://github.com/KG35-ai";
  const linkedinUrl = "https://www.linkedin.com/in/kgotso-phiri-98aa21276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app";
  const email = "phirikg22@gmail.com";
  const phone = "065 968 1959";

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* 3D Background - Fixed Position */}
      <Scene />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-800' : 'py-6 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Kgotso Phiri
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-300">
            <a href="#work" className="hover:text-white transition-colors">WORK</a>
            <a href="#skills" className="hover:text-white transition-colors">SKILLS</a>
            <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
            <a href="#contact" className="hover:text-white transition-colors">CONTACT</a>
          </div>
          <a href="#contact" className="bg-white text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors">
            Hire Me
          </a>
        </div>
      </nav>

      {/* Main Content - Scrollable overlay */}
      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="h-screen flex flex-col justify-center px-6 container mx-auto">
          <div className="max-w-4xl space-y-6">
            <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium backdrop-blur-sm">
              FNB App Academy Graduate
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mix-blend-difference">
              Junior PM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                & Full Stack Developer
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-zinc-300 block mt-2">AI-Driven Solutions Specialist</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-xl leading-relaxed mix-blend-difference">
              Bridging the gap between project management and high-impact development with a focus on AI/ML and Agile coordination.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#work" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                View Work
              </a>
              <a href={githubUrl} target="_blank" rel="noreferrer" className="px-8 py-4 bg-zinc-900/50 backdrop-blur border border-zinc-700 rounded-full font-bold hover:bg-zinc-800 transition-colors">
                Github
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500">
            <ChevronDown size={32} />
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className="py-32 bg-zinc-950/80 backdrop-blur-sm border-t border-zinc-900">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-16 flex items-center gap-4">
              <span className="w-12 h-1 bg-indigo-500 rounded-full"></span>
              Flagship Projects
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECTS.map((project, idx) => (
                <div key={idx} className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:-translate-y-2 shadow-xl shadow-black/50">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                    <p className="text-zinc-400 mb-6 leading-relaxed text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((t, i) => (
                        <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] uppercase tracking-wider text-zinc-300 font-bold border border-zinc-700">{t}</span>
                      ))}
                    </div>
                    <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-indigo-400 transition-colors group/link">
                      View Repository <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-6 relative">
            <h2 className="text-4xl font-bold mb-16 text-right flex flex-row-reverse items-center gap-4">
              <span className="w-12 h-1 bg-purple-500 rounded-full"></span>
              Technical Arsenal
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {SKILLS.map((skill, idx) => (
                <div key={idx} className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors group">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-6">{skill.name}</h3>
                  <ul className="space-y-3">
                    {skill.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-400">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About / Profile Section */}
        <section id="about" className="py-32 bg-indigo-900/20 border-y border-indigo-500/10">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 mb-8 border border-indigo-500/20">
              <Bot size={16} />
              <span className="text-sm font-medium uppercase tracking-widest">Professional Profile</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Eager to contribute to <br/><span className="text-indigo-400">AI-driven product teams</span></h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Motivated and adaptable junior tech professional with hands-on experience in full-stack application development and agile project coordination. Certified in AI for Government (NEMISA) and Google/Kaggle 5-Day AI Agent Intensive. Skilled in managing deadlines and building solutions that enhance user experience.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <span className="block text-2xl font-bold text-indigo-400">PM</span>
                <span className="text-xs text-zinc-500 uppercase">Certified</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <span className="block text-2xl font-bold text-indigo-400">AI</span>
                <span className="text-xs text-zinc-500 uppercase">Intensive</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <span className="block text-2xl font-bold text-indigo-400">FNB</span>
                <span className="text-xs text-zinc-500 uppercase">Academy</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <span className="block text-2xl font-bold text-indigo-400">JHB</span>
                <span className="text-xs text-zinc-500 uppercase">Based</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
               
               <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
               <p className="text-zinc-400 mb-12 max-w-xl mx-auto">
                 I'm currently seeking junior roles in Project Management or Full Stack Development. Let's discuss how my skills in AI and Agile can benefit your team.
               </p>
               
               <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
                 <a href={`mailto:${email}`} className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                   <Mail size={18} /> {email}
                 </a>
                 <div className="flex items-center justify-center gap-3 px-8 py-4 bg-zinc-800 text-zinc-300 font-bold rounded-full">
                   <Phone size={18} /> {phone}
                 </div>
               </div>

               <div className="flex justify-center gap-8 border-t border-zinc-800 pt-12">
                 <a href={githubUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                   <Github size={24} />
                   <span className="text-xs">GitHub</span>
                 </a>
                 <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                   <Linkedin size={24} />
                   <span className="text-xs">LinkedIn</span>
                 </a>
               </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-zinc-600 text-sm bg-zinc-950">
          <p>© {new Date().getFullYear()} Kgotso Phiri. Johannesburg, South Africa.</p>
          <p className="mt-2 text-xs opacity-50 uppercase tracking-widest">Built with React, Three.js & Gemini AI</p>
        </footer>
      </main>

      {/* AI Chat Widget */}
      <ChatBot />
    </div>
  );
}

export default App;