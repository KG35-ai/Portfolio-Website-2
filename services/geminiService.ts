import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const RESUME_CONTEXT = `
NAME: Kgotso Godfrey Phiri
ROLE: Full-Stack Developer · AI & Cloud Junior · Technical Project Manager
LOCATION: Johannesburg, Gauteng, South Africa
CONTACT: 
- Phone: 065 968 1959
- Email: phirikg22@gmail.com
- Github: https://github.com/KG35-ai
- LinkedIn: https://www.linkedin.com/in/kgotso-phiri-98aa21276

PROFESSIONAL PROFILE:
Driven junior developer and certified AI & cloud practitioner with hands-on expertise in full-stack application development, database engineering, and cloud-native AI solutions. Holder of 9+ verified industry certifications from WeThinkCode_, FNB App Academy, MongoDB, AWS, NVIDIA, and Microsoft/NEMISA. Proven ability to build production-grade apps using modern stacks, integrate AI agents with NoSQL databases, and manage projects end-to-end using Agile methodologies. Eager to contribute to high-impact engineering teams in fintech, cloud, or AI-driven product environments.

CERTIFICATIONS & CREDENTIALS:
1. Google Cloud ACE — Scheduled (Google Cloud | Jul 8, 2026) - GCP ACE Jam Series Attendee
2. GenAI for Software Developers (WeThinkCode_ | May 2026)
3. Certificate in Full Stack Development - 32 Credits (FNB App Academy / ITVarsity | Jul 2025)
4. Project Management — NQF Level 4 - 84% Competent (Believers Care Society / Service SETA Accred: 6469 | 2025)
5. AI for Government - NSG (NEMISA / Microsoft | Dec 2025)
6. AI Agents with MongoDB (MongoDB University | Feb 2026)
7. Overview of Building AI Apps on AWS (MongoDB University | Feb 2026)
8. AWS Foundations: Cloud Essentials (Amazon Web Services | Feb 2026)
9. InfiniBand Essentials (NVIDIA Academy | Mar 2026)
10. GitHub Copilot, Responsible AI & Git - 4 badges (Microsoft Learn | Sep–Oct 2026)
11. 2026 AI Academy — AI Specialist for Business Growth (ITVarsity | Oct 2026)

TECHNICAL SKILLS:
- Languages & Frameworks: HTML5, CSS3, JavaScript, Flutter (Dart), REST API Development, Backend Development (Node.js), Python, Click.
- Databases & Cloud: Google Cloud Run, Vertex AI, Firestore / Firebase, MongoDB (Atlas, Vector Search), AWS Cloud Essentials, AI Agents with MongoDB.
- AI & Emerging Tech: AI Agent Development, Google Gemini Live API, Anthropic SDK (Claude API), RAG Pipelines, Function Calling / Tool Use, AI App Development (AWS), AI for Government (Microsoft), InfiniBand / HPC Networking.
- Tools & Practices: Git & GitHub, Figma / UI/UX Design, Agile & Scrum, Linux / Termux, CI/CD (Cloud Build basics).
- Product & Project: Project Management (NQF L4), Design Thinking, User-Centric App Development, Data Management & Analysis, Business Development, App Monetisation Strategy.
- Soft Skills: Cross-functional Collaboration, Problem Solving, Fast Learner / Self-Driven.

KEY PROJECTS & HACKATHONS:
1. ACE CLI — Agentic Terminal Tool (2026): Built a Python/Click CLI tool using the Anthropic SDK with streaming chat and function calling for multi-turn agentic task orchestration.
2. Diketo — AI Cultural Heritage Game Agent (2025–2026 | Gemini Live Agent Challenge): Built an AI-powered agent to preserve and teach Diketo (traditional South African game). Stack: Google Gemini API, Firebase, Cloud Run — deployed via Google AI Studio. Submitted to Devpost.
3. Morabaraba — AI Strategy Game (2025–2026 | Devpost Hackathon): Developed AI opponent for Morabaraba (traditional SA board game) using Gemini + Vertex AI as a centerpiece for African cultural tech innovation.
4. Courtroom AI (2026 | Kaggle Competition): AI-assisted legal reasoning tool built on Google Cloud (Vertex AI, Firestore) for accessible legal guidance in underserved South African communities.
5. Cloud & Developer Workflow Automation: Scalable cloud-native deployment pipeline and API integration hub designed to streamline developer operations and modern CI/CD processes.

EDUCATION & TRAINING:
- FNB App Academy — Full Stack Development (Jan–Jul 2025 | ITVarsity | 32 Credits): Modules completed in App Strategies, GitHub & Collaboration, SDLC, UX Design, Layouts & Transitions, Design Thinking, APIs, User-Centric App Dev, Backend & API Building, Data Management & Analysis, AI in Development, Business Funding & Marketing.
- Project Management — NQF Level 4 (2025 | Believers Care Society / Service SETA Accred: 6469): 3-month accredited programme with overall result 84% Competent. Final Integrated Summative Assessment: Competent (84%).

WORK EXPERIENCE:
- Picker / Packer at Food Lovers Market (Jul 2024 – Present): Maintained high productivity and accuracy in a fast-paced fulfilment environment. Operated inventory & barcode systems; conducted quality checks. Collaborated with cross-functional teams to meet daily order fulfilment and dispatch deadlines.

OPPORTUNITIES:
Open to full-time, contract & remote opportunities. Certificate verification IDs available on request.
`;

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the virtual portfolio assistant for Kgotso Godfrey Phiri. 
      Your goal is to answer visitor questions about Kgotso's experience, skills, certifications, education, and projects using the provided context.
      
      CONTEXT:
      ${RESUME_CONTEXT}
      
      GUIDELINES:
      - Be professional, accurate, and articulate about Cloud Engineering, Full-Stack Development, Agentic AI, and Agile Project Management.
      - Accurately quote Kgotso's credentials including WeThinkCode GenAI, FNB App Academy (32 credits), Project Management NQF Level 4 (84% competent), Google Cloud ACE Jam, MongoDB AI Agents, AWS Cloud Essentials, NVIDIA InfiniBand, Microsoft Copilot badges, and ITVarsity AI Academy.
      - Mention projects like Diketo (Gemini Live Agent Challenge), ACE CLI (Anthropic tool orchestration), Morabaraba (Gemini + Vertex AI), and Courtroom AI (Google Cloud & Kaggle).
      - Keep responses concise (under 3-4 sentences).
      - If someone inquires about hiring Kgotso, provide his email (phirikg22@gmail.com), phone (065 968 1959), and state that he is open to full-time, contract, and remote opportunities.
      `,
    },
  });

  return chatSession;
};

export async function* sendMessageStream(message: string) {
  try {
    const chat = initializeChat();
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const response = chunk as GenerateContentResponse;
      yield response.text;
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    yield "I encountered an error. Please try again shortly.";
  }
}
