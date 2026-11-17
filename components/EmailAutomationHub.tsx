import React, { useEffect, useState, useRef } from 'react';
import { type User } from 'firebase/auth';
import {
  Bot,
  Mail,
  Send,
  Sparkles,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  LogOut,
  FileEdit,
  RefreshCw,
  Mic,
  Square,
  Volume2,
  X,
  ShieldAlert,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import {
  initWorkspaceAuth,
  googleWorkspaceSignIn,
  getWorkspaceAccessToken,
  logoutWorkspace,
} from '../services/workspaceAuth';
import {
  analyzeAndDraftInquiry,
  listGmailMessages,
  runEmailAutomationAgent,
  sendGmailEmail,
  saveGmailDraft,
  transcribeAudio,
  synthesizeSpeech,
  type InquiryAnalysisResult,
  type GmailMessageSummary,
  type StagedEmailDraft,
  type ChatEmailDraft,
} from '../services/geminiService';

interface EmailAutomationHubProps {
  incomingChatDraft?: ChatEmailDraft | null;
  onClearIncomingDraft?: () => void;
}

interface PendingConfirmAction {
  mode: 'send' | 'draft';
  to: string;
  subject: string;
  body: string;
  threadId?: string;
  inReplyTo?: string;
  stagedDraftId?: string;
}

const AUTOMATION_PLAYBOOKS = [
  {
    id: 'recruiter',
    label: 'Recruiter & Hiring Responder',
    description: 'Highlights GCP ACE Jam, FNB App Academy (32 credits), and availability.',
  },
  {
    id: 'collab',
    label: 'Cloud & AI Collaboration Responder',
    description: 'Shares architecture context on Diketo, ACE CLI, Morabaraba, and Courtroom AI.',
  },
  {
    id: 'verification',
    label: 'Certificate Verification Responder',
    description: 'Responds to credential audits with issuer details and verification readiness.',
  },
];

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const GoogleSignInButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({
  onClick,
  disabled,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="gsi-material-button"
  >
    <div className="gsi-material-button-content-wrapper">
      <div className="gsi-material-button-icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          style={{ display: 'block' }}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>
      <span className="gsi-material-button-contents">Sign in with Google</span>
    </div>
  </button>
);

const EmailAutomationHub: React.FC<EmailAutomationHubProps> = ({
  incomingChatDraft,
  onClearIncomingDraft,
}) => {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'gmail'>('inquiry');

  // Auth State
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Visitor / Smart Inquiry Responder State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [company, setCompany] = useState('');
  const [inquiryType, setInquiryType] = useState('Recruitment / Role');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isAnalyzingInquiry, setIsAnalyzingInquiry] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<InquiryAnalysisResult | null>(null);
  const [editableOutboundSubject, setEditableOutboundSubject] = useState('');
  const [editableOutboundBody, setEditableOutboundBody] = useState('');

  // Gmail Automation Agent State
  const [gmailMessages, setGmailMessages] = useState<GmailMessageSummary[]>([]);
  const [selectedMsgIds, setSelectedMsgIds] = useState<string[]>([]);
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [agentInstruction, setAgentInstruction] = useState(
    'Scan my latest inbox messages, triage recruiter or collaboration opportunities, and draft tailored replies.'
  );
  const [activePlaybooks, setActivePlaybooks] = useState<string[]>([
    'Recruiter & Hiring Responder',
    'Cloud & AI Collaboration Responder',
    'Certificate Verification Responder',
  ]);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [agentSummary, setAgentSummary] = useState<string | null>(null);
  const [agentActions, setAgentActions] = useState<Array<{ tool: string; detail: string }>>([]);
  const [stagedDrafts, setStagedDrafts] = useState<StagedEmailDraft[]>([]);

  // Confirmation & Feedback State
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirmAction | null>(null);
  const [isExecutingGmailAction, setIsExecutingGmailAction] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Voice Dictation & Playback in Email Hub
  const [isDictating, setIsDictating] = useState(false);
  const [isPlayingReply, setIsPlayingReply] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (authUser, accessToken) => {
        setUser(authUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Pre-fill when ChatBot sends an email draft over
  useEffect(() => {
    if (incomingChatDraft) {
      setActiveTab('inquiry');
      setEditableOutboundSubject(incomingChatDraft.subject);
      setEditableOutboundBody(incomingChatDraft.body);
      setInquiryResult({
        category: incomingChatDraft.category || 'Portfolio Inquiry',
        urgency: 'Normal',
        matchedCredentials: ['Google Cloud ACE Jam', 'FNB App Academy (32 Credits)', 'Agentic AI'],
        suggestedSubject: incomingChatDraft.subject,
        formattedEmailToKgotso: incomingChatDraft.body,
        automatedResponseDraft:
          'Thank you for reaching out! Kgotso Godfrey Phiri has received your inquiry and will follow up shortly regarding opportunities and collaboration.',
        nextStepRecommendation: 'Review the subject and body below, then send directly.',
      });
      if (onClearIncomingDraft) onClearIncomingDraft();
    }
  }, [incomingChatDraft, onClearIncomingDraft]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setStatusNotice(null);
    try {
      const result = await googleWorkspaceSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        await loadInbox(result.accessToken);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setStatusNotice({ type: 'error', text: msg });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutWorkspace();
    setUser(null);
    setToken(null);
    setNeedsAuth(true);
    setGmailMessages([]);
    setStagedDrafts([]);
    setAgentSummary(null);
    setAgentActions([]);
  };

  const loadInbox = async (activeToken?: string) => {
    const t = activeToken || token || (await getWorkspaceAccessToken());
    if (!t) {
      setNeedsAuth(true);
      return;
    }
    setIsLoadingInbox(true);
    setStatusNotice(null);
    try {
      const msgs = await listGmailMessages(t, 'in:inbox', 8);
      setGmailMessages(msgs);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load Gmail inbox.';
      setStatusNotice({ type: 'error', text: msg });
    } finally {
      setIsLoadingInbox(false);
    }
  };

  const handleAnalyzeInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    setIsAnalyzingInquiry(true);
    setStatusNotice(null);
    try {
      const result = await analyzeAndDraftInquiry({
        senderName,
        senderEmail,
        company,
        inquiryType,
        message: inquiryMessage,
      });
      setInquiryResult(result);
      setEditableOutboundSubject(result.suggestedSubject);
      setEditableOutboundBody(result.formattedEmailToKgotso);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to process inquiry.';
      setStatusNotice({ type: 'error', text: msg });
    } finally {
      setIsAnalyzingInquiry(false);
    }
  };

  const handleRunEmailAgent = async () => {
    const t = token || (await getWorkspaceAccessToken());
    if (!t) {
      setNeedsAuth(true);
      return;
    }
    setIsRunningAgent(true);
    setStatusNotice(null);
    try {
      const result = await runEmailAutomationAgent(t, {
        instruction: agentInstruction,
        activeRules: activePlaybooks,
        targetMessageIds: selectedMsgIds.length > 0 ? selectedMsgIds : undefined,
      });
      setAgentSummary(result.summary);
      setAgentActions(result.actionsExecuted);
      setStagedDrafts(result.stagedDrafts);
      if (result.scannedEmails.length > 0) {
        setGmailMessages(result.scannedEmails);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Automation agent execution failed.';
      setStatusNotice({ type: 'error', text: msg });
    } finally {
      setIsRunningAgent(false);
    }
  };

  const handleConfirmGmailAction = async () => {
    if (!pendingConfirm) return;
    const t = token || (await getWorkspaceAccessToken());
    if (!t) {
      setNeedsAuth(true);
      setPendingConfirm(null);
      return;
    }

    setIsExecutingGmailAction(true);
    setStatusNotice(null);
    try {
      if (pendingConfirm.mode === 'send') {
        await sendGmailEmail(t, {
          to: pendingConfirm.to,
          subject: pendingConfirm.subject,
          body: pendingConfirm.body,
          threadId: pendingConfirm.threadId || undefined,
          inReplyTo: pendingConfirm.inReplyTo || undefined,
        });
        setStatusNotice({
          type: 'success',
          text: `Email sent via Gmail to ${pendingConfirm.to}.`,
        });
      } else {
        await saveGmailDraft(t, {
          to: pendingConfirm.to,
          subject: pendingConfirm.subject,
          body: pendingConfirm.body,
          threadId: pendingConfirm.threadId || undefined,
          inReplyTo: pendingConfirm.inReplyTo || undefined,
        });
        setStatusNotice({
          type: 'success',
          text: `Draft saved to Gmail for ${pendingConfirm.to}.`,
        });
      }

      if (pendingConfirm.stagedDraftId) {
        setStagedDrafts((prev) =>
          prev.filter((d) => d.draftId !== pendingConfirm.stagedDraftId)
        );
      }
      setPendingConfirm(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gmail action failed.';
      setStatusNotice({ type: 'error', text: msg });
    } finally {
      setIsExecutingGmailAction(false);
    }
  };

  const toggleVoiceDictation = async () => {
    if (isDictating) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsDictating(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatusNotice({ type: 'error', text: 'Microphone is not supported in this browser.' });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        const chunks = audioChunksRef.current;
        const type = recorder.mimeType || 'audio/webm';
        mediaStreamRef.current?.getTracks().forEach((tr) => tr.stop());
        mediaStreamRef.current = null;
        if (chunks.length === 0) return;

        try {
          const base64 = await blobToBase64(new Blob(chunks, { type }));
          const text = await transcribeAudio(base64, type.split(';')[0]);
          if (text) {
            if (activeTab === 'inquiry') {
              setInquiryMessage((prev) => (prev ? `${prev} ${text}` : text));
            } else {
              setAgentInstruction(text);
            }
          }
        } catch {
          setStatusNotice({ type: 'error', text: 'Could not transcribe dictated audio.' });
        }
      };

      setIsDictating(true);
      recorder.start();
    } catch {
      setStatusNotice({ type: 'error', text: 'Microphone permission was denied.' });
    }
  };

  const handlePlayAutomatedReply = async (text: string) => {
    if (isPlayingReply && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingReply(false);
      return;
    }
    try {
      setIsPlayingReply(true);
      const { audioBase64, mimeType } = await synthesizeSpeech(text, 'Kore');
      const audio = new Audio(`data:${mimeType};base64,${audioBase64}`);
      audioRef.current = audio;
      audio.onended = () => setIsPlayingReply(false);
      audio.onerror = () => setIsPlayingReply(false);
      await audio.play();
    } catch {
      setIsPlayingReply(false);
    }
  };

  const togglePlaybook = (label: string) => {
    setActivePlaybooks((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const toggleMsgSelection = (id: string) => {
    setSelectedMsgIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateStagedDraft = (id: string, field: 'to' | 'subject' | 'body', value: string) => {
    setStagedDrafts((prev) =>
      prev.map((d) => (d.draftId === id ? { ...d, [field]: value } : d))
    );
  };

  return (
    <div className="mt-14 pt-12 border-t border-white/10 text-left">
      {/* Section Title + Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/15 border border-indigo-400/30 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2">
            <Bot size={13} /> Agentic AI Email Automation
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Automated Inquiry Triage &amp; Gmail Responder
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Use the AI agent to classify inquiries, generate resume-grounded responses, or connect Gmail to automate inbox replies with explicit approval.
          </p>
        </div>

        <div className="inline-flex p-1 bg-zinc-950/80 border border-white/10 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab('inquiry')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'inquiry'
                ? 'bg-sky-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> Smart Inquiry Agent
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gmail')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'gmail'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Inbox size={14} /> Gmail Automation
          </button>
        </div>
      </div>

      {statusNotice && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
            statusNotice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusNotice.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
            <span>{statusNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* TAB 1: SMART INQUIRY & AUTO-RESPONDER */}
      {activeTab === 'inquiry' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleAnalyzeInquiry}
            className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-sky-300 flex items-center gap-2">
                <Mail size={15} /> Compose or Dictate Inquiry
              </h4>
              <button
                type="button"
                onClick={toggleVoiceDictation}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  isDictating
                    ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                    : 'bg-white/5 border-white/10 text-sky-300 hover:bg-sky-500/15'
                }`}
              >
                {isDictating ? <Square size={12} className="fill-white" /> : <Mic size={12} />}
                <span>{isDictating ? 'Stop Dictation' : 'Voice Dictate'}</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name"
                className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/50"
              />
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Your Email (optional)"
                className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company / Organization"
                className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/50"
              />
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
              >
                <option>Recruitment / Role</option>
                <option>Cloud &amp; AI Architecture</option>
                <option>Certificate Verification</option>
                <option>Hackathon / Collaboration</option>
              </select>
            </div>

            <textarea
              rows={4}
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              placeholder="Describe the role, project, or question (e.g. 'We are hiring a Junior Cloud Engineer with GCP and AI agent experience in Johannesburg...')"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500/50 resize-none"
            />

            <button
              type="submit"
              disabled={isAnalyzingInquiry || !inquiryMessage.trim()}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-600/20"
            >
              {isAnalyzingInquiry ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Running Agentic Triage...
                </>
              ) : (
                <>
                  <Bot size={16} /> Generate Automated Response &amp; Email
                </>
              )}
            </button>
          </form>

          {/* Inquiry Output Panel */}
          <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-5">
            {!inquiryResult ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                  <Sparkles size={24} />
                </div>
                <h4 className="text-base font-bold text-white">AI Response Preview Ready</h4>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Submit or dictate an inquiry on the left. The agent matches your needs against Kgotso’s verified certifications and generates both a clean outbound email and an instant automated reply preview.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-sky-500/15 border border-sky-400/30 rounded-full text-[10px] font-black uppercase tracking-wider text-sky-300">
                      {inquiryResult.category}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      Priority: {inquiryResult.urgency}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1.5">
                      Matched Credentials
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {inquiryResult.matchedCredentials.map((cred, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-semibold text-zinc-200"
                        >
                          {cred}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-400/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                        Automated AI Reply Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayAutomatedReply(inquiryResult.automatedResponseDraft)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white cursor-pointer"
                      >
                        <Volume2 size={11} /> {isPlayingReply ? 'Stop' : 'Listen'}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                      {inquiryResult.automatedResponseDraft}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      Editable Email to phirikg22@gmail.com
                    </div>
                    <input
                      type="text"
                      value={editableOutboundSubject}
                      onChange={(e) => setEditableOutboundSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-sky-500/50"
                    />
                    <textarea
                      rows={4}
                      value={editableOutboundBody}
                      onChange={(e) => setEditableOutboundBody(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-sky-500/50 resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {!needsAuth && token ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingConfirm({
                          mode: 'send',
                          to: 'phirikg22@gmail.com',
                          subject: editableOutboundSubject,
                          body: editableOutboundBody,
                        })
                      }
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send size={14} /> Send via Connected Gmail
                    </button>
                  ) : null}

                  <a
                    href={`mailto:phirikg22@gmail.com?subject=${encodeURIComponent(
                      editableOutboundSubject
                    )}&body=${encodeURIComponent(editableOutboundBody)}`}
                    className="flex-1 py-2.5 px-4 bg-white text-black hover:bg-zinc-200 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink size={14} /> Open in Email Client
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GMAIL AGENTIC AUTOMATION & INBOX RESPONDER */}
      {activeTab === 'gmail' && (
        <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          {needsAuth || !token ? (
            <div className="py-10 flex flex-col items-center text-center space-y-5 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Inbox size={30} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">
                  Connect Gmail for Agentic Email Automation
                </h4>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                  Sign in with Google to allow the AI agent to scan your inbox, classify incoming messages, and stage tailored replies. Every draft or email send requires your explicit confirmation before execution.
                </p>
              </div>

              <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isLoggingIn} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Authenticated Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-sm">
                    {user?.email?.[0]?.toUpperCase() || 'G'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{user?.displayName || 'Connected Gmail Account'}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 rounded-full text-[9px] uppercase font-black">
                        Gmail Active
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => loadInbox()}
                    disabled={isLoadingInbox}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-zinc-200 cursor-pointer"
                  >
                    <RefreshCw size={13} className={isLoadingInbox ? 'animate-spin' : ''} />
                    Refresh Inbox
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-xl text-xs font-bold text-rose-300 cursor-pointer"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>

              {/* Automation Playbooks + Instruction Bar */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="text-[11px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <SlidersHorizontal size={13} className="text-indigo-400" /> Automation Playbooks
                  </div>
                  {AUTOMATION_PLAYBOOKS.map((pb) => {
                    const checked = activePlaybooks.includes(pb.label);
                    return (
                      <label
                        key={pb.id}
                        className={`block p-3 rounded-2xl border cursor-pointer transition-all ${
                          checked
                            ? 'bg-indigo-500/15 border-indigo-400/40'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePlaybook(pb.label)}
                            className="accent-indigo-500 rounded"
                          />
                          <span className="text-xs font-bold text-white">{pb.label}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 pl-6">{pb.description}</p>
                      </label>
                    );
                  })}
                </div>

                {/* Agent Command + Recent Inbox */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-sky-300">
                        Agent Automation Directive
                      </span>
                      <button
                        type="button"
                        onClick={toggleVoiceDictation}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                          isDictating
                            ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                            : 'bg-white/5 border-white/10 text-sky-300 hover:bg-sky-500/15'
                        }`}
                      >
                        {isDictating ? <Square size={10} className="fill-white" /> : <Mic size={10} />}
                        {isDictating ? 'Stop' : 'Speak Instruction'}
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={agentInstruction}
                      onChange={(e) => setAgentInstruction(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 resize-none"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] text-zinc-400">
                        {selectedMsgIds.length > 0
                          ? `Targeting ${selectedMsgIds.length} selected email(s)`
                          : 'Autonomous mode: scans latest inbox messages'}
                      </span>
                      <button
                        type="button"
                        onClick={handleRunEmailAgent}
                        disabled={isRunningAgent}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
                      >
                        {isRunningAgent ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Agent Working...
                          </>
                        ) : (
                          <>
                            <Bot size={14} /> Run Email Automation Agent
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Inbox Message Picker */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                        Recent Gmail Inbox ({gmailMessages.length})
                      </span>
                      {selectedMsgIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedMsgIds([])}
                          className="text-[10px] font-bold text-sky-400 hover:text-sky-300 cursor-pointer"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>

                    {isLoadingInbox ? (
                      <div className="p-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                        <Loader2 size={15} className="animate-spin text-sky-400" /> Loading Gmail messages...
                      </div>
                    ) : gmailMessages.length === 0 ? (
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-zinc-500">
                        Click &ldquo;Refresh Inbox&rdquo; or run the automation agent to scan recent messages.
                      </div>
                    ) : (
                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                        {gmailMessages.map((msg) => {
                          const selected = selectedMsgIds.includes(msg.id);
                          return (
                            <div
                              key={msg.id}
                              onClick={() => toggleMsgSelection(msg.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                selected
                                  ? 'bg-sky-500/15 border-sky-400/40'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => {}}
                                    className="accent-sky-500 shrink-0"
                                  />
                                  <span className="text-xs font-bold text-white truncate">
                                    {msg.subject}
                                  </span>
                                  {msg.isUnread && (
                                    <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-300 rounded text-[9px] font-black uppercase shrink-0">
                                      Unread
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-zinc-500 shrink-0">
                                  {msg.from.split('<')[0].trim()}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 truncate mt-1 pl-6">
                                {msg.snippet}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Agent Executive Summary & Staged Drafts */}
              {agentSummary && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/25 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <Sparkles size={12} /> Agent Execution Summary
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                      {agentSummary}
                    </p>
                    {agentActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {agentActions.map((act, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] text-zinc-300"
                          >
                            {act.detail}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {stagedDrafts.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="text-xs font-black uppercase tracking-wider text-sky-300">
                        Staged Email Responses Awaiting Your Confirmation ({stagedDrafts.length})
                      </h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        {stagedDrafts.map((draft) => (
                          <div
                            key={draft.draftId}
                            className="p-5 rounded-2xl bg-zinc-900/80 border border-white/15 space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="px-2.5 py-0.5 bg-sky-500/15 border border-sky-400/30 text-sky-300 rounded-full text-[10px] font-black uppercase">
                                  {draft.category}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-400">
                                  Rule: {draft.ruleApplied}
                                </span>
                              </div>

                              <p className="text-[11px] text-zinc-400 italic">{draft.reasoning}</p>

                              <div className="space-y-1.5">
                                <input
                                  type="text"
                                  value={draft.to}
                                  onChange={(e) =>
                                    updateStagedDraft(draft.draftId, 'to', e.target.value)
                                  }
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                                  placeholder="Recipient"
                                />
                                <input
                                  type="text"
                                  value={draft.subject}
                                  onChange={(e) =>
                                    updateStagedDraft(draft.draftId, 'subject', e.target.value)
                                  }
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white"
                                  placeholder="Subject"
                                />
                                <textarea
                                  rows={5}
                                  value={draft.body}
                                  onChange={(e) =>
                                    updateStagedDraft(draft.draftId, 'body', e.target.value)
                                  }
                                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-200 resize-none"
                                />
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setPendingConfirm({
                                    mode: 'send',
                                    to: draft.to,
                                    subject: draft.subject,
                                    body: draft.body,
                                    threadId: draft.threadId,
                                    inReplyTo: draft.inReplyTo,
                                    stagedDraftId: draft.draftId,
                                  })
                                }
                                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Send size={12} /> Send Reply
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setPendingConfirm({
                                    mode: 'draft',
                                    to: draft.to,
                                    subject: draft.subject,
                                    body: draft.body,
                                    threadId: draft.threadId,
                                    inReplyTo: draft.inReplyTo,
                                    stagedDraftId: draft.draftId,
                                  })
                                }
                                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <FileEdit size={12} /> Save Draft
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MANDATORY EXPLICIT USER CONFIRMATION MODAL FOR GMAIL MUTATIONS */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">
                    {pendingConfirm.mode === 'send'
                      ? 'Confirm Sending Email via Gmail?'
                      : 'Confirm Saving Draft in Gmail?'}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {pendingConfirm.mode === 'send'
                      ? 'This will transmit an email directly from your connected Gmail account.'
                      : 'This will create a new draft message in your Gmail account.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
              <div>
                <span className="text-zinc-500 font-bold uppercase text-[10px]">To: </span>
                <span className="text-white font-semibold">{pendingConfirm.to}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold uppercase text-[10px]">Subject: </span>
                <span className="text-white font-semibold">{pendingConfirm.subject}</span>
              </div>
              {pendingConfirm.threadId && (
                <div>
                  <span className="text-zinc-500 font-bold uppercase text-[10px]">Thread Reply ID: </span>
                  <span className="text-sky-300 font-mono">{pendingConfirm.threadId}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10 text-zinc-300 whitespace-pre-wrap max-h-44 overflow-y-auto">
                {pendingConfirm.body}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                disabled={isExecutingGmailAction}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmGmailAction}
                disabled={isExecutingGmailAction}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer ${
                  pendingConfirm.mode === 'send'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {isExecutingGmailAction ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : pendingConfirm.mode === 'send' ? (
                  <Send size={14} />
                ) : (
                  <FileEdit size={14} />
                )}
                <span>
                  {pendingConfirm.mode === 'send'
                    ? 'Confirm & Send Email'
                    : 'Confirm & Save Draft'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAutomationHub;
