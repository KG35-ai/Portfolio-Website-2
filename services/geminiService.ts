
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const RESUME_CONTEXT = `
NAME: Kgotso Phiri
ROLE: Junior PM & Full Stack Developer
LOCATION: 82 Tramway Street, JHB, Gauteng
CONTACT: 
- Phone: 065 968 1959
- Email: phirikg22@gmail.com
- Github: https://github.com/KG35-ai
- LinkedIn: https://www.linkedin.com/in/kgotso-phiri-98aa21276

PROFILE:
Motivated junior tech professional with specialized experience in Agentic AI, Cloud Engineering, Full-Stack Web Development, and Agile Project Coordination. Graduate of FNB App Academy and holder of multiple industry certifications in AI and Cloud.

CERTIFICATIONS & CREDENTIALS:
1. GenAI for Software Developers - WeThinkCode
2. AI Fluency - Microsoft
3. Building with AWS - MongoDB
4. Agentic AI - MongoDB
5. Agentic AI - Kaggle
6. Full Stack Development - FNB + IT Varsity
7. Project Management - Believers Care Society
8. Cloud Engineering - GCP ACE Jam Series Attendee

KEY SOLUTIONS & PROJECTS:
1. "Agentic AI Task Orchestrator": Intelligent autonomous multi-agent task routing system utilizing Gemini 3 Flash for automated workflow orchestration.
2. "Cloud & Developer Workflow Automation": Scalable cloud-native deployment pipeline and API integration hub designed to streamline developer operations.
3. "Interactive 3D Data Spatializer": Immersive 3D visualization platform for mapping multidimensional datasets and complex agent workflows using Three.js and WebGL.

SKILLS & TECHNICAL ARSENAL:
- Development: Full-Stack Web (React, TypeScript), Flutter & Firebase, Git & GitHub, Python, SQL.
- AI & Data: Agentic AI Systems, Gemini API Workflows, GenAI Development, Model Workflows, Machine Learning Fundamentals.
- Management & Cloud: Agile & Scrum, Project Coordination, AWS & GCP Cloud Engineering, Figma & Wireframing.
`;

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the virtual portfolio assistant for Kgotso Phiri. 
      Your goal is to answer visitor questions about Kgotso's experience, skills, certifications, and projects using the provided context.
      
      CONTEXT:
      ${RESUME_CONTEXT}
      
      GUIDELINES:
      - Be professional, helpful, and enthusiastic about Agentic AI, Cloud Engineering, Software Development, and Project Management.
      - Highlight Kgotso's credentials including WeThinkCode GenAI, Microsoft AI Fluency, MongoDB Agentic AI & AWS, Kaggle Agentic AI, FNB + IT Varsity Full Stack Development, Believers Care Society Project Management, and GCP ACE Cloud Engineering.
      - Keep responses concise (under 3 sentences).
      - If someone asks to "hire" Kgotso, provide his email (phirikg22@gmail.com) and phone number (065 968 1959), and mention his availability for Junior PM and Full Stack / AI Developer roles.
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

