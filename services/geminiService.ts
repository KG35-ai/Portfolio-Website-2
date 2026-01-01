import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Official resume data + Deep Project Context
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
Motivated and adaptable junior tech professional with hands-on experience in full-stack application development and agile project coordination. Recently completed a 9-week FNB App Academy bootcamp. Certified in AI for Government (NEMISA) and Google/Kaggle 5-Day AI Agent Intensive.

PROJECTS (Flagship builds from AI Studio):
1. "AgileTask Flutter": A cross-platform task management system built with Flutter and Firebase. It features real-time state synchronization, agile board views, and a clean user interface for project tracking. It demonstrates proficiency in mobile-first full-stack architecture and real-time databases.
2. "AI Agent Workflow": Developed during the Google/Kaggle Intensive. It automates complex data preprocessing tasks using Gemini-powered intelligent agents and SQL databases. It showcases advanced skills in LLM integration, agentic workflows, and data handling.
3. "NeonVerse UI": A high-fidelity prototype and design system created in Figma. It focuses on immersive 3D commerce experiences, utilizing custom wireframing and interactive design principles for future-facing web apps.

EDUCATION & CERTIFICATIONS:
- FNB App Academy Graduate (Full Stack Development)
- Certificate in Project Management (2025)
- Google/Kaggle 5-Day AI Intensive
- Nemisa - AI for Government

SKILLS:
- Flutter, Firebase, React, TypeScript, Python, SQL, Git/GitHub, Agile/Scrum, UI/UX (Figma).
`;

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the virtual portfolio assistant for Kgotso Phiri. 
      Your goal is to answer visitor questions about Kgotso's experience, skills, and projects using the provided context.
      
      CONTEXT:
      ${RESUME_CONTEXT}
      
      GUIDELINES:
      - Be professional, helpful, and enthusiastic about tech.
      - Focus on Kgotso's three main projects: AgileTask, AI Agent Workflow, and NeonVerse UI.
      - Keep responses concise (under 3 sentences).
      - If someone asks to "hire" Kgotso, provide his email (phirikg22@gmail.com) and mention his Junior PM and Full Stack skills.
      - If asked about his background, mention FNB App Academy and his AI certifications.
      `,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm having trouble connecting right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while processing your request. Please check your connection.";
  }
};