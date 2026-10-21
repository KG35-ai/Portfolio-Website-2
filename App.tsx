import React, { useEffect, useState, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronDown, 
  Code, 
  Palette, 
  Cpu, 
  Bot, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Globe, 
  Award, 
  CheckCircle2, 
  Download, 
  FileText, 
  Check, 
  Play, 
  Plus, 
  Layers, 
  Cloud, 
  Server, 
  Database, 
  Terminal, 
  Activity,
  Briefcase,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  BookOpen
} from 'lucide-react';
import Scene from './components/Scene';
import ChatBot from './components/ChatBot';
import EmbeddedAppModal from './components/EmbeddedAppModal';
import AddAppModal, { ProjectApp } from './components/AddAppModal';

const DEFAULT_PROJECTS: ProjectApp[] = [
  {
    id: "1",
    title: "ACE CLI — Agentic Terminal Tool",
    description: "Built a Python/Click CLI tool using the Anthropic SDK with streaming chat and function calling (tool use). Demonstrates multi-turn agentic conversation and tool orchestration in a terminal environment.",
    tech: ["Python", "Click", "Anthropic Claude API", "Streaming", "Tool Use"],
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai",
    embedUrl: "https://ais-dev-z2mi2hvqcs6kmhnzqaqnwj-47576549360.europe-west1.run.app",
    isAiStudio: true
  },
  {
    id: "2",
    title: "Diketo — AI Cultural Heritage Game Agent",
    description: "Built an AI-powered agent to preserve and teach Diketo, a traditional South African game. Submitted to the Gemini Live Agent Challenge on Devpost as part of an African cultural heritage gaming portfolio.",
    tech: ["Google Gemini API", "Firebase", "Cloud Run", "AI Studio"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai",
    embedUrl: "https://ais-pre-z2mi2hvqcs6kmhnzqaqnwj-47576549360.europe-west1.run.app",
    isAiStudio: true
  },
  {
    id: "3",
    title: "Morabaraba — AI Strategy Game",
    description: "Developed an AI opponent for Morabaraba (traditional South African board game) using Gemini + Vertex AI. Positioned as a portfolio centerpiece for African cultural tech innovation for Devpost Hackathon.",
    tech: ["Gemini API", "Vertex AI", "Python", "Cloud Run"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai",
    embedUrl: "https://ais-dev-z2mi2hvqcs6kmhnzqaqnwj-47576549360.europe-west1.run.app",
    isAiStudio: true
  },
  {
    id: "4",
    title: "Courtroom AI — Legal Reasoning Tool",
    description: "AI-assisted legal reasoning tool built on Google Cloud (Vertex AI, Firestore) for accessible legal guidance in underserved South African communities. Kaggle Competition 2026 entry.",
    tech: ["Google Cloud", "Vertex AI", "Firestore", "Python", "Kaggle"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai",
    embedUrl: "https://ais-dev-z2mi2hvqcs6kmhnzqaqnwj-47576549360.europe-west1.run.app",
    isAiStudio: true
  },
  {
    id: "5",
    title: "Cloud & Developer Workflow Automation",
    description: "Scalable cloud-native deployment pipeline and API integration hub designed to streamline developer operations, containerized services, and modern CI/CD processes.",
    tech: ["GCP", "Cloud Run", "AWS", "TypeScript", "React"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/KG35-ai",
    embedUrl: "https://ais-dev-z2mi2hvqcs6kmhnzqaqnwj-47576549360.europe-west1.run.app",
    isAiStudio: true
  }
];

const CERTIFICATES = [
  {
    title: "Google Cloud ACE — Scheduled",
    issuer: "Google Cloud",
    date: "Jul 8, 2026",
    category: "Google Cloud Platform",
    icon: <ShieldCheck className="text-sky-400" size={22} />,
    badge: "Cloud Jam Attendee"
  },
  {
    title: "GenAI for Software Developers",
    issuer: "WeThinkCode_",
    date: "May 2026",
    category: "Generative AI",
    icon: <Sparkles className="text-amber-400" size={22} />,
    badge: "Specialization"
  },
  {
    title: "Certificate in Full Stack Development",
    issuer: "FNB App Academy / ITVarsity",
    date: "Jul 2025",
    category: "Web & Software",
    icon: <Code className="text-indigo-400" size={22} />,
    badge: "32 Credits"
  },
  {
    title: "Project Management — NQF Level 4",
    issuer: "Believers Care Society / Service SETA",
    date: "2025",
    category: "Agile Leadership",
    icon: <BarChart3 className="text-pink-400" size={22} />,
    badge: "84% Competent (Accred: 6469)"
  },
  {
    title: "AI for Government - NSG",
    issuer: "NEMISA / Microsoft",
    date: "Dec 2025",
    category: "Public Sector AI",
    icon: <Building2 className="text-blue-400" size={22} />,
    badge: "NSG Certified"
  },
  {
    title: "AI Agents with MongoDB",
    issuer: "MongoDB University",
    date: "Feb 2026",
    category: "Agentic Systems",
    icon: <Bot className="text-emerald-400" size={22} />,
    badge: "Agentic NoSQL"
  },
  {
    title: "Overview of Building AI Apps on AWS",
    issuer: "MongoDB University",
    date: "Feb 2026",
    category: "Cloud Architecture",
    icon: <Cloud className="text-cyan-400" size={22} />,
    badge: "AWS & AI"
  },
  {
    title: "AWS Foundations: Cloud Essentials",
    issuer: "Amazon Web Services",
    date: "Feb 2026",
    category: "Cloud Essentials",
    icon: <Server className="text-orange-400" size={22} />,
    badge: "AWS Certified"
  },
  {
    title: "InfiniBand Essentials",
    issuer: "NVIDIA Academy",
    date: "Mar 2026",
    category: "HPC & Networking",
    icon: <Activity className="text-green-400" size={22} />,
    badge: "NVIDIA Academy"
  },
  {
    title: "GitHub Copilot, Responsible AI & Git",
    issuer: "Microsoft Learn",
    date: "Sep–Oct 2026",
    category: "AI Dev Tools",
    icon: <Award className="text-purple-400" size={22} />,
    badge: "4 Badges"
  },
  {
    title: "2026 AI Academy — AI Specialist for Business Growth",
    issuer: "ITVarsity",
    date: "Oct 2026",
    category: "Business AI Strategy",
    icon: <Cpu className="text-teal-400" size={22} />,
    badge: "AI Specialist"
  }
];

const SKILL_CATEGORIES = [
  { 
    name: "Languages & Frameworks", 
    icon: <Code size={22} />, 
    color: "text-indigo-400",
    border: "group-hover:border-indigo-500/40",
    items: [
      "HTML5 / CSS3 / JavaScript",
      "Flutter (Dart)",
      "REST API Development",
      "Backend Development (Node.js)",
      "Python / Click"
    ] 
  },
  { 
    name: "Databases & Cloud", 
    icon: <Cloud size={22} />, 
    color: "text-sky-400",
    border: "group-hover:border-sky-500/40",
    items: [
      "Google Cloud Run / Vertex AI",
      "Firestore / Firebase",
      "MongoDB (Atlas, Vector Search)",
      "AWS Cloud Essentials",
      "AI Agents with MongoDB"
    ] 
  },
  { 
    name: "AI & Emerging Tech", 
    icon: <Bot size={22} />, 
    color: "text-purple-400",
    border: "group-hover:border-purple-500/40",
    items: [
      "AI Agent Development",
      "Google Gemini Live API",
      "Anthropic SDK (Claude API)",
      "RAG Pipelines & Tool Use",
      "InfiniBand / HPC Networking"
    ] 
  },
  { 
    name: "Tools & Practices", 
    icon: <Terminal size={22} />, 
    color: "text-emerald-400",
    border: "group-hover:border-emerald-500/40",
    items: [
      "Git & GitHub",
      "Figma / UI/UX Design",
      "Agile & Scrum",
      "Linux / Termux",
      "CI/CD (Cloud Build basics)"
    ] 
  },
  { 
    name: "Product & Leadership", 
    icon: <BarChart3 size={22} />, 
    color: "text-pink-400",
    border: "group-hover:border-pink-500/40",
    items: [
      "Project Management (NQF L4)",
      "Design Thinking",
      "User-Centric App Development",
      "Data Management & Analysis",
      "App Monetisation Strategy"
    ] 
  },
  { 
    name: "Soft Skills & Delivery", 
    icon: <Sparkles size={22} />, 
    color: "text-amber-400",
    border: "group-hover:border-amber-500/40",
    items: [
      "Cross-functional Collaboration",
      "Complex Problem Solving",
      "Fast Learner / Self-Driven",
      "Stakeholder Communication",
      "Production-Grade Rigor"
    ] 
  }
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

  const [projectsList, setProjectsList] = useState<ProjectApp[]>(() => {
    const saved = localStorage.getItem('kgotso_portfolio_projects_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROJECTS;
  });

  const [selectedAppForEmbed, setSelectedAppForEmbed] = useState<{
    title: string;
    url: string;
    description?: string;
    tech?: string[];
  } | null>(null);

  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);

  const handleAddNewProject = (newProj: ProjectApp) => {
    const updated = [newProj, ...projectsList];
    setProjectsList(updated);
    localStorage.setItem('kgotso_portfolio_projects_v2', JSON.stringify(updated));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const githubUrl = "https://github.com/KG35-ai";
  const linkedinUrl = "https://www.linkedin.com/in/kgotso-phiri-98aa21276";
  const email = "phirikg22@gmail.com";
  const phone = "065 968 1959";
  const location = "Johannesburg, Gauteng, South Africa";
  
  // User profile photo
  const profileImageUrl = "/profile.jpg";

  const handleDownloadResume = () => {
    setDownloadNotification(true);
    setTimeout(() => setDownloadNotification(false), 4000);

    const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KGOTSO GODFREY PHIRI - Official Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      color: #1e293b; 
      line-height: 1.45; 
      margin: 0; 
      padding: 0; 
      background: #f8fafc; 
    }
    .page-container {
      max-width: 850px;
      margin: 20px auto;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: #0e7490;
      color: #ffffff;
      padding: 32px 36px 28px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 1.5px;
      margin: 0 0 6px 0;
      text-transform: uppercase;
    }
    .header .subtitle {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #e0f2fe;
      margin-bottom: 14px;
    }
    .header .contact-bar {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 11px;
      font-weight: 500;
      color: #bae6fd;
    }
    .header .contact-bar a {
      color: #ffffff;
      text-decoration: none;
    }
    .content {
      padding: 30px 36px 36px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #0e7490;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 22px;
      margin-bottom: 12px;
    }
    .profile-p {
      font-size: 11.5px;
      color: #334155;
      line-height: 1.6;
      margin: 0 0 14px;
    }
    table.cert-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      margin-bottom: 16px;
    }
    table.cert-table th {
      text-align: left;
      background: #f1f5f9;
      padding: 6px 10px;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      font-size: 9.5px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #cbd5e1;
    }
    table.cert-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
    }
    table.cert-table tr:nth-child(even) td {
      background: #f8fafc;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 16px;
    }
    .skill-col h4 {
      margin: 0 0 6px 0;
      font-size: 10.5px;
      font-weight: 800;
      color: #0e7490;
      text-transform: uppercase;
    }
    .skill-col ul {
      margin: 0;
      padding-left: 14px;
      font-size: 10px;
      color: #334155;
      line-height: 1.5;
    }
    .project-entry {
      margin-bottom: 14px;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .project-title {
      font-weight: 800;
      font-size: 11.5px;
      color: #0f172a;
    }
    .project-date {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
    }
    .project-stack {
      font-size: 10px;
      color: #0e7490;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .project-bullets {
      margin: 0;
      padding-left: 16px;
      font-size: 10.5px;
      color: #334155;
      line-height: 1.45;
    }
    .edu-entry {
      margin-bottom: 12px;
    }
    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .edu-title {
      font-weight: 800;
      font-size: 11.5px;
      color: #0f172a;
    }
    .edu-sub {
      font-size: 10px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 4px;
    }
    .footer-note {
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      margin-top: 20px;
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
    }
    @media print {
      body { background: #ffffff; }
      .page-container { box-shadow: none; margin: 0; max-width: 100%; }
      .header { padding: 20px 24px 16px; }
      .content { padding: 20px 24px; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header">
      <h1>KGOTSO GODFREY PHIRI</h1>
      <div class="subtitle">Full-Stack Developer · AI & Cloud Junior · Technical Project Manager</div>
      <div class="contact-bar">
        <span>✆ 065 968 1959</span>
        <span>✉ phirikg22@gmail.com</span>
        <span>■ Johannesburg, Gauteng, South Africa</span>
        <span>🌐 <a href="https://github.com/KG35-ai" target="_blank">github.com/KG35-ai</a></span>
      </div>
    </div>

    <div class="content">
      <div class="section-title">PROFESSIONAL PROFILE</div>
      <p class="profile-p">
        Driven junior developer and certified AI & cloud practitioner with hands-on expertise in full-stack application development, database engineering, and cloud-native AI solutions. Holder of 9+ verified industry certifications from WeThinkCode_, FNB App Academy, MongoDB, AWS, NVIDIA, and Microsoft/NEMISA. Proven ability to build production-grade apps using modern stacks, integrate AI agents with NoSQL databases, and manage projects end-to-end using Agile methodologies. Eager to contribute to high-impact engineering teams in fintech, cloud, or AI-driven product environments.
      </p>

      <div class="section-title">CERTIFICATIONS & CREDENTIALS</div>
      <table class="cert-table">
        <thead>
          <tr>
            <th>Certification</th>
            <th>Issuing Body</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Google Cloud ACE — Scheduled</strong></td>
            <td>Google Cloud</td>
            <td>Jul 8, 2026</td>
          </tr>
          <tr>
            <td><strong>GenAI for Software Developers</strong></td>
            <td>WeThinkCode_</td>
            <td>May 2026</td>
          </tr>
          <tr>
            <td><strong>Certificate in Full Stack Development (32 Credits)</strong></td>
            <td>FNB App Academy / ITVarsity</td>
            <td>Jul 2025</td>
          </tr>
          <tr>
            <td><strong>Project Management — NQF Level 4 (84% Competent)</strong></td>
            <td>Believers Care Society / Service SETA</td>
            <td>2025</td>
          </tr>
          <tr>
            <td><strong>AI for Government - NSG</strong></td>
            <td>NEMISA / Microsoft</td>
            <td>Dec 2025</td>
          </tr>
          <tr>
            <td><strong>AI Agents with MongoDB</strong></td>
            <td>MongoDB University</td>
            <td>Feb 2026</td>
          </tr>
          <tr>
            <td><strong>Overview of Building AI Apps on AWS</strong></td>
            <td>MongoDB University</td>
            <td>Feb 2026</td>
          </tr>
          <tr>
            <td><strong>AWS Foundations: Cloud Essentials</strong></td>
            <td>Amazon Web Services</td>
            <td>Feb 2026</td>
          </tr>
          <tr>
            <td><strong>InfiniBand Essentials</strong></td>
            <td>NVIDIA Academy</td>
            <td>Mar 2026</td>
          </tr>
          <tr>
            <td><strong>GitHub Copilot, Responsible AI & Git (4 badges)</strong></td>
            <td>Microsoft Learn</td>
            <td>Sep–Oct 2026</td>
          </tr>
          <tr>
            <td><strong>2026 AI Academy — AI Specialist for Business Growth</strong></td>
            <td>ITVarsity</td>
            <td>Oct 2026</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">TECHNICAL SKILLS</div>
      <div class="skills-grid">
        <div class="skill-col">
          <h4>Languages & Frameworks</h4>
          <ul>
            <li>HTML5 / CSS3 / JavaScript</li>
            <li>Flutter (Dart)</li>
            <li>REST API Development</li>
            <li>Backend Development (Node.js)</li>
            <li>Python / Click</li>
          </ul>
        </div>
        <div class="skill-col">
          <h4>Databases & Cloud</h4>
          <ul>
            <li>Google Cloud Run / Vertex AI</li>
            <li>Firestore / Firebase</li>
            <li>MongoDB (Atlas, Vector Search)</li>
            <li>AWS Cloud Essentials</li>
            <li>AI Agents with MongoDB</li>
          </ul>
        </div>
        <div class="skill-col">
          <h4>AI & Emerging Tech</h4>
          <ul>
            <li>AI Agent Development</li>
            <li>Google Gemini Live API</li>
            <li>Anthropic SDK (Claude API)</li>
            <li>RAG Pipelines & Tool Use</li>
            <li>InfiniBand / HPC Networking</li>
          </ul>
        </div>
        <div class="skill-col">
          <h4>Tools & Practices</h4>
          <ul>
            <li>Git & GitHub</li>
            <li>Figma / UI/UX Design</li>
            <li>Agile & Scrum</li>
            <li>Linux / Termux</li>
            <li>CI/CD (Cloud Build basics)</li>
          </ul>
        </div>
        <div class="skill-col">
          <h4>Product & Project</h4>
          <ul>
            <li>Project Management (NQF L4)</li>
            <li>Design Thinking</li>
            <li>User-Centric App Development</li>
            <li>Data Management & Analysis</li>
            <li>App Monetisation Strategy</li>
          </ul>
        </div>
        <div class="skill-col">
          <h4>Soft Skills</h4>
          <ul>
            <li>Cross-functional Collaboration</li>
            <li>Problem Solving</li>
            <li>Fast Learner / Self-Driven</li>
          </ul>
        </div>
      </div>

      <div class="section-title">KEY PROJECTS & HACKATHONS</div>
      <div class="project-entry">
        <div class="project-header">
          <span class="project-title">ACE CLI — Agentic Terminal Tool</span>
          <span class="project-date">2026</span>
        </div>
        <div class="project-stack">Python, Click, Anthropic Claude API, streaming responses</div>
        <ul class="project-bullets">
          <li>Built a Python/Click CLI tool using the Anthropic SDK with streaming chat and function calling (tool use).</li>
          <li>Demonstrates multi-turn agentic conversation and tool orchestration in a terminal environment.</li>
        </ul>
      </div>

      <div class="project-entry">
        <div class="project-header">
          <span class="project-title">Diketo — AI Cultural Heritage Game Agent | Gemini Live Agent Challenge</span>
          <span class="project-date">2025–2026</span>
        </div>
        <div class="project-stack">Google Gemini API, Firebase, Cloud Run — deployed via Google AI Studio</div>
        <ul class="project-bullets">
          <li>Built an AI-powered agent to preserve and teach Diketo, a traditional South African game.</li>
          <li>Submitted to Devpost as part of African cultural heritage gaming portfolio.</li>
        </ul>
      </div>

      <div class="project-entry">
        <div class="project-header">
          <span class="project-title">Morabaraba — AI Strategy Game | Devpost Hackathon</span>
          <span class="project-date">2025–2026</span>
        </div>
        <div class="project-stack">Gemini API + Vertex AI</div>
        <ul class="project-bullets">
          <li>Developed AI opponent for Morabaraba (traditional SA board game) using Gemini + Vertex AI.</li>
          <li>Positioned as a portfolio centerpiece for African cultural tech innovation.</li>
        </ul>
      </div>

      <div class="project-entry">
        <div class="project-header">
          <span class="project-title">Courtroom AI | Kaggle Competition</span>
          <span class="project-date">2026</span>
        </div>
        <div class="project-stack">Google Cloud (Vertex AI, Firestore)</div>
        <ul class="project-bullets">
          <li>AI-assisted legal reasoning tool built on Google Cloud (Vertex AI, Firestore).</li>
          <li>Designed for accessible legal guidance in underserved South African communities.</li>
        </ul>
      </div>

      <div class="section-title">EDUCATION & TRAINING</div>
      <div class="edu-entry">
        <div class="edu-header">
          <span class="edu-title">FNB App Academy — Full Stack Development</span>
          <span class="project-date">Jan–Jul 2025</span>
        </div>
        <div class="edu-sub">ITVarsity | 32 Credits</div>
        <ul class="project-bullets">
          <li>Core modules: App Strategies, GitHub & Collaboration, SDLC (Build an App with HTML), UX Design Principles, Layouts & Transitions, Design Thinking, APIs, Data Input & Processing, User-Centric App Development, Backend Development (Intro + Build an API), Data Management & Analysis, AI in Development, Business Funding & Marketing your App Business.</li>
        </ul>
      </div>

      <div class="edu-entry">
        <div class="edu-header">
          <span class="edu-title">Project Management — NQF Level 4</span>
          <span class="project-date">2025</span>
        </div>
        <div class="edu-sub">Believers Care Society / Service SETA (Accred: 6469) · Overall Result: 84% Competent</div>
        <ul class="project-bullets">
          <li>Core units: Project planning, scheduling, stakeholder management, risk management. Final Integrated Summative Assessment: Competent (84%).</li>
        </ul>
      </div>

      <div class="section-title">WORK EXPERIENCE</div>
      <div class="edu-entry">
        <div class="edu-header">
          <span class="edu-title">Picker / Packer — Food Lovers Market</span>
          <span class="project-date">Jul 2024 – Present</span>
        </div>
        <ul class="project-bullets">
          <li>Maintained high productivity and accuracy in a fast-paced fulfilment environment.</li>
          <li>Operated inventory & barcode systems; conducted quality checks and reported discrepancies.</li>
          <li>Collaborated with cross-functional teams to meet daily order fulfilment and dispatch deadlines.</li>
        </ul>
      </div>

      <div class="footer-note">
        Certificate verification IDs available on request · Open to full-time, contract & remote opportunities
      </div>
    </div>
  </div>
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

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/75 backdrop-blur-xl py-4 border-b border-white/10' : 'py-7 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              KP
            </span>
            <div className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-300 to-sky-400">
              KGOTSO.P
            </div>
          </a>

          <div className="hidden lg:flex gap-7 text-[10px] tracking-[0.2em] font-black text-zinc-400 uppercase">
            <a href="#work" className="hover:text-white transition-colors">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors">Stack</a>
            <a href="#certifications" className="hover:text-white transition-colors">Certifications</a>
            <a href="#education-experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#about" className="hover:text-white transition-colors">Profile</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadResume} 
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 hover:border-sky-500/50 rounded-full text-zinc-300 hover:text-white transition-all text-[11px] font-black uppercase tracking-wider group cursor-pointer shadow-md"
              title="Download official resume HTML / PDF"
            >
              <Download size={13} className="text-sky-400 group-hover:translate-y-0.5 transition-transform" />
              <span>Resume</span>
            </button>
            <a href="#contact" className="relative group px-5 py-2 overflow-hidden rounded-full transition-all">
              <span className="absolute inset-0 bg-white group-hover:bg-sky-400 transition-colors" />
              <span className="relative text-black text-[11px] font-black uppercase tracking-wider">Let's Talk</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center px-6 container mx-auto pt-28 pb-16">
          <div className="max-w-5xl space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-sky-500/10 border border-sky-400/25 rounded-full text-sky-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <Cloud size={14} className="text-sky-400 animate-pulse" />
              <span>Full-Stack Developer · AI & Cloud Junior · Technical PM</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.92] mix-blend-difference">
              Cloud Engineering & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-400 via-indigo-400 to-cyan-300">
                Scalable Systems.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl leading-relaxed mix-blend-difference font-light">
              Holder of 9+ verified industry certifications across Google Cloud (GCP ACE Series), WeThinkCode_, FNB App Academy, MongoDB, AWS, NVIDIA, and Microsoft. Building production-grade apps, agentic orchestrators, and cloud microservices.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#work" className="px-8 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Explore Projects
              </a>
              <button onClick={handleDownloadResume} className="flex items-center gap-2.5 px-8 py-4 bg-sky-600/20 backdrop-blur-xl border border-sky-500/30 text-sky-300 rounded-full font-black text-xs uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/10 cursor-pointer">
                <Download size={15} /> Download Resume
              </button>
              <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-8 py-4 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all hover:border-white/20">
                <Github size={15} /> GitHub Repos
              </a>
            </div>

            {/* Cloud Architecture Pillars / Highlights strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-sky-500/30 transition-all group">
                <div className="flex items-center gap-2 text-sky-400 mb-1.5">
                  <Cloud size={16} />
                  <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">Platform</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">Google Cloud (GCP)</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Cloud Run · Vertex AI · ACE Jam</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                  <Bot size={16} />
                  <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">Agentic AI</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Multi-Agent Systems</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Gemini Live · Claude API · Tools</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-all group">
                <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
                  <Database size={16} />
                  <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">Data Tier</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Cloud Data & Vector</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Firestore · Atlas · Vector Search</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="flex items-center gap-2 text-purple-400 mb-1.5">
                  <BarChart3 size={16} />
                  <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">Leadership</span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Technical PM</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">NQF L4 (84%) · Agile & Scrum</div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500 opacity-50">
            <ChevronDown size={28} />
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="work" className="py-40 bg-zinc-950/40 backdrop-blur-sm border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div className="space-y-4 max-w-2xl">
                <span className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-[10px] font-black tracking-[0.2em] uppercase inline-flex items-center gap-2">
                  <Sparkles size={12} /> Key Projects & Hackathons
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Strategic Implementations</h2>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                  Production-grade apps, hackathon centerpieces, and autonomous agent systems. Interactive sandboxed builds can be previewed live directly below.
                </p>
              </div>
              <button
                onClick={() => setIsAddAppModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/25 shrink-0 cursor-pointer"
              >
                <Plus size={16} /> Integrate AI Studio App
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projectsList.map((project, idx) => (
                <FadeInView key={project.id || idx} delay={idx * 120}>
                  <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-sky-500/40 transition-all duration-500 shadow-2xl flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden relative group/img">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover/img:opacity-60 transition-opacity" />
                      
                      {project.isAiStudio && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-sky-600/90 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                          <Sparkles size={11} /> AI Studio App
                        </div>
                      )}

                      {/* Hover overlay launch trigger */}
                      <button
                        onClick={() => setSelectedAppForEmbed({
                          title: project.title,
                          url: project.embedUrl || project.link,
                          description: project.description,
                          tech: project.tech
                        })}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer group/btn"
                      >
                        <div className="px-5 py-2.5 bg-sky-600 group-hover/btn:bg-sky-500 text-white rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl group-hover/btn:scale-110 transition-all">
                          <Play size={14} className="fill-white" /> Launch Live App
                        </div>
                      </button>
                    </div>

                    <div className="p-8 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-2xl font-black mb-3 group-hover:text-sky-400 transition-colors">{project.title}</h3>
                        <p className="text-zinc-400 mb-6 leading-relaxed text-sm font-medium line-clamp-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tech.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-zinc-800/80 rounded-full text-[9px] uppercase tracking-widest text-zinc-300 font-black border border-white/5">{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <button
                          onClick={() => setSelectedAppForEmbed({
                            title: project.title,
                            url: project.embedUrl || project.link,
                            description: project.description,
                            tech: project.tech
                          })}
                          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-sky-400 hover:text-sky-300 transition-colors group/launch cursor-pointer"
                        >
                          <Play size={12} className="fill-sky-400 group-hover/launch:scale-125 transition-transform" />
                          <span>Launch Embed</span>
                        </button>

                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all group/link"
                        >
                          Specs <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNICAL ARSENAL SECTION */}
        <section id="skills" className="py-40 relative">
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <span className="text-sky-400 text-xs font-black tracking-[0.3em] uppercase inline-flex items-center gap-2">
                <Code size={14} className="text-sky-400" />
                Technical Skills & Tools
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Technical Arsenal</h2>
              <p className="text-zinc-400 text-base font-light">
                Comprehensive stack covering Full-Stack development, Cloud native architectures, multi-agent LLM systems, and Agile product governance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <FadeInView key={idx} delay={idx * 90}>
                  <div className={`bg-gradient-to-b from-white/[0.04] to-zinc-950/60 p-8 rounded-[2rem] border border-white/10 ${cat.border} transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform border border-white/5 shadow-inner`}>
                          {cat.icon}
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-white group-hover:text-zinc-100">{cat.name}</h3>
                      </div>
                      <ul className="space-y-3">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm font-medium group-hover:text-zinc-300 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS & CREDENTIALS SECTION */}
        <section id="certifications" className="py-40 bg-zinc-950/60 backdrop-blur-md border-y border-white/5 relative">
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <span className="text-sky-400 text-xs font-black tracking-[0.3em] uppercase inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-sky-400" />
                Verified Credentials
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Certifications & Credentials</h2>
              <p className="text-zinc-400 text-base font-light">
                11 verified industry credentials from leading tech organizations including Google Cloud, WeThinkCode_, FNB App Academy, MongoDB, AWS, NVIDIA, and Microsoft.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {CERTIFICATES.map((cert, idx) => (
                <FadeInView key={idx} delay={idx * 60}>
                  <div className="h-full bg-zinc-900/50 backdrop-blur-md border border-white/5 hover:border-sky-500/30 rounded-3xl p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 bg-zinc-800/70 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                          {cert.icon}
                        </div>
                        <span className="px-3 py-1 bg-sky-500/10 border border-sky-400/20 text-sky-300 rounded-full text-[9px] font-black uppercase tracking-wider">
                          {cert.badge}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 block mb-1">
                        {cert.category}
                      </span>
                      <h3 className="text-base font-black text-zinc-100 group-hover:text-sky-300 transition-colors mb-2 leading-snug">
                        {cert.title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                      <div>
                        <span className="text-xs font-bold text-zinc-300 block">
                          {cert.issuer}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-semibold block">
                          {cert.date}
                        </span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION & WORK EXPERIENCE SECTION */}
        <section id="education-experience" className="py-40 relative">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <span className="text-sky-400 text-xs font-black tracking-[0.3em] uppercase inline-flex items-center gap-2">
                <GraduationCap size={14} className="text-sky-400" />
                Career & Academic Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Education & Experience</h2>
              <p className="text-zinc-400 text-base font-light">
                Accredited training programs, university-level coursework, and hands-on operational work experience.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {/* Education Column */}
              <FadeInView delay={100}>
                <div className="bg-gradient-to-b from-white/[0.04] to-zinc-950/60 p-8 md:p-10 rounded-[2.5rem] border border-white/10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black">Education & Training</h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Accredited Programs</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Entry 1: FNB App Academy */}
                      <div className="relative pl-6 border-l-2 border-indigo-500/40">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                          <h4 className="text-lg font-black text-white">FNB App Academy — Full Stack Development</h4>
                          <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold">Jan – Jul 2025</span>
                        </div>
                        <p className="text-xs font-bold text-indigo-400 mb-3">ITVarsity · 32 Credits Accredited</p>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                          Intensive software engineering curriculum covering end-to-end full stack development, mobile app delivery, and product launch mechanics.
                        </p>
                        <div className="space-y-1.5 text-xs text-zinc-300">
                          <div className="font-bold text-[11px] text-zinc-400 uppercase tracking-wider">Key Modules Completed:</div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {[
                              "App Strategies & SDLC",
                              "UX Design & Layouts",
                              "Design Thinking",
                              "APIs & Data Input",
                              "User-Centric App Dev",
                              "Backend Development",
                              "Data Management",
                              "AI in Development",
                              "Business Funding & Marketing"
                            ].map((mod, i) => (
                              <span key={i} className="px-2.5 py-1 bg-zinc-800/60 rounded-md text-[10px] text-zinc-300 border border-white/5">{mod}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Entry 2: Believers Care Society */}
                      <div className="relative pl-6 border-l-2 border-pink-500/40">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                          <h4 className="text-lg font-black text-white">Project Management — NQF Level 4</h4>
                          <span className="px-2.5 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded-full text-[10px] font-bold">2025</span>
                        </div>
                        <p className="text-xs font-bold text-pink-400 mb-3">Believers Care Society / Service SETA (Accred: 6469) · Overall Result: 84% Competent</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          3-month accredited programme covering project planning, scheduling, stakeholder management, risk mitigation, and final integrated summative assessment (84% Competent).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInView>

              {/* Work Experience Column */}
              <FadeInView delay={200}>
                <div className="bg-gradient-to-b from-white/[0.04] to-zinc-950/60 p-8 md:p-10 rounded-[2.5rem] border border-white/10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black">Work Experience</h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Professional History</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="relative pl-6 border-l-2 border-emerald-500/40">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                          <h4 className="text-lg font-black text-white">Picker / Packer</h4>
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold">Jul 2024 – Present</span>
                        </div>
                        <p className="text-xs font-bold text-emerald-400 mb-4">Food Lovers Market · Johannesburg, South Africa</p>
                        
                        <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                          <li className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span>Maintained high productivity and accuracy in a fast-paced fulfilment environment.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span>Operated inventory and barcode scanning systems; conducted quality checks and reported discrepancies.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span>Collaborated with cross-functional teams to meet daily order fulfilment and dispatch deadlines.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 bg-zinc-900/40 p-4 rounded-2xl border">
                    <p className="text-[11px] text-zinc-400 font-medium">
                      <span className="text-white font-bold">Verification Note:</span> Certificate verification IDs available on request. Open to full-time, contract & remote opportunities.
                    </p>
                  </div>
                </div>
              </FadeInView>
            </div>
          </div>
        </section>

        {/* PROFILE SECTION */}
        <section id="about" className="py-40 bg-white/5 backdrop-blur-md border-b border-white/5">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <FadeInView>
              <div className="flex flex-col items-center mb-16">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-zinc-900 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={profileImageUrl} 
                      alt="Kgotso Godfrey Phiri" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full text-zinc-300 border border-white/10 shadow-inner">
                  <Bot size={16} className="text-sky-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Professional Profile</span>
                </div>
              </div>

              <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter leading-[0.95]">
                Empowering high-impact engineering teams with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 italic">scalable solutions.</span>
              </h2>
              <p className="text-lg md:text-xl text-zinc-300 mb-16 leading-relaxed font-light max-w-4xl mx-auto">
                Driven junior developer and certified AI & cloud practitioner with hands-on expertise in full-stack application development, database engineering, and cloud-native AI solutions. Proven ability to build production-grade apps using modern stacks, integrate AI agents with NoSQL databases, and manage projects end-to-end using Agile methodologies.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "11+", val: "Verified Certifications" },
                  { label: "32", val: "FNB Credits (ITVarsity)" },
                  { label: "84%", val: "NQF L4 Project Mgmt" },
                  { label: "GCP ACE", val: "Cloud Jam Attendee" }
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-3xl group hover:border-sky-500/30 transition-all">
                    <span className="block text-3xl font-black text-sky-400 group-hover:scale-110 transition-transform">{stat.label}</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mt-2 block">{stat.val}</span>
                  </div>
                ))}
              </div>
            </FadeInView>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-40">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400" />
               
               <FadeInView>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/10 border border-sky-400/20 rounded-full text-sky-300 text-xs font-bold tracking-widest uppercase mb-8">
                   <MapPin size={12} /> {location}
                 </div>

                 <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to Build & Scale?</h2>
                 <p className="text-zinc-300 mb-14 max-w-2xl mx-auto text-lg md:text-xl font-medium">
                   Open to full-time, contract & remote opportunities in Full-Stack Development, Cloud Engineering, and Technical Project Management. Let's discuss your roadmap.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-5 mb-16">
                   <a href={`mailto:${email}`} className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                     <Mail size={16} /> {email}
                   </a>
                   <button onClick={handleDownloadResume} className="flex items-center justify-center gap-3 px-8 py-4 bg-sky-600 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-sky-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] cursor-pointer">
                     <Download size={16} /> Download Resume
                   </button>
                   <div className="flex items-center justify-center gap-3 px-8 py-4 bg-zinc-800 text-zinc-300 font-black text-xs uppercase tracking-widest rounded-full border border-white/5">
                     <Phone size={16} /> {phone}
                   </div>
                 </div>

                 <div className="flex justify-center gap-12 border-t border-white/5 pt-12">
                   <a href={githubUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2.5 text-zinc-400 hover:text-white transition-all hover:-translate-y-1">
                     <Github size={26} />
                     <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
                   </a>
                   <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2.5 text-zinc-400 hover:text-white transition-all hover:-translate-y-1">
                     <Linkedin size={26} />
                     <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                   </a>
                   <button onClick={handleDownloadResume} className="flex flex-col items-center gap-2.5 text-sky-400 hover:text-white transition-all hover:-translate-y-1 cursor-pointer group">
                     <Download size={26} className="group-hover:scale-110 transition-transform" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Resume HTML/PDF</span>
                   </button>
                 </div>
               </FadeInView>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 text-center text-zinc-500 bg-black border-t border-white/5">
          <div className="container mx-auto px-6">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase">© {new Date().getFullYear()} KGOTSO GODFREY PHIRI · JOHANNESBURG, SOUTH AFRICA</p>
            <div className="mt-4 flex justify-center gap-4 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
              <span>Full-Stack</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full my-auto" />
              <span>GCP Cloud Engineering</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full my-auto" />
              <span>Agentic AI</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full my-auto" />
              <span>NQF L4 Project Mgmt</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Download Alert Toast */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${downloadNotification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className="flex items-center gap-3 px-6 py-3 bg-sky-600 text-white rounded-full font-bold text-xs shadow-2xl border border-sky-400/30">
          <Check size={16} /> Official Resume Download Started!
        </div>
      </div>

      <ChatBot />

      {/* Embedded Live AI Studio App Modal */}
      {selectedAppForEmbed && (
        <EmbeddedAppModal
          isOpen={!!selectedAppForEmbed}
          onClose={() => setSelectedAppForEmbed(null)}
          appTitle={selectedAppForEmbed.title}
          appUrl={selectedAppForEmbed.url}
          description={selectedAppForEmbed.description}
          tech={selectedAppForEmbed.tech}
        />
      )}

      {/* Add / Customise AI Studio App Modal */}
      <AddAppModal
        isOpen={isAddAppModalOpen}
        onClose={() => setIsAddAppModalOpen(false)}
        onAddProject={handleAddNewProject}
      />
    </div>
  );
}

export default App;
