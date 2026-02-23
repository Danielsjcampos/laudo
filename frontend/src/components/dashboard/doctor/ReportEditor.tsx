import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const [interimText, setInterimText] = useState('');
    
    const theme = reportThemes.find(t => t.id === themeId) || reportThemes[0];
    
    const recognitionRef = useRef<any>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const onChangeRef = useRef(onChange);
    const shouldRecordRef = useRef(false);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const insertTextAtCursor = useCallback((textToInsert: string) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentVal = textarea.value;

        const newVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
        
        onChangeRef.current(newVal);

        // Move cursor e foca para que o usuário veja a mudança sem perder o foco
        setTimeout(() => {
            if (textAreaRef.current) {
                const newPos = start + textToInsert.length;
                textAreaRef.current.setSelectionRange(newPos, newPos);
                // Evitamos o focus automático agressivo se não for necessário,
                // mas garantimos a re-seleção.
            }
        }, 10);
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true; // Feedback em tempo real
            recognition.lang = 'pt-BR';
            
            recognition.onstart = () => {
                setIsRecording(true);
            };

            recognition.onresult = (event: any) => {
                if (readOnly) return;
                
                let currentInterim = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        let transcript = event.results[i][0].transcript;
                        
                        // Capitalização inteligente
                        const textarea = textAreaRef.current;
                        if (textarea) {
                            const beforeCursor = textarea.value.substring(0, textarea.selectionStart);
                            // Se está no início ou logo após um ponto final/enter
                            if (beforeCursor.length === 0 || /(^|[\.\!\?\n]\s*)$/.test(beforeCursor)) {
                                transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
                            } else if (!beforeCursor.endsWith(' ') && !beforeCursor.endsWith('\n')) {
                                // Garante um espaço se for colar depois de uma palavra
                                transcript = ' ' + transcript.trimStart();
                            }
                        }

                        // Substituições e correções ortográficas espertas por voz
                        transcript = transcript.replace(/\s+([.,!?])/g, '$1'); // "teste ." -> "teste."
                        
                        insertTextAtCursor(transcript + ' ');
                    } else {
                        currentInterim += event.results[i][0].transcript;
                    }
                }
                setInterimText(currentInterim);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                if (event.error !== 'no-speech' && event.error !== 'network') {
                    shouldRecordRef.current = false;
                    setIsRecording(false);
                    setInterimText('');
                }
            };

            recognition.onend = () => {
                // Gravação contínua real (Continuous Dictation)
                // Browsers param automaticamente quando há silêncio. Nós reiniciamos
                // caso a intenção do usuário fosse manter ligado.
                if (shouldRecordRef.current) {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    setIsRecording(false);
                    setInterimText('');
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            shouldRecordRef.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [readOnly, insertTextAtCursor]);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert('Aviso: Reconhecimento de voz não suportado neste navegador. Use Google Chrome ou Edge.');
            return;
        }

        if (shouldRecordRef.current) {
            shouldRecordRef.current = false;
            recognitionRef.current.stop();
            setIsRecording(false);
            setInterimText('');
        } else {
            shouldRecordRef.current = true;
            try {
                recognitionRef.current.start();
            } catch (e) {
                // Ignorar se já estava iniciado no browser
            }
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
            className="rounded-3xl shadow-sm border flex flex-col overflow-hidden h-full transition-all duration-300 relative"
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
                             title={isRecording ? "Parar ditado contínuo" : "Selecione um texto para substituir ou palique e grave continuamente."}
                             className={`p-1.5 rounded transition-all duration-300 flex items-center gap-1.5 px-3 border shadow-sm ${
                                 isRecording 
                                     ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 ring-2 ring-red-100' 
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
                    className="w-full h-full p-8 outline-none leading-relaxed resize-none transition-colors relative z-10"
                    style={{ 
                        background: 'transparent',
                        color: theme.design_tokens.colors.primary,
                        fontSize: theme.design_tokens.typography.base_size,
                        lineHeight: theme.design_tokens.typography.line_height,
                        fontFamily: theme.design_tokens.typography.body_font === 'Space Mono' ? 'monospace' : 'serif'
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Comece a digitar o laudo ou use o botão 'Ditar' para iniciar o ditado inteligente..."
                    readOnly={readOnly}
                />
            </div>

            <div 
                className="px-4 py-2 border-t text-[10px] min-h-[36px] flex justify-between font-mono items-center"
                style={{ borderColor: theme.design_tokens.colors.border, color: theme.design_tokens.colors.secondary, background: theme.design_tokens.colors.surface }}
            >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <span className="shrink-0">{value.length} caracteres</span>
                    {isRecording && (
                        <span className="flex items-center gap-1.5 text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            Ouvindo ativo
                        </span>
                    )}
                    {interimText && (
                        <span className="text-gray-400 italic font-sans truncate ml-2 text-xs" title={interimText}>
                            "... {interimText}"
                        </span>
                    )}
                </div>
                <span className="shrink-0 ml-4 font-semibold text-gray-400">Autosave ON</span>
            </div>
        </div>
    );
};
