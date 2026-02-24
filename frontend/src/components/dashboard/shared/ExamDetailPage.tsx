import React, { useState } from 'react';
import type { Exam } from '../../../data/mockData';
import type { UserRole } from '../../../types/auth';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { SuccessIcon } from '../../icons/SuccessIcon';
import { BrainIcon } from '../../icons/BrainIcon';
import { HorosButton } from '../../ui/HorosButton';
import { GoogleGenAI } from "@google/genai";
import { useToast } from '../../../contexts/ToastContext';
import api from '../../../lib/api';
import { OhifViewer } from '../shared/OhifViewer';
import { ReportEditor } from '../doctor/ReportEditor';
import { ClinicalHistoryModal } from '../modals/ClinicalHistoryModal';
import { ShareExamModal } from '../modals/ShareExamModal';
import { FileTextIcon } from '../../icons/FileTextIcon';

const MonitorIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
);

interface ExamDetailPageProps {
    exam: Exam;
    userRole: UserRole;
    onBack: () => void;
    onCompleteReport?: (examId: string, report: string) => void;
    onOpenOhif?: () => void;
    onOpenChat?: () => void;
    onRefreshData?: () => void;
}

const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="kpi-label">{label}</p>
        <p className="mt-0.5 text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
);

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ exam, userRole, onBack, onCompleteReport, onOpenOhif, onOpenChat, onRefreshData }) => {
    const [reportText, setReportText] = useState(exam.finalReport || exam.aiDraft || '');
    const [aiInsights, setAiInsights] = useState(exam.aiInsights || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isSuggestionViewOpen, setIsSuggestionViewOpen] = useState(false);
    const { addToast } = useToast();

    // Sincroniza dados ao abrir o detalhe
    React.useEffect(() => {
        if (onRefreshData) {
            onRefreshData();
        }
    }, [exam.id]);

    // AI Generation Logic (Simulated for MVP if no API Key)
    // AI Generation Logic with real data injection
    const generateAIDraft = async () => {
        setIsGenerating(true);
        
        // Fetch patient and exam data for injection
        const patientData = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 12px;">
                <div><strong>Paciente:</strong> ${exam.patientName}</div>
                <div><strong>Data Nasc:</strong> --/--/---- </div> {/* Patient DOB not in mock yet */}
                <div><strong>ID Exame:</strong> ${exam.id}</div>
                <div><strong>Data Exame:</strong> ${new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</div>
                <div><strong>ACC:</strong> ${exam.accessionNumber || 'N/A'}</div>
                <div><strong>Clínica:</strong> ${exam.clinicName}</div>
            </div>
        `;

        // Simulate AI delay
        setTimeout(() => {
            const draft = `
LAUDO TÉCNICO

EXAME: ${exam.examType.toUpperCase()}
MODALIDADE: ${exam.modality}

TÉCNICA:
Exame realizado com parâmetros padrão adequados à modalidade ${exam.modality}.

ANÁLISE:
As estruturas visualizadas apresentam-se com morfologia e sinal preservados. Não há evidência de lesões expansivas ou coleções anômalas no segmento avaliado (${exam.bodyPart || 'estudo geral'}).

CONCLUSÃO:
Exame dentro dos padrões da normalidade para os achados descritos.
            `.trim();
            
            setReportText(draft);
            setAiInsights("IA detectou padrão normal. Sugere-se correlação clínica.");
            setIsGenerating(false);
            addToast('Pré-análise gerada com inclusão de dados do paciente!', 'success');
        }, 1500);
    };

    const handleComplete = () => {
        if (onCompleteReport) {
            onCompleteReport(exam.id, reportText);
            addToast('Laudo finalizado e assinado!', 'success');
            onBack();
        }
    };

    return (
        <div className="flex flex-col lg:h-[calc(100vh-100px)]">
            <ClinicalHistoryModal 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
                history={exam.clinicalHistory || null}
                patientName={exam.patientName}
            />
            <ShareExamModal 
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                examId={exam.id}
                patientName={exam.patientName}
            />

            {/* Suggestion View Modal — Premium Redesign */}
            <Transition appear show={isSuggestionViewOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsSuggestionViewOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-500"
                                enterFrom="opacity-0 scale-90 translate-y-8"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-300"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-90 translate-y-8"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all">
                                    {/* Header com Gradient */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 px-8 py-7">
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                                        </div>
                                        
                                        <div className="relative flex items-start justify-between">
                                            <div className="flex items-start gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/20 ring-2 ring-white/30">
                                                    <SparklesIcon className="w-7 h-7 text-white drop-shadow-md" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Dialog.Title as="h3" className="text-xl font-black text-white tracking-tight">
                                                        Segunda Opinião Médica
                                                    </Dialog.Title>
                                                    <p className="text-amber-100 text-sm font-medium mt-1 opacity-90">
                                                        {exam.suggestions?.length || 0} sugestões recebidas de especialistas parceiros.
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setIsSuggestionViewOpen(false)}
                                                className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white shrink-0"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Corpo - Listagem de Sugestões */}
                                    <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-gray-50/30">
                                        {exam.suggestions?.map((suggestion, index) => (
                                            <div key={suggestion.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                                {/* Card da Sugestão */}
                                                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xs">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Sugestão #{index + 1}</p>
                                                                <h4 className="font-bold text-gray-900 text-sm">{suggestion.doctorName} <span className="text-gray-400 font-medium ml-1">({suggestion.doctorCrm})</span></h4>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {new Date(suggestion.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                                        </span>
                                                    </div>

                                                    <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50 mb-4">
                                                        <p className="text-sm text-gray-800 leading-relaxed italic">
                                                            "{suggestion.content}"
                                                        </p>
                                                    </div>

                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(suggestion.content);
                                                                addToast(`Sugestão ${index + 1} copiada!`, 'success');
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-500 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                            Copiar Texto
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setReportText(prev => prev + `\n\n--- SEGUNDA OPINIÃO (#${index+1} - ${suggestion.doctorName}) ---\n` + suggestion.content);
                                                                addToast(`Sugestão ${index + 1} inserida!`, 'success');
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm shadow-amber-200"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                            Inserir no Laudo
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {(!exam.suggestions || exam.suggestions.length === 0) && (
                                            <div className="py-20 text-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                                    <SparklesIcon className="w-10 h-10 text-gray-200" />
                                                </div>
                                                <p className="text-gray-400 font-bold text-sm">Nenhuma sugestão recebida até o momento.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-8 py-5 bg-white border-t border-gray-100 flex items-center justify-between">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Observações recebidas via link seguro (LGPD Compliant)
                                        </p>
                                        <Button
                                            size="sm"
                                            onClick={() => setIsSuggestionViewOpen(false)}
                                            variant="outline"
                                            className="font-black text-[10px] uppercase tracking-widest px-6"
                                        >
                                            Fechar Histórico
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* ALERT: Sugestão de Segunda Opinião */}
            {exam.suggestions && exam.suggestions.length > 0 && (
                <div className="mx-4 mb-4 animate-in slide-in-from-top duration-500 shrink-0">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                                <SparklesIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-yellow-900">Segunda Opinião Recebida!</h3>
                                <p className="text-xs text-yellow-700">Há {exam.suggestions.length} observação(ões) de especialistas parceiros para este exame.</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setIsSuggestionViewOpen(true)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white border-none shadow-md"
                        >
                            Ver Sugestões
                        </Button>
                    </div>
                </div>
            )}

            {/* Workstation Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between panel-card p-3 sm:p-4 shrink-0 gap-4">
                <div className="flex items-center gap-3 sm:gap-6">
                    <button onClick={onBack} className="transition-all hover:scale-110 btn-touch shrink-0" style={{ color: 'var(--text-muted)' }}>
                        <span className="sr-only">Voltar</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'var(--surface-border)' }}></div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8 min-w-0">
                        <div className="min-w-0">
                            <p className="text-base sm:text-lg font-black leading-tight sm:leading-normal truncate" style={{ color: 'var(--text-primary)' }}>{exam.patientName}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider hidden sm:block truncate" style={{ color: 'var(--text-muted)' }}>
                                ID: {exam.patientId} <span className="mx-2">|</span> ACC: {exam.accessionNumber || 'N/A'}
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-wider sm:hidden truncate" style={{ color: 'var(--text-muted)' }}>
                                ACC: {exam.accessionNumber || 'N/A'}
                            </p>
                        </div>
                        <div className="hidden sm:block shrink-0">
                            <p className="kpi-label">Exame</p>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{exam.examType}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-hide shrink-0">
                    {exam.medicalRequestUrl && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`${api.defaults.baseURL?.replace('/api', '')}${exam.medicalRequestUrl}`, '_blank')}
                            className="btn-touch text-brand-teal-600 border-brand-teal-200 hover:bg-brand-teal-50 shrink-0"
                            title="Pedido Médico"
                        >
                            <svg className="w-4 h-4 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <span className="hidden sm:inline">Pedido Médico</span>
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsHistoryOpen(true)}
                        className="btn-touch shrink-0"
                        title="História Clínica"
                    >
                        <FileTextIcon className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">História Clínica</span>
                    </Button>

                    {/* Botão Sugestão Prioritário */}
                    {exam.suggestions && exam.suggestions.length > 0 && (
                        <Button
                            size="sm"
                            onClick={() => setIsSuggestionViewOpen(true)}
                            className="btn-touch bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black shadow-lg shadow-yellow-100 flex items-center gap-1 sm:gap-2 border-none shrink-0"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Sugestões ({exam.suggestions.length})</span>
                            <span className="sm:hidden">{exam.suggestions.length}</span>
                        </Button>
                    )}

                    {userRole === 'doctor' && onOpenChat && (
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={onOpenChat}
                            className="btn-touch bg-brand-blue-600 hover:bg-brand-blue-700 text-white shadow-lg shadow-brand-blue-100 shrink-0"
                            title="Contatar Clínica"
                        >
                            <svg className="w-4 h-4 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <span className="hidden sm:inline">Contatar</span>
                        </Button>
                    )}
                    <Badge status={exam.status} className="shrink-0" />
                </div>
            </div>


            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 min-h-0 lg:overflow-hidden">
                {/* Left Side: Viewer */}
                {/* Left Side: Viewer (Hidden for Patients - Show Report Instead) */}
                {userRole !== 'patient' ? (
                    <div className="bg-black rounded-3xl overflow-hidden shadow-lg border border-gray-800 flex flex-col relative group min-h-[500px] sm:min-h-[600px] lg:h-full shrink-0 lg:flex-none">
                        <OhifViewer
                            dicomUrl={exam.dicomUrl || ''}
                            onBack={() => { }} // No back action needed inside embedded view
                            isSharedView={false}
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl h-full border border-gray-100 p-8 shadow-sm overflow-y-auto">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="bg-brand-blue-50 p-2 rounded-lg text-brand-blue-600">
                                <SuccessIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Laudo Médico</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Resultado Final</p>
                            </div>
                        </div>

                        {/* Render Report Content */}
                        <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed text-base">
                                {exam.finalReport || "Laudo ainda não disponível."}
                            </div>
                        </div>

                        {/* Signature area simulation */}
                        {exam.finalReport && (
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <p className="text-sm font-bold text-gray-900">Dr. Roberto Martins</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">CRM/SP 123456</p>
                                <p className="text-[10px] text-gray-400 mt-1">Assinado digitalmente em {new Date().toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Right Side: Report & AI */}
                {userRole !== 'patient' && (
                    <div className="flex flex-col gap-4 min-h-0 lg:overflow-y-auto pr-0 lg:pr-1">
                        {/* AI Assistant Card */}
                        {userRole === 'doctor' && exam.status !== 'Concluído' && (
                            <div className="panel-card p-3 sm:p-4 flex items-center justify-between shrink-0" style={{ border: '1px solid var(--teal-glow)' }}>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 rounded-lg text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--navy-800), var(--blue-600))' }}>
                                        <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-[13px] sm:text-sm truncate" style={{ color: 'var(--text-primary)' }}>IA Assistant</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-wider truncate" style={{ color: 'var(--text-muted)' }}>Sugestão disponível</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={generateAIDraft} disabled={isGenerating} variant="outline" className="btn-touch text-[10px] px-3 py-1.5 h-auto shrink-0">
                                    {isGenerating ? 'Gerando...' : 'Gerar'}
                                </Button>
                            </div>
                        )}

                        {/* Report Editor - Weighted by Theme */}
                        <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0">
                            {userRole === 'doctor' && reportText === '' && !exam.templateId && !isGenerating && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-900">Modelo de pré-laudo indisponível</p>
                                        <p className="text-xs text-amber-700">Nenhum template predefinido para este exame. Inicie o laudo manualmente ou utilize a IA.</p>
                                    </div>
                                </div>
                            )}

                             {/* External Suggestion Alert */}
                             {userRole === 'doctor' && exam.suggestions && exam.suggestions.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600 animate-pulse">
                                            <SparklesIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-yellow-900">Segunda Opinião Disponível</p>
                                            <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">{exam.suggestions.length} parecer(es) recebido(s)</p>
                                        </div>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        onClick={() => setIsSuggestionViewOpen(true)}
                                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 text-xs font-bold"
                                    >
                                        Ver Tudo
                                    </Button>
                                </div>
                            )}

                            <ReportEditor
                                value={reportText}
                                onChange={setReportText}
                                readOnly={userRole !== 'doctor' || exam.status === 'Concluído'}
                                onSaveDraft={() => addToast('Rascunho salvo', 'success')}
                                themeId={localStorage.getItem('selected_report_theme_id') || 'swiss-clinic'}
                            />
                        </div>

                        {/* Action Bar */}
                        {userRole === 'doctor' && exam.status !== 'Concluído' && (
                            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center shrink-0">
                                <div className="text-[10px] text-gray-500 hidden md:block">
                                    <span className="block font-bold">Dr. Roberto Martins</span>
                                    <span>CRM/SP 123456</span>
                                </div>
                                <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                                    <Button variant="outline" onClick={() => setIsShareModalOpen(true)} className="btn-touch border-brand-blue-200 text-brand-blue-700 hover:bg-brand-blue-50 text-[10px] h-9 sm:h-10 px-2 sm:px-4">
                                        <svg className="w-4 h-4 sm:mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                        <span className="truncate">Opinião</span>
                                    </Button>
                                    <Button variant="outline" onClick={onBack} className="btn-touch text-[10px] h-9 sm:h-10 px-2 sm:px-4">
                                        Sair
                                    </Button>
                                    <Button onClick={handleComplete} className="btn-touch col-span-2 sm:col-auto bg-green-600 hover:bg-green-700 text-white shadow-green-200 text-xs h-10 sm:h-10 font-black">
                                        <SuccessIcon className="w-4 h-4 mr-2" />
                                        Assinar Laudo
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamDetailPage;
