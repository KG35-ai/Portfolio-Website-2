import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Mail,
  Loader2,
  AudioLines,
} from 'lucide-react';
import {
  sendChatMessage,
  transcribeAudio,
  synthesizeSpeech,
  type ChatEmailDraft,
} from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  emailDraft?: ChatEmailDraft | null;
}

interface ChatBotProps {
  onApplyEmailDraft?: (draft: ChatEmailDraft) => void;
}

const VOICE_OPTIONS = [
  { id: 'Kore', label: 'Kore (Balanced)' },
  { id: 'Zephyr', label: 'Zephyr (Warm)' },
  { id: 'Puck', label: 'Puck (Energetic)' },
  { id: 'Charon', label: 'Charon (Deep)' },
  { id: 'Fenrir', label: 'Fenrir (Bold)' },
];

const QUICK_PROMPTS = [
  'Summarize Kgotso’s cloud & AI skills',
  'Tell me about Diketo & ACE CLI',
  'Draft a hiring inquiry email to Kgotso',
];

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const ChatBot: React.FC<ChatBotProps> = ({ onApplyEmailDraft }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi! I'm Kgotso's voice-enabled AI assistant. Ask me anything by text or microphone, or ask me to draft an email inquiry.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice Input & Output state
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      stopAudioPlayback();
      cleanupRecorder();
    };
  }, []);

  const stopAudioPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
      audioPlayerRef.current = null;
    }
    setSpeakingMessageId(null);
  };

  const cleanupRecorder = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  };

  const playMessageAudio = async (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      stopAudioPlayback();
      return;
    }

    stopAudioPlayback();
    setVoiceError(null);
    setLoadingAudioId(messageId);

    try {
      const { audioBase64, mimeType } = await synthesizeSpeech(text, selectedVoice);
      const audio = new Audio(`data:${mimeType};base64,${audioBase64}`);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setSpeakingMessageId(null);
        audioPlayerRef.current = null;
      };
      audio.onerror = () => {
        setSpeakingMessageId(null);
        audioPlayerRef.current = null;
      };

      setLoadingAudioId(null);
      setSpeakingMessageId(messageId);
      await audio.play();
    } catch (err) {
      console.error('TTS playback error:', err);
      setLoadingAudioId(null);
      setSpeakingMessageId(null);
      setVoiceError('Unable to play voice audio right now.');
    }
  };

  const submitPrompt = async (promptText: string, shouldSpeakReply: boolean) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    setVoiceError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
    };

    const historySnapshot = messages.map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await sendChatMessage(trimmed, historySnapshot);
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        sender: 'ai',
        text: result.text,
        emailDraft: result.emailDraft ?? null,
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (shouldSpeakReply && result.text) {
        void playMessageAudio(aiMessageId, result.text);
      }
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "I'm sorry, I'm having trouble connecting right now. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: errMsg,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await submitPrompt(input, autoSpeak);
  };

  const toggleRecording = async () => {
    setVoiceError(null);

    if (isRecording) {
      // Stop recording and trigger transcription
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      return;
    }

    stopAudioPlayback();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceError('Microphone recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const chunks = audioChunksRef.current;
        const recordedType = recorder.mimeType || 'audio/webm';
        cleanupRecorder();

        if (chunks.length === 0) return;

        const audioBlob = new Blob(chunks, { type: recordedType });
        if (audioBlob.size < 200) return;

        setIsTranscribing(true);
        try {
          const base64 = await blobToBase64(audioBlob);
          const cleanMime = recordedType.split(';')[0];
          const transcript = await transcribeAudio(base64, cleanMime);
          if (transcript) {
            await submitPrompt(transcript, true);
          } else {
            setVoiceError('Could not detect speech. Please try speaking clearly.');
          }
        } catch (err) {
          console.error('Transcription error:', err);
          setVoiceError('Voice transcription failed. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
      };

      setRecordingSeconds(0);
      setIsRecording(true);
      recorder.start();

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      cleanupRecorder();
      setIsRecording(false);
      setVoiceError('Microphone access was denied. Enable mic permissions to use voice.');
    }
  };

  const handleOpenDraftInStudio = (draft: ChatEmailDraft) => {
    if (onApplyEmailDraft) {
      onApplyEmailDraft(draft);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-3.5 bg-zinc-800/50 border-b border-white/10 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
                  <Bot size={18} className="text-sky-400" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
              </div>
              <div>
                <span className="font-bold text-sm text-zinc-100 block leading-tight">
                  Kgotso Voice AI
                </span>
                <span className="text-[10px] text-sky-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <AudioLines size={10} />
                  {speakingMessageId
                    ? 'Speaking...'
                    : isRecording
                      ? `Listening (${recordingSeconds}s)`
                      : 'Voice + Agentic Chat'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                title="Select AI Voice"
                className="bg-zinc-900/80 border border-white/10 text-[10px] font-semibold text-zinc-300 rounded-lg px-2 py-1 focus:outline-none focus:border-sky-500/50"
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  if (autoSpeak) stopAudioPlayback();
                  setAutoSpeak(!autoSpeak);
                }}
                title={autoSpeak ? 'Mute auto-speak' : 'Enable auto-speak'}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  autoSpeak
                    ? 'bg-sky-500/15 border-sky-400/30 text-sky-300'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {autoSpeak ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAudioPlayback();
                  setIsOpen(false);
                }}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-900/20'
                      : 'bg-white/[0.06] text-zinc-200 rounded-bl-none border border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <div className="flex items-center gap-1.5 opacity-60 text-[10px] uppercase font-bold tracking-wider">
                      {msg.sender === 'user' ? <User size={10} /> : <Sparkles size={10} className="text-sky-400" />}
                      <span>{msg.sender === 'user' ? 'You' : 'Kgotso AI'}</span>
                    </div>

                    {msg.sender === 'ai' && msg.text && (
                      <button
                        type="button"
                        onClick={() => playMessageAudio(msg.id, msg.text)}
                        disabled={loadingAudioId === msg.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                          speakingMessageId === msg.id
                            ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40'
                            : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                        title={speakingMessageId === msg.id ? 'Stop speaking' : 'Listen to response'}
                      >
                        {loadingAudioId === msg.id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : speakingMessageId === msg.id ? (
                          <Square size={9} className="fill-current" />
                        ) : (
                          <Volume2 size={10} />
                        )}
                        <span>
                          {loadingAudioId === msg.id
                            ? 'Loading'
                            : speakingMessageId === msg.id
                              ? 'Stop'
                              : 'Listen'}
                        </span>
                      </button>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Agentic Email Draft Card */}
                  {msg.emailDraft && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-sky-500/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-sky-300 font-bold text-[10px] uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} /> Staged Email Draft
                        </span>
                        <span className="px-2 py-0.5 bg-sky-500/15 rounded-full">
                          {msg.emailDraft.category}
                        </span>
                      </div>
                      <div className="text-zinc-300">
                        <span className="text-zinc-500">To:</span> {msg.emailDraft.to}
                      </div>
                      <div className="text-zinc-200 font-semibold">
                        <span className="text-zinc-500 font-normal">Subject:</span>{' '}
                        {msg.emailDraft.subject}
                      </div>
                      <div className="text-zinc-400 text-[11px] bg-white/[0.03] p-2 rounded-lg border border-white/5 max-h-24 overflow-y-auto whitespace-pre-wrap">
                        {msg.emailDraft.body}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenDraftInStudio(msg.emailDraft!)}
                          className="flex-1 py-1.5 px-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Review in Email Studio
                        </button>
                        <a
                          href={`mailto:${encodeURIComponent(msg.emailDraft.to)}?subject=${encodeURIComponent(msg.emailDraft.subject)}&body=${encodeURIComponent(msg.emailDraft.body)}`}
                          className="py-1.5 px-2.5 bg-white/10 hover:bg-white/20 text-zinc-200 rounded-lg font-bold text-[11px] transition-colors"
                        >
                          Mail App
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(isLoading || isTranscribing) && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-xs text-zinc-300">
                  <Loader2 size={14} className="animate-spin text-sky-400" />
                  <span>{isTranscribing ? 'Transcribing voice input...' : 'Thinking...'}</span>
                </div>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => submitPrompt(q, autoSpeak)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-400/30 text-zinc-300 hover:text-sky-200 transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {voiceError && (
            <div className="px-4 py-2 bg-rose-500/15 border-t border-rose-500/30 text-[11px] text-rose-300 flex items-center justify-between">
              <span>{voiceError}</span>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-rose-200 hover:text-white ml-2 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Input + Voice Controls */}
          <form
            onSubmit={handleSend}
            className="p-3.5 bg-zinc-800/30 border-t border-white/10 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading || isTranscribing}
              title={isRecording ? 'Stop recording and send' : 'Speak your question'}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white animate-pulse shadow-lg shadow-rose-600/30'
                  : 'bg-white/5 hover:bg-sky-500/20 border-white/10 hover:border-sky-400/40 text-sky-300'
              } disabled:opacity-40`}
            >
              {isRecording ? <Square size={17} className="fill-white" /> : <Mic size={17} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? `Recording voice (${recordingSeconds}s)...` : 'Ask by typing or mic...'}
              disabled={isRecording || isTranscribing}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-sky-500/50 text-white placeholder-zinc-500 transition-all disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={isLoading || isTranscribing || isRecording || !input.trim()}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-lg shadow-sky-900/20 active:scale-95 cursor-pointer shrink-0"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Voice AI Assistant"
        className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-zinc-900 flex items-center justify-center">
            <Mic size={8} className="text-zinc-950" />
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
