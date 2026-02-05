
import React, { useState } from 'react';
import { Button } from '../../ui/Button';

interface ReportEditorProps {
    value: string;
    onChange: (val: string) => void;
    onSaveDraft?: () => void;
    readOnly?: boolean;
}

const TEMPLATES = [
    { label: 'Normal - Raio-X Tórax', text: 'TÓRAX PA E PERFIL\n\nTécnica: Exame realizado com técnica digital.\n\nAnálise:\n- Transparência pulmonar preservada bilateralmente.\n- Seios costofrênicos livres.\n- Silhueta cardíaca com dimensões normais.\n- Estruturas ósseas íntegras.\n\nConclusão:\nExame dentro dos limites da normalidade.' },
    { label: 'Normal - RM Crânio', text: 'RESSONÂNCIA MAGNÉTICA DO CRÂNIO\n\nTécnica: Sequências T1, T2, FLAIR e Difusão.\n\nAnálise:\n- Parênquima encefálico com sinal e morfologia preservados.\n- Ausência de lesões expansivas ou isquêmicas agudas.\n- Sistema ventricular de dimensões e morfologia normais.\n- Linha média centrada.\n\nConclusão:\nExame normal.' },
    { label: 'Pneumonia', text: 'TÓRAX PA E PERFIL\n\nAnálise:\n- Opacidade heterogênea no lobo inferior direito, compatível com processo inflamatório/infeccioso.\n- Pequeno derrame pleural ipsilateral.\n\nConclusão:\nSinais sugestivos de broncopneumonia no LID.' }
];

export const ReportEditor: React.FC<ReportEditorProps> = ({ value, onChange, onSaveDraft, readOnly }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const applyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tpl = TEMPLATES.find(t => t.label === e.target.value);
        if (tpl) {
            onChange(tpl.text);
            setSelectedTemplate(e.target.value);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                     <select 
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:border-brand-blue-500 bg-white outline-none font-medium text-gray-700"
                        value={selectedTemplate}
                        onChange={applyTemplate}
                        disabled={readOnly}
                     >
                         <option value="">Carregar Modelo...</option>
                         {TEMPLATES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                     </select>
                     
                     <div className="h-4 w-px bg-gray-300 mx-1"></div>

                     <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><span className="font-bold font-serif">B</span></button>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><span className="italic font-serif">I</span></button>
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><span className="underline font-serif">U</span></button>
                     </div>
                </div>
                {!readOnly && (
                    <button onClick={onSaveDraft} className="text-[10px] font-black uppercase text-brand-blue-600 hover:text-brand-blue-800 tracking-wider">
                        Salvar Rascunho
                    </button>
                )}
            </div>
            
            <div className="flex-1 reltive">
                <textarea
                    className="w-full h-full p-6 bg-white outline-none font-serif text-lg leading-relaxed resize-none text-gray-800"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Comece a digitar o laudo ou selecione um modelo..."
                    readOnly={readOnly}
                />
            </div>

            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between font-mono">
                <span>{value.length} caracteres</span>
                <span>Salvamento automático: Ativo</span>
            </div>
        </div>
    );
};
