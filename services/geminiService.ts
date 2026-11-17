export interface ChatHistoryItem {
  sender: 'user' | 'ai';
  text: string;
}

export interface ChatEmailDraft {
  to: string;
  subject: string;
  body: string;
  category: string;
}

export interface ChatResponsePayload {
  text: string;
  emailDraft?: ChatEmailDraft | null;
}

export interface InquiryAnalysisResult {
  category: string;
  urgency: string;
  matchedCredentials: string[];
  suggestedSubject: string;
  formattedEmailToKgotso: string;
  automatedResponseDraft: string;
  nextStepRecommendation: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  labelIds: string[];
  isUnread: boolean;
  from: string;
  to: string;
  subject: string;
  date: string;
  messageIdHeader: string;
  snippet: string;
}

export interface StagedEmailDraft {
  draftId: string;
  messageId: string;
  threadId: string;
  inReplyTo: string;
  to: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
  ruleApplied: string;
  reasoning: string;
}

export interface AgentEmailTriageResult {
  summary: string;
  actionsExecuted: Array<{ tool: string; detail: string }>;
  stagedDrafts: StagedEmailDraft[];
  scannedEmails: GmailMessageSummary[];
}

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[]
): Promise<ChatResponsePayload> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get AI response.');
  }
  return data as ChatResponsePayload;
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string
): Promise<string> {
  const res = await fetch('/api/gemini/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Audio transcription failed.');
  }
  return data.text || '';
}

export async function synthesizeSpeech(
  text: string,
  voiceName = 'Kore',
  style?: string
): Promise<{ audioBase64: string; mimeType: string }> {
  const res = await fetch('/api/gemini/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceName, style }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Speech synthesis failed.');
  }
  return data;
}

export async function analyzeAndDraftInquiry(payload: {
  senderName: string;
  senderEmail: string;
  company: string;
  inquiryType: string;
  message: string;
}): Promise<InquiryAnalysisResult> {
  const res = await fetch('/api/agent/inquiry-respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to analyze inquiry.');
  }
  return data as InquiryAnalysisResult;
}

export async function listGmailMessages(
  accessToken: string,
  query = 'in:inbox',
  maxResults = 8
): Promise<GmailMessageSummary[]> {
  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
  });
  const res = await fetch(`/api/gmail/messages?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load Gmail inbox.');
  }
  return data.messages || [];
}

export async function runEmailAutomationAgent(
  accessToken: string,
  payload: {
    instruction?: string;
    activeRules?: string[];
    targetMessageIds?: string[];
  }
): Promise<AgentEmailTriageResult> {
  const res = await fetch('/api/agent/email-triage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Email automation agent run failed.');
  }
  return data as AgentEmailTriageResult;
}

export async function sendGmailEmail(
  accessToken: string,
  payload: {
    to: string;
    subject: string;
    body: string;
    threadId?: string;
    inReplyTo?: string;
  }
): Promise<{ success: boolean; messageId: string; threadId: string }> {
  const res = await fetch('/api/gmail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send email via Gmail.');
  }
  return data;
}

export async function saveGmailDraft(
  accessToken: string,
  payload: {
    to: string;
    subject: string;
    body: string;
    threadId?: string;
    inReplyTo?: string;
  }
): Promise<{ success: boolean; draftId: string }> {
  const res = await fetch('/api/gmail/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save Gmail draft.');
  }
  return data;
}
