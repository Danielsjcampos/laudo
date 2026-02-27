import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '../../../types/auth';
import { Doctor, Exam, Clinic } from '../../../data/mockData';
import { SearchIcon } from '../../icons/SearchIcon';
import api from '../../../lib/api';

interface Message {
  id: string;
  senderId: string;
  recipientId?: string; // Added for API consistency
  content: string;
  timestamp: Date;
  isRead?: boolean;
  readAt?: Date;
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
  const [activeTab, setActiveTab] = useState<'ativos' | 'historico'>('ativos');
  const [archivedUserIds, setArchivedUserIds] = useState<string[]>([]);

  // Persist messages across conversation switches using a ref-backed state
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Track previous conversation to clean up polling
  const selectedConvRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch contacts and archives API
  useEffect(() => {
    if (!currentActorId) return;

    const initData = async () => {
      try {
        const [contactsRes, archivesRes] = await Promise.all([
          api.get('/messages/contacts'),
          api.get(`/messages/archives?userId=${currentActorId}`)
        ]);

        const { clinics = [], doctors = [] } = contactsRes.data;
        const allParticipants: ChatParticipant[] = [...doctors, ...clinics];
        const archivedIds: string[] = archivesRes.data || [];
        
        setArchivedUserIds(archivedIds);

        const newConversations: Conversation[] = allParticipants
          .filter(p => p && p.id && p.id !== currentActorId)
          .map(p => ({
            id: `conv_${[currentActorId, p.id].sort().join('_')}`,
            participantId: p.id,
            participantName: p.name || 'Usuário',
            participantRole: 'crm' in p ? 'doctor' : 'clinic',
            participantAvatar: undefined,
            lastMessage: '',
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

        // Fetch unread counts after setting up conversations
        try {
          const countsRes = await api.get('/messages/unread', { params: { userId: currentActorId } });
          const counts = countsRes.data;
          setConversations(prev => prev.map(conv => ({
             ...conv,
             unreadCount: counts[conv.participantId] || 0
          })));
        } catch (err) {
           console.error('Failed to load unread counts', err);
        }

      } catch (err) {
        console.error('Falha ao carregar contatos ou arquivos', err);
      }
    };
    initData();

    // Poll unread counts globally every 10s
    const unreadInterval = setInterval(async () => {
       try {
          const countsRes = await api.get('/messages/unread', { params: { userId: currentActorId } });
          const counts = countsRes.data;
          setConversations(prev => prev.map(conv => ({
             ...conv,
             unreadCount: counts[conv.participantId] || 0
          })));
       } catch (err) {}
    }, 10000);

    return () => clearInterval(unreadInterval);
  }, [currentActorId, initialDoctorId]);

  // Handle auto-inject message from initial exam context
  useEffect(() => {
    if (initialExamId && selectedConversationId && currentMessages.length === 0) {
      const participantId = conversations.find(c => c.id === selectedConversationId)?.participantId;
      if (participantId && !selectedConvRef.current /* avoid duplicate send */) {
        // We will just populate the text area instead of auto sending immediately, or auto-send.
        setMessageText(`Olá, gostaria de falar sobre o exame (ID: ${initialExamId})`);
      }
    }
  }, [initialExamId, selectedConversationId, conversations, currentMessages]);

  const fetchMessages = useCallback(async (convId: string, participantId: string) => {
    try {
      const response = await api.get('/messages', {
        params: { user1: currentActorId, user2: participantId }
      });
      
      const mappedMessages: Message[] = response.data.map((m: any) => ({
        id: m.id,
        senderId: String(m.senderId), // Force string comparison consistency
        recipientId: String(m.recipientId),
        content: m.content,
        timestamp: new Date(m.timestamp),
        isRead: m.isRead,
        readAt: m.readAt ? new Date(m.readAt) : undefined,
        attachment: m.examId ? {
          type: 'exam',
          examId: m.examId,
          examName: m.examName
        } : undefined
      }));

      setCurrentMessages(mappedMessages);

      // Tell the server we read these messages if any are unread and we are the recipient
      const hasUnreadFromSender = mappedMessages.some(m => !m.isRead && String(m.senderId) === participantId);
      if (hasUnreadFromSender) {
         try {
           await api.post('/messages/read', { senderId: participantId, recipientId: currentActorId });
           // Re-fetch to update local state with read status, or mutate local state to avoid extra hop
           setCurrentMessages(prev => prev.map(m => (!m.isRead && String(m.senderId) === participantId) ? { ...m, isRead: true, readAt: new Date() } : m));
           setConversations(prev => prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c));
         } catch (e) {
           console.error('Failed to mark as read', e);
         }
      }

      // Update the last message in the conversation list dynamically
      if (mappedMessages.length > 0) {
        setConversations(prev => prev.map(conv => {
          if (conv.id === convId) {
            const lastMsg = mappedMessages[mappedMessages.length - 1];
            return {
              ...conv,
              lastMessage: lastMsg.content,
              updatedAt: lastMsg.timestamp
            };
          }
          return conv;
        }));
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [currentActorId]);

  // Load messages and start polling when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      const participantId = conversations.find(c => c.id === selectedConversationId)?.participantId;
      if (!participantId) return;

      selectedConvRef.current = selectedConversationId;
      
      // Initial fetch
      fetchMessages(selectedConversationId, participantId);
      
      // Polling for new messages
      const interval = setInterval(() => {
        if (selectedConvRef.current === selectedConversationId) {
          fetchMessages(selectedConversationId, participantId);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedConversationId, conversations, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId) return;
    
    const participantId = conversations.find(c => c.id === selectedConversationId)?.participantId;
    if (!participantId) return;

    try {
      const response = await api.post('/messages', {
        senderId: currentActorId,
        recipientId: participantId,
        content: messageText
      });

      const newMessage: Message = {
        id: response.data.id,
        senderId: response.data.senderId,
        recipientId: response.data.recipientId,
        content: response.data.content,
        timestamp: new Date(response.data.timestamp)
      };

      setCurrentMessages(prev => [...prev, newMessage]);
      setMessageText('');
      textareaRef.current?.focus();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleAttachExam = async (exam: Exam) => {
    if (!selectedConversationId) return;
    
    const participantId = conversations.find(c => c.id === selectedConversationId)?.participantId;
    if (!participantId) return;

    try {
      const response = await api.post('/messages', {
        senderId: currentActorId,
        recipientId: participantId,
        content: `Compartilhei o exame: ${exam.examType} — ${exam.patientName}`,
        examId: exam.id,
        examName: `${exam.examType} - ${exam.patientName}`
      });

      const newMessage: Message = {
        id: response.data.id,
        senderId: response.data.senderId,
        recipientId: response.data.recipientId,
        content: response.data.content,
        timestamp: new Date(response.data.timestamp),
        attachment: {
          type: 'exam',
          examId: exam.id,
          examName: `${exam.examType} - ${exam.patientName}`
        }
      };

      setCurrentMessages(prev => [...prev, newMessage]);
      setIsExamSelectorOpen(false);
    } catch (err) {
      console.error('Failed to attach exam:', err);
    }
  };

  const handleArchiveConversation = async () => {
    if (!selectedConversationId) return;
    const participantId = conversations.find(c => c.id === selectedConversationId)?.participantId;
    if (!participantId) return;

    try {
      await api.post('/messages/archive', {
        userId: currentActorId,
        peerId: participantId
      });
      setArchivedUserIds(prev => [...prev, participantId]);
      setSelectedConversationId(null);
    } catch (err) {
      console.error('Failed to archive:', err);
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    const isArchived = archivedUserIds.includes(c.participantId);
    const matchesTab = activeTab === 'ativos' ? !isArchived : isArchived;
    return matchesSearch && matchesTab;
  });

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

          {/* Abas */}
          <div className="flex px-5 mt-4 border-b" style={{ borderColor: 'var(--surface-border)' }}>
            <button
              onClick={() => setActiveTab('ativos')}
              className={`pb-2 px-2 mr-4 text-[13px] font-bold transition-colors ${activeTab === 'ativos' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Ativos
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`pb-2 px-2 text-[13px] font-bold transition-colors ${activeTab === 'historico' ? 'text-teal-500 border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Histórico
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => {
            const isActive = selectedConversationId === conv.id;
            const hasMessages = currentMessages.length > 0 && selectedConversationId === conv.id;
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
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-[11px] truncate ${conv.unreadCount > 0 && !isActive ? 'font-bold text-gray-800' : ''}`} style={{ color: (conv.unreadCount > 0 && !isActive) ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                       {conv.lastMessage || 'Nenhuma mensagem ainda'}
                      </p>
                      {conv.unreadCount > 0 && !isActive && (
                         <div className="w-4 h-4 shrink-0 rounded-full bg-teal-500 text-white flex items-center justify-center text-[9px] font-black shadow-sm">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                         </div>
                      )}
                    </div>
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

              <div className="flex items-center">
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
                  
                <button
                  onClick={handleArchiveConversation}
                  className="p-2 ml-2 rounded-xl text-xs font-bold transition-all hover:bg-red-50 text-red-500 border border-red-100 hidden md:block"
                >
                  Finalizar
                </button>
              </div>
            </header>

            {/* Messages Area — WhatsApp/Instagram Style */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f0f2f5]/30 custom-scrollbar">
              {currentMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 opacity-40">
                  <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm font-bold">Inicie sua conversa</p>
                </div>
              )}

              {currentMessages.map((msg, index) => {
                const isMe = String(msg.senderId) === String(currentActorId);
                const showAvatar = !isMe && (index === 0 || currentMessages[index - 1].senderId !== msg.senderId);
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                      {!isMe && (
                        <div className={`w-7 h-7 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-500 mb-1 shadow-sm border border-white ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                          {selectedConversation?.participantName.charAt(0)}
                        </div>
                      )}
                      
                      <div
                        className={`relative rounded-2xl px-4 py-2.5 shadow-sm ${
                          isMe 
                            ? 'bg-brand-blue-600 text-white rounded-br-sm' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {/* Exam Attachment */}
                        {msg.attachment && msg.attachment.type === 'exam' && (
                          <div
                            className={`mb-2.5 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border ${
                              isMe 
                                ? 'bg-white/15 border-white/20 hover:bg-white/25' 
                                : 'bg-blue-50 border-blue-100 hover:bg-blue-100'
                            }`}
                            onClick={() => {
                                // Here we could open the exam detail if we had the callback, 
                                // for now we show a toast or message
                            }}
                          >
                            <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-brand-blue-500/10'}`}>
                              <svg className={`w-3.5 h-3.5 ${isMe ? 'text-white' : 'text-brand-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="text-left overflow-hidden">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-white/70' : 'text-brand-blue-500'}`}>Exame Anexo</p>
                              <p className="text-xs font-black truncate max-w-[140px]">{msg.attachment.examName}</p>
                            </div>
                          </div>
                        )}

                        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                          <span className="text-[9.5px] font-bold uppercase tracking-wide">
                            {formatTime(msg.timestamp)}
                          </span>
                          {isMe && (
                            <svg className={`w-3.5 h-3.5 fill-current mb-0.5 ${msg.isRead ? 'text-blue-300' : 'text-white/50'}`} viewBox="0 0 16 16">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                <path d="M13.854 3.646l-7 7L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0zm-5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l4.646-4.647a.5.5 0 0 1 .708 0z" />
                            </svg>
                          )}
                        </div>
                      </div>
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
