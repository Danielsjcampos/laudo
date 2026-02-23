import React, { useMemo, useState } from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import { DownloadIcon } from '../../icons/DownloadIcon';
import { PrintableReportModal } from '../../reports/PrintableReportModal';
import { mapExamToReportData } from '../../../utils/reportMapper';

interface PatientExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
    initialTab?: 'completed' | 'pending' | 'scheduled';
}

const PatientExamsPage: React.FC<PatientExamsPageProps> = ({ exams, onNavigateToDetail, initialTab }) => {
    const [activeTab, setActiveTab] = useState<'completed' | 'pending' | 'scheduled'>(initialTab || 'completed');
    const [selectedExamForPrint, setSelectedExamForPrint] = useState<Exam | null>(null);

    const handleDownload = (e: React.MouseEvent, exam: Exam) => {
        e.stopPropagation(); 
        setSelectedExamForPrint(exam);
    };

    const completedExams = useMemo(() => exams.filter(e => e.status === 'Concluído'), [exams]);
    const pendingExams = useMemo(() => exams.filter(e => ['Aguardando Laudo', 'Em Análise', 'Laudando'].includes(e.status)), [exams]);
    const scheduledExams = useMemo(() => exams.filter(e => e.status === 'Disponível'), [exams]);

    const displayedExams = useMemo(() => {
        switch (activeTab) {
            case 'completed': return completedExams;
            case 'pending': return pendingExams;
            case 'scheduled': return scheduledExams;
            default: return [];
        }
    }, [activeTab, completedExams, pendingExams, scheduledExams]);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
            {selectedExamForPrint && (
                <PrintableReportModal
                    isOpen={!!selectedExamForPrint}
                    onClose={() => setSelectedExamForPrint(null)}
                    data={mapExamToReportData(selectedExamForPrint)}
                    allowThemeSelection={false} // Patients can't change theme usually
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div>
                     <h1 className="page-header">Portal do Paciente</h1>
                     <div className="page-header-line" />
                     <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Acompanhe seus exames e resultados em tempo real.</p>
                </div>
            </div>

            <div className="flex items-center gap-1 mb-6 border-b p-1 shrink-0" style={{ borderColor: 'var(--surface-border)' }}>
                <button
                    onClick={() => setActiveTab('completed')}
                    className="px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative"
                    style={activeTab === 'completed' ? { color: 'var(--teal-600)' } : { color: 'var(--text-muted)' }}
                >
                    Laudados ({completedExams.length})
                    {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--teal-500)' }} />}
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className="px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative"
                    style={activeTab === 'pending' ? { color: 'var(--teal-600)' } : { color: 'var(--text-muted)' }}
                >
                    Pendentes ({pendingExams.length})
                    {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--teal-500)' }} />}
                </button>
                <button
                    onClick={() => setActiveTab('scheduled')}
                    className="px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative"
                    style={activeTab === 'scheduled' ? { color: 'var(--teal-600)' } : { color: 'var(--text-muted)' }}
                >
                    Agendados ({scheduledExams.length})
                    {activeTab === 'scheduled' && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--teal-500)' }} />}
                </button>
            </div>

            <div className="panel-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                                <th scope="col" className="px-8 py-4 kpi-label">Exame</th>
                                <th scope="col" className="px-8 py-4 kpi-label">Data</th>
                                <th scope="col" className="px-8 py-4 kpi-label">Médico Responsável</th>
                                <th scope="col" className="px-8 py-4 kpi-label">Status</th>
                                <th scope="col" className="px-8 py-4 kpi-label text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                            {displayedExams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-brand-blue-50/30 transition-all cursor-pointer group" onClick={() => onNavigateToDetail(exam.id)}>
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-gray-900 text-base">{exam.examType}</div>
                                        <div className="text-xs text-brand-blue-600 font-medium bg-brand-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">{exam.modality}</div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                                        {new Date(exam.dateRequested).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                                        {exam.doctorAssignedName || <span className="text-gray-300 italic">A definir</span>}
                                    </td>
                                    <td className="px-8 py-5"><Badge status={exam.status} /></td>
                                    <td className="px-8 py-5 text-right">
                                        {exam.status === 'Concluído' ? (
                                            <button 
                                                onClick={(e) => handleDownload(e, exam)} 
                                                className="inline-flex items-center text-sm font-bold text-brand-blue-600 hover:text-brand-blue-800 transition-colors bg-brand-blue-50 hover:bg-brand-blue-100 px-4 py-2 rounded-lg"
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-2"/>
                                                Baixar PDF
                                            </button>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                                                {exam.status === 'Disponível' ? 'Aguardando Aprovação' : 'Em Andamento'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {displayedExams.length === 0 && (
                        <div className="text-center py-16">
                             <p className="text-gray-400 font-medium">Nenhum exame encontrado nesta categoria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientExamsPage;
