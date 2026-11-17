import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, type FunctionDeclaration, type Content } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

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
Driven junior developer and certified AI & cloud practitioner with hands-on expertise in full-stack application development, database engineering, and cloud-native AI solutions. Holder of 11 verified industry certifications from Google Cloud, WeThinkCode_, FNB App Academy, MongoDB, AWS, NVIDIA, ITVarsity, and Microsoft/NEMISA. Proven ability to build production-grade apps using modern stacks, integrate AI agents with NoSQL databases, and manage projects end-to-end using Agile methodologies. Eager to contribute to high-impact engineering teams in fintech, cloud, or AI-driven product environments.

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
- Languages & Frameworks: HTML5, CSS3, JavaScript, TypeScript, Flutter (Dart), REST API Development, Backend Development (Node.js), Python, Click.
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
- FNB App Academy — Full Stack Development (Jan–Jul 2025 | ITVarsity | 32 Credits)
- Project Management — NQF Level 4 (2025 | Believers Care Society / Service SETA Accred: 6469 | 84% Competent)

WORK EXPERIENCE:
- Picker / Packer at Food Lovers Market (Jul 2024 – Present): Fast-paced fulfilment, inventory & barcode systems, quality checks, cross-functional collaboration.

OPPORTUNITIES:
Open to full-time, contract & remote opportunities. Certificate verification IDs available on request.
`;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to decode base64url from Gmail API payloads
function decodeBase64Url(data?: string): string {
  if (!data) return '';
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf8');
}

// Helper to encode RFC 2822 email as base64url for Gmail API
function encodeEmailBase64Url(params: {
  to: string;
  subject: string;
  body: string;
  inReplyTo?: string;
}): string {
  const headers = [
    `To: ${params.to}`,
    `Subject: ${params.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
  ];
  if (params.inReplyTo) {
    headers.push(`In-Reply-To: ${params.inReplyTo}`);
    headers.push(`References: ${params.inReplyTo}`);
  }
  const rawMessage = `${headers.join('\r\n')}\r\n\r\n${params.body}`;
  return Buffer.from(rawMessage, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Helper to extract plain text body from Gmail message payload
function extractEmailBody(payload: Record<string, unknown> | undefined): string {
  if (!payload) return '';
  const mimeType = payload.mimeType as string | undefined;
  const body = payload.body as { data?: string } | undefined;
  const parts = payload.parts as Array<Record<string, unknown>> | undefined;

  if (mimeType === 'text/plain' && body?.data) {
    return decodeBase64Url(body.data);
  }
  if (Array.isArray(parts)) {
    for (const part of parts) {
      if ((part.mimeType as string) === 'text/plain') {
        const partBody = part.body as { data?: string } | undefined;
        if (partBody?.data) return decodeBase64Url(partBody.data);
      }
    }
    for (const part of parts) {
      const nested = extractEmailBody(part);
      if (nested) return nested;
    }
  }
  if (body?.data) {
    return decodeBase64Url(body.data).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  return '';
}

function getHeader(headers: Array<{ name?: string; value?: string }> | undefined, name: string): string {
  if (!headers) return '';
  const found = headers.find((h) => h.name?.toLowerCase() === name.toLowerCase());
  return found?.value ?? '';
}

async function fetchGmailMessages(accessToken: string, query = 'in:inbox', maxResults = 6) {
  const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  listUrl.searchParams.set('maxResults', String(Math.min(Math.max(maxResults, 1), 15)));
  if (query) listUrl.searchParams.set('q', query);

  const listRes = await fetch(listUrl.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!listRes.ok) {
    const errText = await listRes.text();
    throw new Error(`Gmail list error (${listRes.status}): ${errText}`);
  }

  const listData = (await listRes.json()) as { messages?: Array<{ id: string; threadId: string }> };
  const messageRefs = listData.messages ?? [];

  const detailed = await Promise.all(
    messageRefs.map(async (ref) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${ref.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=Message-ID`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!msgRes.ok) return null;
      const msgData = (await msgRes.json()) as {
        id: string;
        threadId: string;
        labelIds?: string[];
        snippet?: string;
        payload?: { headers?: Array<{ name?: string; value?: string }> };
      };
      const headers = msgData.payload?.headers;
      return {
        id: msgData.id,
        threadId: msgData.threadId,
        labelIds: msgData.labelIds ?? [],
        isUnread: (msgData.labelIds ?? []).includes('UNREAD'),
        from: getHeader(headers, 'From'),
        to: getHeader(headers, 'To'),
        subject: getHeader(headers, 'Subject') || '(No Subject)',
        date: getHeader(headers, 'Date'),
        messageIdHeader: getHeader(headers, 'Message-ID'),
        snippet: msgData.snippet ?? '',
      };
    })
  );

  return detailed.filter((m): m is NonNullable<typeof m> => m !== null);
}

async function fetchGmailMessageDetail(accessToken: string, messageId: string) {
  const msgRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(messageId)}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!msgRes.ok) {
    const errText = await msgRes.text();
    throw new Error(`Gmail get error (${msgRes.status}): ${errText}`);
  }
  const msgData = (await msgRes.json()) as {
    id: string;
    threadId: string;
    labelIds?: string[];
    snippet?: string;
    payload?: Record<string, unknown> & { headers?: Array<{ name?: string; value?: string }> };
  };
  const headers = msgData.payload?.headers;
  const bodyText = extractEmailBody(msgData.payload).slice(0, 4000);
  return {
    id: msgData.id,
    threadId: msgData.threadId,
    from: getHeader(headers, 'From'),
    to: getHeader(headers, 'To'),
    subject: getHeader(headers, 'Subject') || '(No Subject)',
    date: getHeader(headers, 'Date'),
    messageIdHeader: getHeader(headers, 'Message-ID'),
    snippet: msgData.snippet ?? '',
    body: bodyText || msgData.snippet || '',
  };
}

const prepareEmailDraftDeclaration: FunctionDeclaration = {
  name: 'prepare_email_draft',
  description:
    'Prepares a structured email draft for a visitor to contact Kgotso Godfrey Phiri (phirikg22@gmail.com) or reply to an inquiry. Use this when the user explicitly asks to email, message, hire, or draft an email.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      to: {
        type: Type.STRING,
        description: 'Recipient email address, usually phirikg22@gmail.com unless specified.',
      },
      subject: {
        type: Type.STRING,
        description: 'Concise, professional email subject line.',
      },
      body: {
        type: Type.STRING,
        description: 'Complete polite email body ready for review.',
      },
      category: {
        type: Type.STRING,
        description: 'Category such as Recruitment, Cloud Collaboration, Verification, or Inquiry.',
      },
    },
    required: ['to', 'subject', 'body', 'category'],
  },
};

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // 1. Streaming / Agentic Voice+Text Chat Endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history } = req.body as {
        message?: string;
        history?: Array<{ sender: 'user' | 'ai'; text: string }>;
      };

      if (!message || !message.trim()) {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const ai = getGeminiClient();
      const contents: Content[] = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-12)) {
          if (item.text?.trim()) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const systemInstruction = `You are the voice-enabled virtual portfolio assistant for Kgotso Godfrey Phiri.
Your goal is to answer visitor questions about Kgotso's experience, skills, certifications, education, and projects using the verified context below.

CONTEXT:
${RESUME_CONTEXT}

GUIDELINES:
- Be professional, warm, accurate, and articulate about Cloud Engineering, Full-Stack Development, Agentic AI, and Agile Project Management.
- Keep responses concise (2-4 clear sentences) so they also sound natural when spoken aloud via text-to-speech.
- Accurately quote Kgotso's credentials (Google Cloud ACE Jam, WeThinkCode_ GenAI, FNB App Academy 32 credits, Project Management NQF Level 4 at 84% Competent, MongoDB AI Agents, AWS Cloud Essentials, NVIDIA InfiniBand, Microsoft Copilot badges, ITVarsity AI Academy).
- Mention projects like ACE CLI, Diketo, Morabaraba, and Courtroom AI when relevant.
- If the user asks to write, draft, or send an email to Kgotso (e.g., for hiring, interviews, collaboration, or certificate verification), call the prepare_email_draft tool so they get an interactive email draft card they can review and send.`;

      const firstResponse = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [prepareEmailDraftDeclaration] }],
        },
      });

      const functionCalls = firstResponse.functionCalls;
      let emailDraft: Record<string, string> | null = null;
      let finalText = firstResponse.text ?? '';

      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'prepare_email_draft' && call.args) {
          const args = call.args as Record<string, string>;
          emailDraft = {
            to: args.to || 'phirikg22@gmail.com',
            subject: args.subject || 'Portfolio Inquiry for Kgotso Godfrey Phiri',
            body: args.body || '',
            category: args.category || 'Inquiry',
          };

          const prevContent = firstResponse.candidates?.[0]?.content;
          if (prevContent) {
            const followUp = await ai.models.generateContent({
              model: 'gemini-4-hydrogen',
              contents: [
                ...contents,
                prevContent,
                {
                  role: 'user',
                  parts: [
                    {
                      functionResponse: {
                        id: call.id,
                        name: call.name,
                        response: {
                          status: 'draft_prepared',
                          recipient: emailDraft.to,
                          subject: emailDraft.subject,
                        },
                      },
                    },
                  ],
                },
              ],
              config: {
                systemInstruction,
                tools: [{ functionDeclarations: [prepareEmailDraftDeclaration] }],
              },
            });
            finalText =
              followUp.text ??
              `I've prepared an email draft to ${emailDraft.to} regarding "${emailDraft.subject}". You can review and send it directly below.`;
          }
        }
      }

      if (!finalText.trim()) {
        finalText = "I'm ready to help with questions about Kgotso's cloud engineering background, projects, or drafting an email inquiry.";
      }

      res.json({ text: finalText, emailDraft });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to generate chat response.';
      console.error('Chat API error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // 2. Audio Transcription Endpoint (gemini-3.5-transcribe)
  app.post('/api/gemini/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body as {
        audioBase64?: string;
        mimeType?: string;
      };

      if (!audioBase64) {
        res.status(400).json({ error: 'Audio payload is required.' });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: audioBase64,
              },
            },
            { text: 'Transcribe this spoken audio accurately. Return only the transcribed text.' },
          ],
        },
      });

      res.json({ text: (response.text ?? '').trim() });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Audio transcription failed.';
      console.error('Transcription error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // 3. Text-to-Speech Endpoint (gemini-3.8-flash-lite-tts)
  app.post('/api/gemini/tts', async (req, res) => {
    try {
      const { text, voiceName, style } = req.body as {
        text?: string;
        voiceName?: string;
        style?: string;
      };

      if (!text || !text.trim()) {
        res.status(400).json({ error: 'Text is required for speech generation.' });
        return;
      }

      const allowedVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
      const chosenVoice = voiceName && allowedVoices.includes(voiceName) ? voiceName : 'Kore';

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 1500),
                speechMetadata: {
                  style: style || 'Warm, clear, confident technical assistant',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: chosenVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        res.status(500).json({ error: 'No audio generated by TTS model.' });
        return;
      }

      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Speech synthesis failed.';
      console.error('TTS error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // 4. Visitor / Recruiter Inquiry Agent (Generates automated triage & personalized response preview)
  app.post('/api/agent/inquiry-respond', async (req, res) => {
    try {
      const { senderName, senderEmail, company, inquiryType, message } = req.body as {
        senderName?: string;
        senderEmail?: string;
        company?: string;
        inquiryType?: string;
        message?: string;
      };

      if (!message || !message.trim()) {
        res.status(400).json({ error: 'Inquiry message is required.' });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Analyze this incoming portfolio inquiry and generate an automated response draft on behalf of Kgotso Godfrey Phiri.

INCOMING INQUIRY:
- Sender Name: ${senderName || 'Visitor'}
- Sender Email: ${senderEmail || 'Not provided'}
- Organization: ${company || 'Not specified'}
- Selected Type: ${inquiryType || 'General'}
- Message: ${message}

KGOTSO CONTEXT:
${RESUME_CONTEXT}`,
        config: {
          systemInstruction:
            'You are an Agentic AI Email Automation Engine for Kgotso Godfrey Phiri. Classify the inquiry, extract the highest-impact relevant credentials from his CV, and craft both an outgoing contact subject/body and an instant automated reply confirmation.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'Category: Recruitment / Interview, Cloud & AI Project, Certificate Verification, or General Collaboration.',
              },
              urgency: {
                type: Type.STRING,
                description: 'Urgency level: High, Medium, or Normal.',
              },
              matchedCredentials: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 relevant skills or certifications from Kgotso resume matching this inquiry.',
              },
              suggestedSubject: {
                type: Type.STRING,
                description: 'Clean email subject line for the inquiry.',
              },
              formattedEmailToKgotso: {
                type: Type.STRING,
                description: 'Well-structured email body to send to phirikg22@gmail.com.',
              },
              automatedResponseDraft: {
                type: Type.STRING,
                description: 'Polite, tailored automated reply from Kgotso acknowledging the inquiry and referencing matched credentials.',
              },
              nextStepRecommendation: {
                type: Type.STRING,
                description: 'One concise next step recommended by the agent.',
              },
            },
            required: [
              'category',
              'urgency',
              'matchedCredentials',
              'suggestedSubject',
              'formattedEmailToKgotso',
              'automatedResponseDraft',
              'nextStepRecommendation',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Agentic inquiry processing failed.';
      console.error('Inquiry agent error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // 5. Gmail Inbox List Endpoint (Requires Bearer token from client Firebase/Google OAuth)
  app.get('/api/gmail/messages', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing Google access token.' });
        return;
      }
      const accessToken = authHeader.slice(7).trim();
      const query = (req.query.q as string) || 'in:inbox';
      const maxResults = Number(req.query.maxResults) || 8;
      const messages = await fetchGmailMessages(accessToken, query, maxResults);
      res.json({ messages });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch Gmail messages.';
      console.error('Gmail list error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // 6. Agentic AI Gmail Automation & Response Workflow (Multi-step Tool Loop)
  app.post('/api/agent/email-triage', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing Google access token. Please sign in with Google first.' });
        return;
      }
      const accessToken = authHeader.slice(7).trim();

      const { instruction, activeRules, targetMessageIds } = req.body as {
        instruction?: string;
        activeRules?: string[];
        targetMessageIds?: string[];
      };

      const ai = getGeminiClient();

      const listMessagesTool: FunctionDeclaration = {
        name: 'list_gmail_messages',
        description: 'Lists recent emails in the user Gmail inbox using an optional Gmail search query (e.g. "in:inbox", "is:unread", "from:recruiter").',
        parameters: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: 'Gmail search query, default "in:inbox"' },
            maxResults: { type: Type.NUMBER, description: 'Maximum number of messages to fetch (1-10)' },
          },
          required: ['query'],
        },
      };

      const readMessageTool: FunctionDeclaration = {
        name: 'read_gmail_message',
        description: 'Reads the full subject, sender, threadId, Message-ID, and body text of a specific Gmail message by ID.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            messageId: { type: Type.STRING, description: 'Gmail message ID to read' },
          },
          required: ['messageId'],
        },
      };

      const stageResponseTool: FunctionDeclaration = {
        name: 'stage_email_response',
        description:
          'Stages an AI-crafted email reply or outbound draft for explicit human confirmation before sending or saving in Gmail. Never sends automatically.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            messageId: { type: Type.STRING, description: 'Original Gmail message ID being replied to (or "new" for outbound)' },
            threadId: { type: Type.STRING, description: 'Gmail threadId for threading the reply (if replying)' },
            inReplyTo: { type: Type.STRING, description: 'Message-ID header of the original email if available' },
            to: { type: Type.STRING, description: 'Recipient email address' },
            subject: { type: Type.STRING, description: 'Email subject line (prefix with Re: when replying)' },
            body: { type: Type.STRING, description: 'Complete, ready-to-send email reply written in Kgotso Godfrey Phiri voice' },
            category: { type: Type.STRING, description: 'Classification: Recruiter, Cloud/AI Collaboration, Verification Request, Client Inquiry, or Follow-Up' },
            priority: { type: Type.STRING, description: 'High, Medium, or Low' },
            ruleApplied: { type: Type.STRING, description: 'Automation rule or playbook matched' },
            reasoning: { type: Type.STRING, description: 'Brief explanation of why this reply was drafted' },
          },
          required: ['to', 'subject', 'body', 'category', 'priority', 'reasoning'],
        },
      };

      const stagedDrafts: Array<Record<string, string>> = [];
      const scannedEmails: Array<Record<string, unknown>> = [];
      const actionsExecuted: Array<{ tool: string; detail: string }> = [];

      const rulesContext =
        activeRules && activeRules.length > 0
          ? `ACTIVE AUTOMATION PLAYBOOKS:\n- ${activeRules.join('\n- ')}`
          : 'ACTIVE AUTOMATION PLAYBOOKS:\n- Recruiter & Hiring Responder\n- Cloud/AI Hackathon & Collaboration Responder\n- Certificate Verification Responder';

      const targetContext =
        targetMessageIds && targetMessageIds.length > 0
          ? `FOCUS ON MESSAGE IDs: ${targetMessageIds.join(', ')}`
          : 'Scan the latest inbox emails (up to 6) and inspect relevant ones that need replies.';

      const userPrompt = instruction?.trim()
        ? `${instruction.trim()}\n\n${targetContext}\n${rulesContext}`
        : `Triage my inbox, read relevant incoming messages, and stage tailored automated reply drafts for any opportunities, collaborations, or inquiries requiring a response.\n\n${targetContext}\n${rulesContext}`;

      const conversation: Content[] = [{ role: 'user', parts: [{ text: userPrompt }] }];

      const systemInstruction = `You are Kgotso Godfrey Phiri's Agentic Email Automation Engine.
You have tools to list Gmail messages, read full message threads, and stage tailored email replies for Kgotso's review.

KGOTSO PROFILE & CREDENTIALS:
${RESUME_CONTEXT}

WORKFLOW RULES:
1. First inspect messages using list_gmail_messages (or read_gmail_message if specific IDs were given).
2. Read promising or inquiry messages with read_gmail_message so your draft replies accurately address their specific questions.
3. Skip automated marketing/newsletters/no-reply alerts unless specifically asked — mention them in your summary as skipped.
4. For every actionable email (recruiter outreach, interview scheduling, collaboration, client inquiry, verification request), call stage_email_response with a polished, accurate reply signed by "Kgotso Godfrey Phiri".
5. Never claim an email was sent — clearly state that staged replies await user confirmation in the Review & Confirm panel.
6. After staging responses, provide a crisp executive summary of what you scanned, triaged, and drafted.`;

      let finalSummary = '';

      for (let step = 0; step < 6; step++) {
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: conversation,
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: [listMessagesTool, readMessageTool, stageResponseTool] }],
          },
        });

        const modelContent = response.candidates?.[0]?.content;
        if (modelContent) {
          conversation.push(modelContent);
        }

        const calls = response.functionCalls;
        if (!calls || calls.length === 0) {
          finalSummary = response.text ?? '';
          break;
        }

        const functionResponseParts = [];

        for (const call of calls) {
          const args = (call.args ?? {}) as Record<string, unknown>;
          if (call.name === 'list_gmail_messages') {
            const query = (args.query as string) || 'in:inbox';
            const maxResults = Number(args.maxResults) || 6;
            const msgs = await fetchGmailMessages(accessToken, query, maxResults);
            for (const m of msgs) {
              if (!scannedEmails.some((e) => e.id === m.id)) {
                scannedEmails.push(m);
              }
            }
            actionsExecuted.push({
              tool: 'list_gmail_messages',
              detail: `Scanned ${msgs.length} email(s) matching "${query}"`,
            });
            functionResponseParts.push({
              functionResponse: {
                id: call.id,
                name: call.name,
                response: { messages: msgs },
              },
            });
          } else if (call.name === 'read_gmail_message') {
            const messageId = String(args.messageId || '');
            const detail = await fetchGmailMessageDetail(accessToken, messageId);
            actionsExecuted.push({
              tool: 'read_gmail_message',
              detail: `Read "${detail.subject}" from ${detail.from}`,
            });
            functionResponseParts.push({
              functionResponse: {
                id: call.id,
                name: call.name,
                response: { email: detail },
              },
            });
          } else if (call.name === 'stage_email_response') {
            const staged = {
              draftId: `staged-${Date.now()}-${stagedDrafts.length + 1}`,
              messageId: String(args.messageId || ''),
              threadId: String(args.threadId || ''),
              inReplyTo: String(args.inReplyTo || ''),
              to: String(args.to || ''),
              subject: String(args.subject || ''),
              body: String(args.body || ''),
              category: String(args.category || 'General'),
              priority: String(args.priority || 'Medium'),
              ruleApplied: String(args.ruleApplied || 'Smart Response Agent'),
              reasoning: String(args.reasoning || ''),
            };
            stagedDrafts.push(staged);
            actionsExecuted.push({
              tool: 'stage_email_response',
              detail: `Staged ${staged.category} reply to ${staged.to}`,
            });
            functionResponseParts.push({
              functionResponse: {
                id: call.id,
                name: call.name,
                response: {
                  status: 'staged_for_user_confirmation',
                  draftId: staged.draftId,
                },
              },
            });
          }
        }

        conversation.push({
          role: 'user',
          parts: functionResponseParts,
        });
      }

      res.json({
        summary:
          finalSummary.trim() ||
          `Agent completed scan of ${scannedEmails.length} email(s) and staged ${stagedDrafts.length} response(s) for your approval.`,
        actionsExecuted,
        stagedDrafts,
        scannedEmails,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Agentic email automation failed.';
      console.error('Agent email triage error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // 7. Send Confirmed Email via Gmail API (Only called after explicit user confirmation)
  app.post('/api/gmail/send', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing Google access token.' });
        return;
      }
      const accessToken = authHeader.slice(7).trim();

      const { to, subject, body, threadId, inReplyTo } = req.body as {
        to?: string;
        subject?: string;
        body?: string;
        threadId?: string;
        inReplyTo?: string;
      };

      if (!to || !subject || !body) {
        res.status(400).json({ error: 'Recipient, subject, and body are required.' });
        return;
      }

      const raw = encodeEmailBase64Url({ to, subject, body, inReplyTo });
      const payload: { raw: string; threadId?: string } = { raw };
      if (threadId) payload.threadId = threadId;

      const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await gmailRes.json();
      if (!gmailRes.ok) {
        res.status(gmailRes.status).json({ error: data?.error?.message || 'Failed to send email via Gmail.' });
        return;
      }

      res.json({ success: true, messageId: data.id, threadId: data.threadId });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to send Gmail message.';
      console.error('Gmail send error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // 8. Save Confirmed Draft via Gmail API
  app.post('/api/gmail/draft', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing Google access token.' });
        return;
      }
      const accessToken = authHeader.slice(7).trim();

      const { to, subject, body, threadId, inReplyTo } = req.body as {
        to?: string;
        subject?: string;
        body?: string;
        threadId?: string;
        inReplyTo?: string;
      };

      if (!to || !subject || !body) {
        res.status(400).json({ error: 'Recipient, subject, and body are required.' });
        return;
      }

      const raw = encodeEmailBase64Url({ to, subject, body, inReplyTo });
      const messagePayload: { raw: string; threadId?: string } = { raw };
      if (threadId) messagePayload.threadId = threadId;

      const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messagePayload }),
      });

      const data = await gmailRes.json();
      if (!gmailRes.ok) {
        res.status(gmailRes.status).json({ error: data?.error?.message || 'Failed to save Gmail draft.' });
        return;
      }

      res.json({ success: true, draftId: data.id });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to save Gmail draft.';
      console.error('Gmail draft error:', error);
      res.status(500).json({ error: msg });
    }
  });

  // Frontend Serving (Vite middleware in dev, dist in production)
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
