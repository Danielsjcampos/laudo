import React, { useState } from 'react';
import type { Exam } from '../../../data/mockData';
import type { UserRole } from '../../../App';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { SuccessIcon } from '../../icons/SuccessIcon';
import { BrainIcon } from '../../icons/BrainIcon';
import { HorosButton } from '../../ui/HorosButton';
import { GoogleGenAI } from "@google/genai";
import { useToast } from '../../../contexts/ToastContext';
import { DicomViewer } from '../shared/DicomViewer';
import { ReportEditor } from '../doctor/ReportEditor';

interface ExamDetailPageProps {
    exam: Exam;
    userRole: UserRole;
    onBack: () => void;
    onCompleteReport?: (examId: string, report: string) => void;
}

const DetailItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="mt-0.5 text-sm text-gray-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis">{value}</p>
    </div>
);

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ exam, userRole, onBack, onCompleteReport }) => {
    const [reportText, setReportText] = useState(exam.finalReport || exam.aiDraft || '');
    const [aiInsights, setAiInsights] = useState(exam.aiInsights || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const { addToast } = useToast();

    // AI Generation Logic (Simulated for MVP if no API Key)
    const generateAIDraft = async () => {
        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            const draft = `LAUDO TÉCNICO\n\nEXAME: ${exam.examType.toUpperCase()}\n\nTÉCNICA:\nExame realizado com parêmetros padrão.\n\nANÁLISE:\nAs estruturas visualizadas apresentam-se com morfologia e sinal preservados. Não há evidência de lesões.\n\nCONCLUSÃO:\nExame dentro dos padrões da normalidade.`;
            const insights = "IA detectou padrão normal. Sugere-se correlação clínica.";
            
            setReportText(draft);
            setAiInsights(insights);
            setIsGenerating(false);
            addToast('Pré-análise gerada com sucesso!', 'success');
        }, 2000);
        
        // Example of real call integration preserved from previous code:
        /*
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            // ... (real logic)
        } catch (error) { ... }
        */
    };

    const handleComplete = () => {
        if (onCompleteReport) {
            onCompleteReport(exam.id, reportText);
            addToast('Laudo finalizado e assinado!', 'success');
            onBack();
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Workstation Header */}
            <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="sr-only">Voltar</span>
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex gap-8">
                        <div>
                             <p className="text-lg font-black text-gray-900">{exam.patientName}</p>
                             <p className="text-xs text-gray-500 font-mono">ID: {exam.patientId} | ACC: {exam.accessionNumber || 'N/A'}</p>
                        </div>
                        <div className="hidden md:block">
                             <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Exame</p>
                             <p className="text-sm font-bold text-gray-800">{exam.examType}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right mr-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Prioridade</p>
                        <p className={`text-sm font-bold ${exam.urgency === 'Urgente' ? 'text-red-500' : 'text-gray-700'}`}>{exam.urgency || 'Rotina'}</p>
                    </div>
                    <Badge status={exam.status} />
                </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Left Side: Viewer */}
                <div className="bg-black rounded-3xl overflow-hidden shadow-lg border border-gray-800 flex flex-col relative">
                     <DicomViewer dicomUrl={exam.dicomUrl} modality={exam.modality} />
                </div>

                {/* Right Side: Report & AI */}
                <div className="flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
                    {/* AI Assistant Card */}
                    {userRole === 'doctor' && exam.status !== 'Concluído' && (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-blue-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-brand-blue-500 to-brand-purple-600 p-2 rounded-lg text-white">
                                    <SparklesIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">IA Assistant</h3>
                                    <p className="text-[10px] text-gray-500">Sugestão de laudo disponível</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={generateAIDraft} disabled={isGenerating} variant="outline" className="text-xs">
                                {isGenerating ? 'Gerando...' : 'Gerar Pré-Laudo'}
                            </Button>
                        </div>
                    )}
                    
                    {/* Report Editor - Full Height available */}
                    <div className="flex-1 flex flex-col min-h-[400px]">
                        <ReportEditor 
                            value={reportText} 
                            onChange={setReportText} 
                            readOnly={userRole !== 'doctor' || exam.status === 'Concluído'}
                            onSaveDraft={() => addToast('Rascunho salvo', 'success')}
                        />
                    </div>

                    {/* Action Bar */}
                    {userRole === 'doctor' && exam.status !== 'Concluído' && (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center shrink-0">
                             <div className="text-xs text-gray-500">
                                 <span className="block font-bold">Dr. Roberto Martins</span>
                                 <span>CRM/SP 123456</span>
                             </div>
                             <div className="flex gap-3">
                                 <Button variant="outline" onClick={onBack}>Salvar e Sair</Button>
                                 <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-white shadow-green-200">
                                     <SuccessIcon className="w-4 h-4 mr-2" />
                                     Assinar Laudo
                                 </Button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamDetailPage;
