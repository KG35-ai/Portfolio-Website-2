
import React, { useEffect, useState, useRef } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Code, Palette, Cpu, Bot, Phone, Sparkles, ShieldCheck, BarChart3, Globe, Award, CheckCircle2, Download, FileText, Check } from 'lucide-react';
import Scene from './components/Scene';
import ChatBot from './components/ChatBot';

const PROJECTS = [
  {
    title: "Agentic AI Task Orchestrator",
    description: "Intelligent autonomous multi-agent task routing system utilizing Gemini 3 Flash for automated workflow orchestration and real-time execution.",
    tech: ["Gemini 3 Flash", "Python", "Agentic AI", "Cloud Functions"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai"
  },
  {
    title: "Cloud & Developer Workflow Automation",
    description: "Scalable cloud-native deployment pipeline and API integration hub designed to streamline developer operations and modern CI/CD processes.",
    tech: ["GCP", "AWS", "TypeScript", "React"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai"
  },
  {
    title: "Interactive 3D Data Spatializer",
    description: "Immersive 3D visualization platform for mapping multidimensional datasets and complex agent workflows in real-time.",
    tech: ["Three.js", "React", "TypeScript", "WebGL"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai"
  }
];

const CERTIFICATES = [
  {
    title: "GenAI for Software Developers",
    issuer: "WeThinkCode",
    category: "Generative AI",
    icon: <Sparkles className="text-amber-400" size={22} />,
    badge: "Specialization"
  },
  {
    title: "AI Fluency",
    issuer: "Microsoft",
    category: "Artificial Intelligence",
    icon: <Cpu className="text-blue-400" size={22} />,
    badge: "Certified"
  },
  {
    title: "Building with AWS",
    issuer: "MongoDB",
    category: "Cloud Architecture",
    icon: <Globe className="text-emerald-400" size={22} />,
    badge: "AWS & NoSQL"
  },
  {
    title: "Agentic AI",
    issuer: "MongoDB",
    category: "Agentic Systems",
    icon: <Bot className="text-purple-400" size={22} />,
    badge: "Agentic Engineering"
  },
  {
    title: "Agentic AI",
    issuer: "Kaggle",
    category: "Agentic Systems",
    icon: <Award className="text-cyan-400" size={22} />,
    badge: "Intensive"
  },
  {
    title: "Full Stack Development",
    issuer: "FNB + IT Varsity",
    category: "Web & Software",
    icon: <Code className="text-indigo-400" size={22} />,
    badge: "App Academy"
  },
  {
    title: "Project Management",
    issuer: "Believers Care Society",
    category: "Agile Leadership",
    icon: <BarChart3 className="text-pink-400" size={22} />,
    badge: "Management"
  },
  {
    title: "Cloud Engineering",
    issuer: "GCP ACE Jam Series Attendee",
    category: "Google Cloud Platform",
    icon: <ShieldCheck className="text-sky-400" size={22} />,
    badge: "Cloud Jam"
  }
];

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

const FadeInView = ({ children, delay = 0 }: { children?: React.ReactNode, delay?: number, key?: React.Key }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [downloadNotification, setDownloadNotification] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const githubUrl = "https://github.com/KG35-ai";
  const linkedinUrl = "https://www.linkedin.com/in/kgotso-phiri-98aa21276";
  const email = "phirikg22@gmail.com";
  const phone = "065 968 1959";
  
  // Professional portrait profile image
  const profileImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=800";

  const handleDownloadResume = () => {
    setDownloadNotification(true);
    setTimeout(() => setDownloadNotification(false), 4000);

    const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KGOTSO GODFREY PHIRI - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; color: #111827; line-height: 1.5; margin: 0; padding: 40px; background: #ffffff; }
    .header { border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 24px; }
    .name { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; margin: 0 0 6px 0; color: #0f172a; }
    .title { font-size: 14px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .contact { font-size: 12px; color: #334155; display: flex; flex-wrap: wrap; gap: 16px; font-weight: 500; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; color: #0f172a; }
    .profile-text { font-size: 12px; color: #334155; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #f1f5f9; }
    th { font-weight: 700; background: #f8fafc; text-transform: uppercase; font-size: 10px; color: #64748b; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px; }
    ul { margin: 4px 0 12px 18px; padding: 0; font-size: 11px; color: #334155; }
    li { margin-bottom: 4px; }
    .project-item { margin-bottom: 14px; }
    .project-name { font-weight: 700; font-size: 12px; color: #0f172a; }
    .project-tech { font-size: 10px; color: #64748b; font-style: italic; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">KGOTSO GODFREY PHIRI</h1>
    <div class="title">Full-Stack Developer · AI & Cloud Junior · Technical Project Manager</div>
    <div class="contact">
      <span>📞 065 968 1959</span>
      <span>✉️ phirikg22@gmail.com</span>
      <span>📍 Johannesburg, Gauteng, South Africa</span>
      <span>🌐 github.com/KG35-ai</span>
    </div>
  </div>

  <div class="section-title">Professional Profile</div>
  <p class="profile-text">
    Driven junior developer and certified AI & cloud practitioner with hands-on expertise in full-stack application development, database engineering, and cloud-native AI solutions. Holder of 9 verified industry certifications from WeThinkCode_, FNB App Academy, MongoDB, AWS, NVIDIA, and Microsoft/NEMISA. Proven ability to build production-grade apps using modern stacks, integrate AI agents with NoSQL databases, and manage projects end-to-end using Agile methodologies.
  </p>

  <div class="section-title">Certifications & Credentials</div>
  <table>
    <thead>
      <tr>
        <th>Certification</th>
        <th>Issuing Body</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Google Cloud ACE — Scheduled</td><td>Google Cloud</td><td>Jul 8, 2026</td></tr>
      <tr><td>GenAI for Software Developers</td><td>WeThinkCode_</td><td>May 2026</td></tr>
      <tr><td>Certificate in Full Stack Development (32 Credits)</td><td>FNB App Academy / ITVarsity</td><td>Jul 2025</td></tr>
      <tr><td>Project Management — NQF Level 4 (84% Competent)</td><td>Believers Care Society / Service SETA</td><td>2025</td></tr>
      <tr><td>AI for Government - NSG</td><td>NEMISA / Microsoft</td><td>Dec 2025</td></tr>
      <tr><td>AI Agents with MongoDB</td><td>MongoDB University</td><td>Feb 2026</td></tr>
      <tr><td>Overview of Building AI Apps on AWS</td><td>MongoDB University</td><td>Feb 2026</td></tr>
      <tr><td>AWS Foundations: Cloud Essentials</td><td>Amazon Web Services</td><td>Feb 2026</td></tr>
      <tr><td>InfiniBand Essentials</td><td>NVIDIA Academy</td><td>Mar 2026</td></tr>
    </tbody>
  </table>

  <div class="section-title">Technical Skills</div>
  <div class="grid-2">
    <div>
      <strong>Languages & Frameworks:</strong>
      <ul>
        <li>HTML5 / CSS3 / JavaScript / TypeScript</li>
        <li>Flutter (Dart) / React</li>
        <li>REST API & Backend Development (Node.js)</li>
        <li>Python / Click</li>
      </ul>
      <strong>Databases & Cloud:</strong>
      <ul>
        <li>Google Cloud Run / Vertex AI</li>
        <li>Firestore / Firebase</li>
        <li>MongoDB (Atlas, Vector Search)</li>
        <li>AWS Cloud Essentials</li>
      </ul>
    </div>
    <div>
      <strong>AI & Emerging Tech:</strong>
      <ul>
        <li>AI Agent Development</li>
        <li>Google Gemini Live API</li>
        <li>Anthropic SDK (Claude API)</li>
        <li>RAG Pipelines & Function Calling</li>
      </ul>
      <strong>Tools & Leadership:</strong>
      <ul>
        <li>Git & GitHub, Figma / UI/UX Design</li>
        <li>Agile & Scrum, Linux / Termux</li>
        <li>Project Management NQF Level 4</li>
      </ul>
    </div>
  </div>

  <div class="section-title">Key Projects & Hackathons</div>
  <div class="project-item">
    <div class="project-name">ACE CLI — Agentic Terminal Tool</div>
    <div class="project-tech">Python, Click, Anthropic Claude API, Streaming Chat</div>
    <ul>
      <li>Built a CLI tool using Anthropic SDK with streaming chat and function calling for multi-turn agentic task orchestration.</li>
    </ul>
  </div>
  <div class="project-item">
    <div class="project-name">Diketo — AI Cultural Heritage Game Agent</div>
    <div class="project-tech">Google Gemini API, Firebase, Cloud Run</div>
    <ul>
      <li>Built an AI-powered agent to preserve and teach Diketo, a traditional South African game. Submitted to Gemini Live Agent Challenge.</li>
    </ul>
  </div>
  <div class="project-item">
    <div class="project-name">Morabaraba — AI Strategy Game</div>
    <div class="project-tech">Gemini API + Vertex AI</div>
    <ul>
      <li>Developed AI opponent for Morabaraba (traditional SA board game) as a portfolio centerpiece for African cultural tech innovation.</li>
    </ul>
  </div>

  <div class="section-title">Education & Experience</div>
  <ul>
    <li><strong>FNB App Academy — Full Stack Development</strong> (Jan – Jul 2025 | ITVarsity | 32 Credits)</li>
    <li><strong>Project Management NQF Level 4</strong> (Believers Care Society | 84% Competent)</li>
    <li><strong>Picker / Packer — Food Lovers Market</strong> (Jul 2024 – Present)</li>
  </ul>
</body>
</html>`;

    const blob = new Blob([resumeHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kgotso_Godfrey_Phiri_Resume.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen text-white bg-black selection:bg-indigo-500/50">
      <Scene />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/60 backdrop-blur-xl py-4 border-b border-white/10' : 'py-8 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-400 to-purple-400">
            KGOTSO.P
          </div>
          <div className="hidden md:flex gap-8 text-[10px] tracking-[0.2em] font-black text-zinc-400 uppercase">
            <a href="#work" className="hover:text-white transition-colors">Solutions</a>
            <a href="#skills" className="hover:text-white transition-colors">Stack</a>
            <a href="#certifications" className="hover:text-white transition-colors">Certifications</a>
            <a href="#about" className="hover:text-white transition-colors">Profile</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleDownloadResume} 
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 hover:border-indigo-500/50 rounded-full text-zinc-300 hover:text-white transition-all text-[11px] font-black uppercase tracking-wider group"
            >
              <Download size={13} className="text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
              <span>Resume</span>
            </button>
            <a href="#contact" className="relative group px-5 py-2 overflow-hidden rounded-full transition-all">
              <span className="absolute inset-0 bg-white group-hover:bg-indigo-400 transition-colors" />
              <span className="relative text-black text-[11px] font-black uppercase tracking-wider">Let's Talk</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col justify-center px-6 container mx-auto">
          <div className="max-w-5xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <Sparkles size={12} />
              Next-Gen Agentic AI & Web Solutions
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mix-blend-difference">
              AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                Agentic & Cloud Systems.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed mix-blend-difference font-light">
              Junior PM and Full Stack Developer specialized in building intelligent agentic systems, scalable cloud architectures, and immersive interactive web interfaces.
            </p>
            <div className="flex flex-wrap gap-6 pt-6">
              <a href="#work" className="px-10 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                View Solutions
              </a>
              <button onClick={handleDownloadResume} className="flex items-center gap-3 px-10 py-5 bg-indigo-600/20 backdrop-blur-xl border border-indigo-500/30 text-indigo-300 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/10">
                <Download size={16} /> Download Resume
              </button>
              <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-10 py-5 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all hover:border-white/20">
                <Github size={16} /> GitHub
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500 opacity-50">
            <ChevronDown size={32} />
          </div>
        </section>

        <section id="work" className="py-40 bg-zinc-950/40 backdrop-blur-sm border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-20">
              <div className="space-y-4">
                <span className="text-indigo-500 text-xs font-black tracking-[0.3em] uppercase">The Portfolio</span>
                <h2 className="text-5xl font-black tracking-tighter">Strategic Implementations</h2>
              </div>
              <p className="hidden md:block text-zinc-500 text-sm max-w-[240px] text-right font-medium">Enterprise-ready solutions leveraging the latest in Gemini AI, Cloud Architecture, and Web technologies.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {PROJECTS.map((project, idx) => (
                <FadeInView key={idx} delay={idx * 150}>
                  <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500 shadow-2xl">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-black mb-3 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                      <p className="text-zinc-400 mb-8 leading-relaxed text-sm font-medium h-16 overflow-hidden">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((t, i) => (
                          <span key={i} className="px-4 py-1.5 bg-zinc-800/50 rounded-full text-[9px] uppercase tracking-widest text-zinc-300 font-black border border-white/5">{t}</span>
                        ))}
                      </div>
                      <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:text-indigo-400 transition-all group/link">
                        Technical Specs <ExternalLink size={12} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="py-40 relative">
          <div className="container mx-auto px-6 relative">
            <h2 className="text-5xl font-black mb-24 text-center tracking-tighter">Technical Arsenal</h2>

            <div className="grid md:grid-cols-3 gap-12">
              {SKILLS.map((skill, idx) => (
                <FadeInView key={idx} delay={idx * 100}>
                  <div className="bg-gradient-to-b from-white/[0.03] to-transparent p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-xl shadow-black/40">
                      {skill.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-8 tracking-tight">{skill.name}</h3>
                    <ul className="space-y-4">
                      {skill.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className="py-40 bg-zinc-950/60 backdrop-blur-md border-y border-white/5 relative">
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <span className="text-indigo-400 text-xs font-black tracking-[0.3em] uppercase inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-400" />
                Verified Credentials
              </span>
              <h2 className="text-5xl font-black tracking-tighter">Certifications & Training</h2>
              <p className="text-zinc-400 text-base font-light">
                Continuous learning across Generative AI, Cloud Architecture, Full Stack Development, and Agile Leadership.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CERTIFICATES.map((cert, idx) => (
                <FadeInView key={idx} delay={idx * 80}>
                  <div className="h-full bg-zinc-900/50 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-zinc-800/70 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                          {cert.icon}
                        </div>
                        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-[9px] font-black uppercase tracking-wider">
                          {cert.badge}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 block mb-2">
                        {cert.category}
                      </span>
                      <h3 className="text-lg font-black text-zinc-100 group-hover:text-indigo-300 transition-colors mb-3 leading-snug">
                        {cert.title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                      <span className="text-xs font-bold text-zinc-400">
                        {cert.issuer}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-40 bg-white/5 backdrop-blur-md border-b border-white/5">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <FadeInView>
              <div className="flex flex-col items-center mb-16">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-zinc-900 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={profileImageUrl} 
                      alt="Kgotso Phiri" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full text-zinc-300 border border-white/10 shadow-inner">
                  <Bot size={16} className="text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Profile</span>
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-[0.9]">Empowering product teams with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">visionary engineering.</span></h2>
              <p className="text-xl md:text-2xl text-zinc-400 mb-16 leading-relaxed font-light">
                Adaptable tech professional with a foundation in FNB App Academy and specialized certifications in GenAI, Agentic AI, and Cloud Engineering. I bridge the gap between complex engineering and strategic management to deliver scalable software solutions.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "PM", val: "Certified" },
                  { label: "AI", val: "Agentic & GenAI" },
                  { label: "Full Stack", val: "FNB + IT Varsity" },
                  { label: "Loc", val: "Joburg" }
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-3xl group hover:border-indigo-500/30 transition-all">
                    <span className="block text-2xl font-black text-indigo-400 group-hover:scale-110 transition-transform">{stat.label}</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mt-1 block">{stat.val}</span>
                  </div>
                ))}
              </div>
            </FadeInView>
          </div>
        </section>

        <section id="contact" className="py-40">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
               
               <FadeInView>
                 <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter">Ready to Scale?</h2>
                 <p className="text-zinc-400 mb-16 max-w-2xl mx-auto text-lg md:text-xl font-medium">
                   Looking for a Junior PM or Full Stack Dev who understands the intersection of modern software engineering, cloud architecture, and Agentic AI? Let's discuss your next project.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 mb-20">
                   <a href={`mailto:${email}`} className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                     <Mail size={16} /> {email}
                   </a>
                   <button onClick={handleDownloadResume} className="flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-indigo-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] cursor-pointer">
                     <Download size={16} /> Download Resume
                   </button>
                   <div className="flex items-center justify-center gap-3 px-10 py-5 bg-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-widest rounded-full border border-white/5">
                     <Phone size={16} /> {phone}
                   </div>
                 </div>

                 <div className="flex justify-center gap-12 border-t border-white/5 pt-16">
                   <a href={githubUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 text-zinc-500 hover:text-white transition-all hover:-translate-y-1">
                     <Github size={28} />
                     <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
                   </a>
                   <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 text-zinc-500 hover:text-white transition-all hover:-translate-y-1">
                     <Linkedin size={28} />
                     <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                   </a>
                   <button onClick={handleDownloadResume} className="flex flex-col items-center gap-3 text-indigo-400 hover:text-white transition-all hover:-translate-y-1 cursor-pointer group">
                     <Download size={28} className="group-hover:scale-110 transition-transform" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Resume PDF</span>
                   </button>
                 </div>
               </FadeInView>
            </div>
          </div>
        </section>

        <footer className="py-12 text-center text-zinc-600 bg-black border-t border-white/5">
          <div className="container mx-auto px-6">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase">© {new Date().getFullYear()} Kgotso Phiri / JHB / South Africa</p>
            <div className="mt-6 flex justify-center gap-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
              <span>React 19</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full my-auto" />
              <span>Three.js</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full my-auto" />
              <span>Gemini AI</span>
            </div>
          </div>
        </footer>
      </main>
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${downloadNotification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold text-xs shadow-2xl border border-indigo-400/30">
          <Check size={16} /> Official Resume Download Started!
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

export default App;

