import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '../../../types/auth';
import { Doctor, Exam, Clinic } from '../../../data/mockData';
import { SearchIcon } from '../../icons/SearchIcon';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  attachment?: {
    type: 'exam';
    examId: string;
    examName: string;
  };
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'doctor' | 'clinic';
  participantAvatar?: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: Date;
}

type ChatParticipant = Doctor | Clinic;

interface DoctorChatProps {
  currentUser: User;
  currentActorId: string;
  doctors: Doctor[];
  otherParticipants?: ChatParticipant[];
  exams: Exam[];
  initialDoctorId?: string;
  initialExamId?: string;
  onClose?: () => void;
}

// Seed messages for demo
const SEED_MESSAGES: Record<string, Message[]> = {};

export const DoctorChat: React.FC<DoctorChatProps> = ({
  currentUser,
  currentActorId,
  doctors,
  otherParticipants,
  exams,
  initialDoctorId,
  initialExamId,
}) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExamSelectorOpen, setIsExamSelectorOpen] = useState(false);

  // Persist messages across conversation switches using a ref-backed state
  const messagesStoreRef = useRef<Record<string, Message[]>>({ ...SEED_MESSAGES });
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Initialize conversations
  useEffect(() => {
    const allParticipants: ChatParticipant[] = [...doctors, ...(otherParticipants || [])];

    const newConversations: Conversation[] = allParticipants
      .filter(p => p.id !== currentActorId)
      .map(p => ({
        id: `conv_${[currentActorId, p.id].sort().join('_')}`,
        participantId: p.id,
        participantName: p.name,
        participantRole: 'crm' in p ? 'doctor' : 'clinic',
        participantAvatar: ('avatarUrl' in p ? p.avatarUrl : undefined) as string | undefined,
        lastMessage: messagesStoreRef.current[`conv_${[currentActorId, p.id].sort().join('_')}`]?.slice(-1)[0]?.content || '',
        unreadCount: 0,
        updatedAt: new Date(),
      }));

    if (initialDoctorId) {
      const targetConv = newConversations.find(c => c.participantId === initialDoctorId);
      if (targetConv) {
        setSelectedConversationId(targetConv.id);
      }
    }

    setConversations(newConversations);
  }, [doctors, otherParticipants, currentActorId, initialDoctorId]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      const stored = messagesStoreRef.current[selectedConversationId] || [];

      // If entering with exam context, add context message if not already there
      if (initialExamId && selectedConversationId.includes(initialDoctorId || '')) {
        const exam = exams.find(e => e.id === initialExamId);
        if (exam && !stored.some(m => m.attachment?.examId === initialExamId)) {
          const contextMsg: Message = {
            id: `m_ctx_${Date.now()}`,
            senderId: currentActorId,
            content: `Olá, gostaria de falar sobre o exame de ${exam.examType} do(a) paciente ${exam.patientName}.`,
            timestamp: new Date(),
            attachment: {
              type: 'exam',
              examId: exam.id,
              examName: `${exam.examType} - ${exam.patientName}`,
            },
          };
          stored.push(contextMsg);
          messagesStoreRef.current[selectedConversationId] = stored;
        }
      }

      setCurrentMessages([...stored]);
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedConversationId, initialExamId, exams, currentActorId, initialDoctorId, scrollToBottom]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversationId) return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: currentActorId,
      content: messageText,
      timestamp: new Date(),
    };

    const updated = [...(messagesStoreRef.current[selectedConversationId] || []), newMessage];
    messagesStoreRef.current[selectedConversationId] = updated;
    setCurrentMessages([...updated]);

    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversationId
          ? { ...c, lastMessage: messageText, updatedAt: new Date() }
          : c
      )
    );

    setMessageText('');
    textareaRef.current?.focus();
  };

  const handleAttachExam = (exam: Exam) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: currentActorId,
      content: `Compartilhei o exame: ${exam.examType} — ${exam.patientName}`,
      timestamp: new Date(),
      attachment: {
        type: 'exam',
        examId: exam.id,
        examName: `${exam.examType} - ${exam.patientName}`,
      },
    };

    const updated = [...(messagesStoreRef.current[selectedConversationId] || []), newMessage];
    messagesStoreRef.current[selectedConversationId] = updated;
    setCurrentMessages([...updated]);
    setIsExamSelectorOpen(false);
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const filteredConversations = conversations.filter(c =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-[calc(100vh-120px)] rounded-2xl overflow-hidden shadow-xl border" style={{ borderColor: 'var(--surface-border)', backgroundColor: 'var(--surface-bg)' }}>

      {/* ─── Sidebar: Lista de Conversas ─── */}
      <aside
        className={`${selectedConversationId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[320px] border-r shrink-0`}
        style={{ borderColor: 'var(--surface-border)', backgroundColor: 'var(--surface-bg)' }}
      >
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--surface-border)' }}>
          <h2 className="font-black text-lg tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Chat
          </h2>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar contato..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
              style={{
                backgroundColor: 'var(--input-bg, rgba(0,0,0,0.04))',
                color: 'var(--text-primary)',
                border: '1px solid var(--surface-border)',
              }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => {
            const isActive = selectedConversationId === conv.id;
            const hasMessages = (messagesStoreRef.current[conv.id]?.length || 0) > 0;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className="w-full text-left p-4 transition-all duration-200 border-b relative group"
                style={{
                  borderColor: 'var(--surface-border)',
                  backgroundColor: isActive ? 'var(--teal-500-10, rgba(20,184,166,0.08))' : 'transparent',
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full"
                    style={{ backgroundColor: 'var(--teal-500)' }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                    style={{
                      backgroundColor: isActive ? 'var(--teal-500)' : 'var(--surface-border)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {conv.participantName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3
                        className="text-[13px] font-bold truncate"
                        style={{ color: isActive ? 'var(--teal-500)' : 'var(--text-primary)' }}
                      >
                        {conv.participantName}
                      </h3>
                      <span className="text-[10px] font-medium shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
                        {formatTime(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {hasMessages
                        ? messagesStoreRef.current[conv.id]!.slice(-1)[0].content
                        : 'Nenhuma mensagem ainda'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ─── Main Chat Area ─── */}
      <main className={`${!selectedConversationId ? 'hidden md:flex' : 'flex'} flex-col flex-1 relative`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <header
              className="px-6 py-4 border-b flex justify-between items-center shrink-0"
              style={{ borderColor: 'var(--surface-border)', backgroundColor: 'var(--surface-bg)' }}
            >
              <div className="flex items-center gap-4">
                {/* Back button mobile */}
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="md:hidden p-2 -ml-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                  style={{ backgroundColor: 'var(--teal-500)', color: '#fff' }}
                >
                  {selectedConversation.participantName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {selectedConversation.participantName}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Attach exam button */}
              <div className="relative">
                <button
                  onClick={() => setIsExamSelectorOpen(!isExamSelectorOpen)}
                  className="p-2.5 rounded-xl transition-all hover:scale-105"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--input-bg, rgba(0,0,0,0.04))' }}
                  title="Anexar Exame"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Exam Selector Popover */}
                {isExamSelectorOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-80 rounded-2xl shadow-2xl max-h-72 overflow-y-auto z-20 animate-in fade-in slide-in-from-top-2"
                    style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--surface-border)' }}
                  >
                    <div className="p-3 border-b text-[10px] font-black uppercase tracking-widest" style={{ borderColor: 'var(--surface-border)', color: 'var(--text-muted)' }}>
                      Selecionar Exame
                    </div>
                    {exams.map(exam => (
                      <button
                        key={exam.id}
                        onClick={() => handleAttachExam(exam)}
                        className="w-full text-left p-3 transition-colors border-b last:border-0"
                        style={{ borderColor: 'var(--surface-border)' }}
                      >
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{exam.examType}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {exam.patientName} — {new Date(exam.dateRequested).toLocaleDateString('pt-BR')}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: 'var(--page-bg, #f8fafc)' }}>
              {currentMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Inicie a conversa</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Envie a primeira mensagem</p>
                </div>
              )}

              {currentMessages.map(msg => {
                const isMe = msg.senderId === currentActorId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm ${
                        isMe ? 'rounded-br-md' : 'rounded-bl-md'
                      }`}
                      style={{
                        backgroundColor: isMe ? 'var(--teal-500)' : 'var(--surface-bg)',
                        color: isMe ? '#fff' : 'var(--text-primary)',
                        border: isMe ? 'none' : '1px solid var(--surface-border)',
                      }}
                    >
                      {/* Exam Attachment */}
                      {msg.attachment && msg.attachment.type === 'exam' && (
                        <div
                          className="mb-3 p-3 rounded-xl flex items-center gap-3"
                          style={{
                            backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.03)',
                          }}
                        >
                          <div className="p-2 rounded-lg" style={{ backgroundColor: isMe ? 'rgba(255,255,255,0.2)' : 'var(--teal-500-10, rgba(20,184,166,0.1))' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: isMe ? '#fff' : 'var(--teal-500)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Exame Anexado</p>
                            <p className="text-xs font-bold truncate">{msg.attachment.examName}</p>
                          </div>
                        </div>
                      )}

                      <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className="text-[10px] mt-2 text-right font-medium"
                        style={{ opacity: 0.6 }}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--surface-border)', backgroundColor: 'var(--surface-bg)' }}>
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    className="w-full px-5 py-3.5 rounded-2xl text-sm font-medium outline-none resize-none max-h-32 min-h-[48px] transition-all"
                    style={{
                      backgroundColor: 'var(--input-bg, rgba(0,0,0,0.04))',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--surface-border)',
                    }}
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 shrink-0 shadow-lg"
                  style={{
                    backgroundColor: messageText.trim() ? 'var(--teal-500)' : 'var(--surface-border)',
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'var(--input-bg, rgba(0,0,0,0.04))' }}
            >
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-black mb-2" style={{ color: 'var(--text-primary)' }}>
              Selecione uma conversa
            </h3>
            <p className="max-w-xs text-sm" style={{ color: 'var(--text-muted)' }}>
              Escolha um contato ao lado para iniciar o chat ou discutir um caso clínico.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
