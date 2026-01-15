
import React, { useState } from 'react';
import type { Exam, ReportTemplate } from '../../../data/mockData';
import { mockReportTemplates } from '../../../data/mockData';
import type { UserRole } from '../../../App';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { SuccessIcon } from '../../icons/SuccessIcon';
import { BrainIcon } from '../../icons/BrainIcon';
import { CopyIcon } from '../../icons/CopyIcon';
import { HorosButton } from '../../ui/HorosButton';
import { GoogleGenAI } from "@google/genai";
import { useToast } from '../../../contexts/ToastContext';

interface ExamDetailPageProps {
    exam: Exam;
    userRole: UserRole;
    onBack: () => void;
    onCompleteReport?: (examId: string, report: string) => void;
}

const DetailItem: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="mt-0.5 text-sm text-gray-900 font-bold">{value}</p>
    </div>
);

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ exam, userRole, onBack, onCompleteReport }) => {
    const [reportText, setReportText] = useState(exam.finalReport || exam.aiDraft || '');
    const [aiInsights, setAiInsights] = useState(exam.aiInsights || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const { addToast } = useToast();

    // Filter templates for this doctor (mock 'd1') or generic ones
    const templates = mockReportTemplates.filter(t => t.doctorId === 'd1');

    const generateAIDraft = async () => {
        setIsGenerating(true);
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            addToast('Erro: API Key não configurada.', 'error');
            setIsGenerating(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });

            let prompt = `Analise o exame: ${exam.examType} para o paciente ${exam.patientName}. Formate os insights em [INSIGHTS_START]...[INSIGHTS_END] e o rascunho em [DRAFT_START]...[DRAFT_END].`;

            if (reportText && reportText.length > 50) {
                 prompt += `\n\nUse o seguinte texto como base/template para o laudo, preenchendo as lacunas ou seguindo a estrutura:\n${reportText}`;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-thinking-exp-01-21',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: { temperature: 0.2, thinkingConfig: { thinkingBudget: 4000 } }
            });
            
            const text = response.text || '';
            let draft = text;
            let insights = '';

            if (text.includes('[INSIGHTS_START]')) {
                const parts = text.split('[INSIGHTS_START]');
                const insightPart = parts[1].split('[INSIGHTS_END]');
                insights = insightPart[0].trim();
                if (insightPart[1].includes('[DRAFT_START]')) {
                    draft = insightPart[1].split('[DRAFT_START]')[1].split('[DRAFT_END]')[0].trim();
                }
            }
            setReportText(draft);
            setAiInsights(insights);
            addToast('Análise de IA concluída!', 'success');
        } catch (error: any) {
            console.error(error);
            addToast(`Erro ao processar análise inteligente: ${error.message || error}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleComplete = () => {
        if (onCompleteReport) {
            onCompleteReport(exam.id, reportText);
            addToast('Laudo finalizado com sucesso!', 'success');
            onBack();
        }
    };

    const applyTemplate = (template: ReportTemplate) => {
        setReportText(template.content);
        setIsTemplateModalOpen(false);
        addToast('Modelo aplicado. Clique em "Gerar Laudo" para a IA preencher.', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 relative">
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button onClick={onBack} className="flex items-center text-sm font-bold text-gray-500 hover:text-brand-blue-600 transition-colors self-start sm:self-auto">
                    <span className="mr-1 text-lg">←</span> Voltar para Lista
                </button>
                <Badge status={exam.status} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visualização de Imagem - Lado esquerdo ou topo no mobile */}
                <div className="lg:col-span-4 space-y-6 order-1 lg:order-1">
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest text-center">Visualização do Exame</h3>
                        <div className="rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center relative group">
                            {exam.examImageUrl ? (
                                <img src={exam.examImageUrl} alt="Exame" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <div className="text-gray-600 text-xs italic">Nenhuma imagem disponível</div>
                            )}
                        </div>
                    </div>

                    {userRole === 'doctor' && exam.dicomUrl && (
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex justify-center">
                            <HorosButton dicomUrl={exam.dicomUrl} />
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Paciente" value={exam.patientName} />
                            <DetailItem label="Modalidade" value={exam.examType} />
                            <DetailItem label="Especialidade" value={exam.specialtyRequired} />
                            <DetailItem label="Origem" value={exam.clinicName} />
                        </div>
                    </div>
                </div>

                {/* Edição e IA - Lado direito ou abaixo no mobile */}
                <div className="lg:col-span-8 space-y-6 order-2 lg:order-2">
                    {userRole === 'doctor' && exam.status !== 'Concluído' && (
                        <div className="bg-gradient-to-br from-brand-blue-600 to-brand-teal-500 p-[1.5px] rounded-3xl shadow-lg">
                            <div className="bg-white rounded-[22px] p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center text-center sm:text-left">
                                    <div className="bg-brand-blue-50 p-2.5 rounded-2xl mr-4 hidden sm:block">
                                        <BrainIcon className="h-6 w-6 text-brand-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 leading-tight">Copiloto Gemini 2.0 Flash Thinking</h3>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Vision Diagnostic Suite</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button variant="outline" onClick={() => setIsTemplateModalOpen(!isTemplateModalOpen)} className="rounded-xl flex-1 sm:flex-none">
                                        <CopyIcon className="h-4 w-4 mr-2" /> Modelos
                                    </Button>
                                    <Button onClick={generateAIDraft} disabled={isGenerating} className="rounded-xl flex-1 sm:flex-none">
                                        <SparklesIcon className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                                        {isGenerating ? 'Analisando...' : 'Gerar Laudo'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Template Selection Dropdown/Modal Area */}
                    {isTemplateModalOpen && (
                        <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 animate-in slide-in-from-top-2 absolute z-10 w-full lg:w-2/3 right-0 top-20">
                            <h3 className="font-bold text-gray-700 mb-3 text-sm">Selecione um Modelo</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {templates.length > 0 ? templates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => applyTemplate(t)}
                                        className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200 text-sm"
                                    >
                                        <span className="font-bold text-gray-800 block">{t.title}</span>
                                        <span className="text-xs text-gray-500 truncate block">{t.content.substring(0, 60)}...</span>
                                    </button>
                                )) : (
                                    <p className="text-xs text-gray-500 italic p-2">Nenhum modelo encontrado. Crie em "Meus Modelos".</p>
                                )}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end">
                                <button onClick={() => setIsTemplateModalOpen(false)} className="text-xs text-gray-500 hover:text-gray-700 font-bold">Fechar</button>
                            </div>
                        </div>
                    )}

                    {aiInsights && (
                        <div className="bg-brand-blue-50 border border-brand-blue-100 rounded-3xl p-6 shadow-sm animate-in slide-in-from-top-2">
                            <h3 className="font-black text-[10px] text-brand-blue-700 uppercase mb-4 tracking-widest flex items-center">
                                <SuccessIcon className="h-3 w-3 mr-2" /> IA Insight Summary
                            </h3>
                            <div className="text-sm text-brand-blue-900 leading-relaxed italic">{aiInsights}</div>
                        </div>
                    )}

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Redação Técnica</h2>
                            <span className="text-[9px] bg-white border px-2 py-0.5 rounded font-mono text-gray-400">ID: {exam.id}</span>
                        </div>
                        <div className="p-4 md:p-6">
                            {userRole === 'doctor' && exam.status !== 'Concluído' ? (
                                <textarea
                                    className="w-full h-[400px] p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-blue-500 outline-none font-serif text-lg leading-relaxed transition-all"
                                    value={reportText}
                                    onChange={(e) => setReportText(e.target.value)}
                                    placeholder="Escreva as conclusões médicas ou selecione um modelo..."
                                />
                            ) : (
                                <div className="bg-gray-50 p-6 md:p-10 rounded-2xl border border-gray-100 font-serif text-lg leading-relaxed whitespace-pre-wrap min-h-[300px]">
                                    {reportText || 'Aguardando redação do especialista...'}
                                </div>
                            )}
                        </div>
                        {userRole === 'doctor' && exam.status !== 'Concluído' && (
                            <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                                <Button variant="outline" onClick={onBack} className="w-full sm:w-auto rounded-xl">Rascunho</Button>
                                <Button onClick={handleComplete} className="w-full sm:w-auto rounded-xl shadow-lg shadow-brand-blue-100 font-black uppercase text-xs tracking-widest">
                                    Assinar Digitalmente
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamDetailPage;
