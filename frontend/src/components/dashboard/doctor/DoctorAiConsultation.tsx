
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button } from '../../ui/Button';
import { BrainIcon } from '../../icons/BrainIcon';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { useToast } from '../../../contexts/ToastContext';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const DoctorAiConsultation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Olá, Doutor. Sou seu assistente clínico de IA. Como posso ajudar com este caso hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 'KEY_NOT_CONFIGURED';
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: userMessage,
        config: {
          systemInstruction: `Você é um consultor médico sênior do sistema LaudoDigital. 
          Sua tarefa é auxiliar outros médicos em dúvidas clínicas, interpretação técnica de exames e orientações sobre o sistema. 
          Responda sempre de forma profissional, ética e baseada em evidências.`,
          temperature: 0.3,
        }
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.text || '...' }]);
    } catch (error) {
      addToast('Erro na conexão com IA.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden h-[calc(100vh-80px)] md:h-[calc(100vh-160px)]">
      <div className="bg-brand-blue-600 p-5 md:p-6 text-white flex items-center shrink-0">
        <BrainIcon className="h-8 w-8 mr-3" />
        <div>
          <h1 className="text-lg md:text-xl font-black uppercase tracking-tight">AI Clinical Consult</h1>
          <p className="text-brand-blue-100 text-[10px] uppercase font-bold tracking-widest">Medical Support v3.0</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[80%] p-4 rounded-3xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-brand-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              <div className="text-sm leading-relaxed">{m.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-gray-100 flex items-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-brand-blue-600 rounded-full animate-bounce mr-1"></div>
              <div className="w-1.5 h-1.5 bg-brand-blue-600 rounded-full animate-bounce mr-1 delay-75"></div>
              <div className="w-1.5 h-1.5 bg-brand-blue-600 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 border-t bg-white shrink-0">
        <div className="hidden sm:flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
          {["Diretrizes de Hipertensão", "Interpretar ECG", "Opções Terapêuticas"].map((p, i) => (
            <button key={i} onClick={() => setInput(p)} className="text-[9px] bg-gray-50 hover:bg-brand-blue-50 text-gray-500 font-bold px-3 py-1.5 rounded-full border border-gray-100 transition-all whitespace-nowrap">
              {p.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida clínica..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent outline-none text-sm transition-all"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="bg-brand-blue-600 text-white p-3 rounded-2xl hover:bg-brand-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-brand-blue-100"
          >
            <SparklesIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAiConsultation;
