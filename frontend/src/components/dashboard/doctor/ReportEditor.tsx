import React, { useState, useEffect, useRef, useCallback } from 'react';
import { reportThemes } from './report-designer/themes';
import { Mic, MicOff, Waves } from 'lucide-react';

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

export const ReportEditor: React.FC<ReportEditorProps> = ({ value, onChange, onSaveDraft, readOnly, themeId }) => {
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

        setTimeout(() => {
            if (textAreaRef.current) {
                const newPos = start + textToInsert.length;
                textAreaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 10);
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true; 
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
                        
                        const textarea = textAreaRef.current;
                        if (textarea) {
                            const beforeCursor = textarea.value.substring(0, textarea.selectionStart);
                            if (beforeCursor.length === 0 || /(^|[\.\!\?\n]\s*)$/.test(beforeCursor)) {
                                transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
                            } else if (!beforeCursor.endsWith(' ') && !beforeCursor.endsWith('\n')) {
                                transcript = ' ' + transcript.trimStart();
                            }
                        }

                        transcript = transcript.replace(/\s+([.,!?])/g, '$1'); 
                        
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
                // Ignore if already started
            }
            textAreaRef.current?.focus();
        }
    };

    return (
        <div 
            className="rounded-3xl shadow-sm border flex flex-col overflow-hidden h-full transition-all duration-500 relative bg-white/50 backdrop-blur-sm"
            style={{ 
                borderColor: isRecording ? 'rgba(239, 68, 68, 0.3)' : theme.design_tokens.colors.border,
                boxShadow: isRecording ? '0 0 0 2px rgba(239, 68, 68, 0.1), 0 10px 25px -5px rgba(239, 68, 68, 0.05)' : 'none',
                fontFamily: `${theme.design_tokens.typography.body_font}, sans-serif`
            }}
        >
            {/* Header Toolbar Minimalista */}
            <div className="px-3 sm:px-4 py-3 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20" style={{ borderColor: theme.design_tokens.colors.border }}>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <button 
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={toggleRecording}
                        disabled={readOnly}
                        className={`transition-all duration-300 flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold shadow-sm shrink-0 ${
                            isRecording 
                                ? 'bg-red-500 text-white hover:bg-red-600 ring-4 ring-red-500/20' 
                                : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isRecording ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
                        <span className="text-[12px] sm:text-[13px] tracking-wide">{isRecording ? (
                            <span className="flex items-center gap-1">Parar <span className="hidden xs:inline">Ditado</span></span>
                        ) : (
                            <span className="flex items-center gap-1">Ditar <span className="hidden xs:inline">Laudo</span></span>
                        )}</span>
                    </button>

                    <div className="h-6 w-px bg-gray-200 mx-1 sm:mx-2 shrink-0"></div>

                    <div className="hidden sm:flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 shrink-0">
                        <button className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 flex items-center justify-center"><span className="font-bold font-serif text-sm">B</span></button>
                        <button className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 flex items-center justify-center"><span className="italic font-serif text-sm">I</span></button>
                    </div>
                </div>

                {!readOnly && onSaveDraft && (
                    <button 
                        onClick={onSaveDraft} 
                        className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-gray-50 shrink-0"
                    >
                        Salvar
                    </button>
                )}
            </div>
            
            <div className="flex-1 relative bg-white">
                <textarea
                    ref={textAreaRef}
                    className="w-full h-full p-4 sm:p-8 outline-none leading-relaxed resize-none transition-colors relative z-10"
                    style={{ 
                        background: 'transparent',
                        color: theme.design_tokens.colors.primary,
                        fontSize: '16px', // 16px handles iOS zoom better
                        lineHeight: '1.7',
                        fontFamily: theme.design_tokens.typography.body_font === 'Space Mono' ? 'monospace' : 'serif'
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Dite ou digite o laudo aqui..."
                    readOnly={readOnly}
                />
            </div>

            {/* Footer de Status mais Limpo */}
            <div 
                className="px-5 py-3 border-t flex justify-between font-mono items-center bg-gray-50/80 backdrop-blur-sm"
                style={{ borderColor: theme.design_tokens.colors.border }}
            >
                <div className="flex items-center gap-4 overflow-hidden flex-1">
                    {isRecording ? (
                        <span className="flex items-center gap-2 text-red-500 font-semibold text-[11px] uppercase tracking-wider">
                            <Waves size={14} className="animate-pulse" />
                            Ouvindo
                        </span>
                    ) : (
                        <span className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                            {value.length} char
                        </span>
                    )}
                    
                    {interimText && (
                        <span className="text-gray-500 italic font-sans text-[13px] truncate ml-2 transition-all" title={interimText}>
                            "{interimText}"
                        </span>
                    )}
                </div>
                <span className="shrink-0 ml-4 font-semibold text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Autosave
                </span>
            </div>
        </div>
    );
};
