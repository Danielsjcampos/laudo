import React, { useState } from 'react';
import { reportThemes } from './report-designer/themes';

interface ReportEditorProps {
    value: string;
    onChange: (val: string) => void;
    onSaveDraft?: () => void;
    readOnly?: boolean;
    themeId?: string;
}

const TEMPLATES = [
    { label: 'Normal - Raio-X Tórax', text: 'TÓRAX PA E PERFIL\n\nTécnica: Exame realizado com técnica digital.\n\nAnálise:\n- Transparência pulmonar preservada bilateralmente.\n- Seios costofrênicos livres.\n- Silhueta cardíaca com dimensões normais.\n- Estruturas ósseas íntegras.\n\nConclusão:\nExame dentro dos limites da normalidade.' },
    { label: 'Normal - RM Crânio', text: 'RESSONÂNCIA MAGNÉTICA DO CRÂNIO\n\nTécnica: Sequências T1, T2, FLAIR e Difusão.\n\nAnálise:\n- Parênquima encefálico com sinal e morfologia preservados.\n- Ausência de lesões expansivas ou isquêmicas agudas.\n- Sistema ventricular de dimensões e morfologia normais.\n- Linha média centrada.\n\nConclusão:\nExame normal.' },
    { label: 'Pneumonia', text: 'TÓRAX PA E PERFIL\n\nAnálise:\n- Opacidade heterogênea no lobo inferior direito, compatível com processo inflamatório/infeccioso.\n- Pequeno derrame pleural ipsilateral.\n\nConclusão:\nSinais sugestivos de broncopneumonia no LID.' }
];

export const ReportEditor: React.FC<ReportEditorProps> = ({ value, onChange, onSaveDraft, readOnly, themeId }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const theme = reportThemes.find(t => t.id === themeId) || reportThemes[0];

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
                </div>
                {!readOnly && (
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
                    placeholder="Comece a digitar o laudo ou selecione um modelo..."
                    readOnly={readOnly}
                />
            </div>

            <div 
                className="px-4 py-2 border-t text-[10px] flex justify-between font-mono"
                style={{ borderColor: theme.design_tokens.colors.border, color: theme.design_tokens.colors.secondary, background: theme.design_tokens.colors.surface }}
            >
                <span>{value.length} caracteres</span>
                <span>Salvamento automático: Ativo</span>
            </div>
        </div>
    );
};
