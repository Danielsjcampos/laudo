import React, { useState, useEffect, useRef } from 'react';
import { reportThemes } from './report-designer/themes';
import { Mic, MicOff } from 'lucide-react';

interface ReportEditorProps {
    value: string;
    onChange: (val: string) => void;
    onSaveDraft?: () => void;
    readOnly?: boolean;
    themeId?: string;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const TEMPLATES = [
    { label: 'Normal - Raio-X Tórax', text: 'TÓRAX PA E PERFIL\n\nTécnica: Exame realizado com técnica digital.\n\nAnálise:\n- Transparência pulmonar preservada bilateralmente.\n- Seios costofrênicos livres.\n- Silhueta cardíaca com dimensões normais.\n- Estruturas ósseas íntegras.\n\nConclusão:\nExame dentro dos limites da normalidade.' },
    { label: 'Normal - RM Crânio', text: 'RESSONÂNCIA MAGNÉTICA DO CRÂNIO\n\nTécnica: Sequências T1, T2, FLAIR e Difusão.\n\nAnálise:\n- Parênquima encefálico com sinal e morfologia preservados.\n- Ausência de lesões expansivas ou isquêmicas agudas.\n- Sistema ventricular de dimensões e morfologia normais.\n- Linha média centrada.\n\nConclusão:\nExame normal.' },
    { label: 'Pneumonia', text: 'TÓRAX PA E PERFIL\n\nAnálise:\n- Opacidade heterogênea no lobo inferior direito, compatível com processo inflamatório/infeccioso.\n- Pequeno derrame pleural ipsilateral.\n\nConclusão:\nSinais sugestivos de broncopneumonia no LID.' }
];

export const ReportEditor: React.FC<ReportEditorProps> = ({ value, onChange, onSaveDraft, readOnly, themeId }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    
    const theme = reportThemes.find(t => t.id === themeId) || reportThemes[0];
    
    const recognitionRef = useRef<any>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'pt-BR';
            
            recognition.onstart = () => {
                setIsRecording(true);
            };

            recognition.onresult = (event: any) => {
                if (readOnly) return;
                
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        const transcript = event.results[i][0].transcript;
                        insertTextAtCursor(transcript + ' ');
                    }
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsRecording(false);
            };

            recognition.onend = () => {
                // A gravação pode ser parada automaticamente após período de silêncio
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        }
    }, [readOnly]);

    const insertTextAtCursor = (textToInsert: string) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentVal = textarea.value;

        // Limpa o texto a ser inserido, cuidando de espaçamentos caso o script o demande
        const cleanText = textToInsert;

        const newVal = currentVal.substring(0, start) + cleanText + currentVal.substring(end);
        
        onChangeRef.current(newVal);

        // Move cursor para não sobreescrever tudo que a pessoa editar
        setTimeout(() => {
            if (textAreaRef.current) {
                const newPos = start + cleanText.length;
                textAreaRef.current.selectionStart = newPos;
                textAreaRef.current.selectionEnd = newPos;
            }
        }, 10);
    };

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert('Aviso: Reconhecimento de voz não suportado neste navegador. Use Google Chrome ou Edge.');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            textAreaRef.current?.focus();
        }
    };

    const applyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tpl = TEMPLATES.find(t => t.label === e.target.value);
        if (tpl) {
            onChange(tpl.text);
            setSelectedTemplate(e.target.value);
        }
    };

    return (
        <div 
            className="rounded-3xl shadow-sm border flex flex-col overflow-hidden h-full transition-all duration-300"
            style={{ 
                borderColor: theme.design_tokens.colors.border,
                background: theme.design_tokens.colors.background,
                fontFamily: `${theme.design_tokens.typography.body_font}, sans-serif`
            }}
        >
            <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: theme.design_tokens.colors.border, background: theme.design_tokens.colors.surface }}>
                <div className="flex items-center gap-2">
                     <select 
                        className="text-xs border rounded-lg px-2 py-1.5 focus:ring-1 outline-none font-medium"
                        style={{ 
                            borderColor: theme.design_tokens.colors.border,
                            background: theme.design_tokens.colors.background,
                            color: theme.design_tokens.colors.primary,
                        }}
                        value={selectedTemplate}
                        onChange={applyTemplate}
                        disabled={readOnly}
                     >
                         <option value="">Carregar Modelo...</option>
                         {TEMPLATES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                     </select>
                     
                     <div className="h-4 w-px bg-gray-300 mx-1"></div>

                     <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-black/5" style={{ color: theme.design_tokens.colors.secondary }}><span className="font-bold font-serif">B</span></button>
                        <button className="p-1.5 rounded hover:bg-black/5" style={{ color: theme.design_tokens.colors.secondary }}><span className="italic font-serif">I</span></button>
                        <button className="p-1.5 rounded hover:bg-black/5" style={{ color: theme.design_tokens.colors.secondary }}><span className="underline font-serif">U</span></button>
                     </div>

                     <div className="h-4 w-px bg-gray-300 mx-1"></div>

                     <div className="flex gap-1">
                         <button 
                             onMouseDown={(e) => e.preventDefault()}
                             onClick={toggleRecording}
                             disabled={readOnly}
                             title={isRecording ? "Parar ditado" : "Selecione um texto e clique para substituir por voz, ou apenas clique para ditar."}
                             className={`p-1.5 rounded transition-colors flex items-center gap-1.5 px-3 border ${
                                 isRecording 
                                     ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 animate-pulse' 
                                     : 'bg-white hover:bg-gray-50 border-gray-200'
                             }`}
                             style={{ 
                                 color: isRecording ? '#dc2626' : theme.design_tokens.colors.secondary,
                                 borderColor: isRecording ? '#fecaca' : theme.design_tokens.colors.border
                             }}
                         >
                             {isRecording ? <MicOff size={14} className="animate-pulse" /> : <Mic size={14} />}
                             <span className="text-[11px] font-semibold">{isRecording ? "Gravando..." : "Ditar"}</span>
                         </button>
                     </div>
                </div>
                {!readOnly && onSaveDraft && (
                    <button 
                        onClick={onSaveDraft} 
                        className="text-[10px] font-black uppercase tracking-wider hover:opacity-80"
                        style={{ color: theme.design_tokens.colors.accent }}
                    >
                        Salvar Rascunho
                    </button>
                )}
            </div>
            
            <div className="flex-1 relative">
                <textarea
                    ref={textAreaRef}
                    className="w-full h-full p-8 outline-none leading-relaxed resize-none transition-colors"
                    style={{ 
                        background: 'transparent',
                        color: theme.design_tokens.colors.primary,
                        fontSize: theme.design_tokens.typography.base_size,
                        lineHeight: theme.design_tokens.typography.line_height,
                        fontFamily: theme.design_tokens.typography.body_font === 'Space Mono' ? 'monospace' : 'serif'
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Comece a digitar o laudo, use o botão Ditar para gravar por voz ou selecione um modelo."
                    readOnly={readOnly}
                />
            </div>

            <div 
                className="px-4 py-2 border-t text-[10px] flex justify-between font-mono items-center"
                style={{ borderColor: theme.design_tokens.colors.border, color: theme.design_tokens.colors.secondary, background: theme.design_tokens.colors.surface }}
            >
                <div className="flex items-center gap-3">
                    <span>{value.length} caracteres</span>
                    {isRecording && (
                        <span className="flex items-center gap-1.5 text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            Ouvindo...
                        </span>
                    )}
                </div>
                <span>Salvamento automático: Ativo</span>
            </div>
        </div>
    );
};
