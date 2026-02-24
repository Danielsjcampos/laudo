import React, { useState, useMemo } from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import { EditIcon } from '../../icons/EditIcon';
import SearchInput from '../../ui/SearchInput';
import { Button } from '../../ui/Button';

interface DoctorExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
    onOpenOhif?: (examId: string) => void;
    initialTab?: 'pending' | 'completed';
}

import { PrintableReportModal } from '../../reports/PrintableReportModal';
import { mapExamToReportData } from '../../../utils/reportMapper';

const DoctorExamsPage: React.FC<DoctorExamsPageProps> = ({ exams, onNavigateToDetail, onOpenOhif, initialTab = 'pending' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>(initialTab);
    const [selectedExamForView, setSelectedExamForView] = useState<Exam | null>(null);

    React.useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const pendingExams = useMemo(() => exams.filter(e =>
        e.status === 'Aguardando Laudo' || e.status === 'Em Análise' || e.status === 'Laudando'
    ), [exams]);

    const completedExams = useMemo(() => exams.filter(e =>
        e.status === 'Concluído'
    ), [exams]);

    const displayedExams = activeTab === 'pending' ? pendingExams : completedExams;

    const filteredExams = useMemo(() => {
        return displayedExams.filter(exam =>
            exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.examType.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [displayedExams, searchTerm]);

    return (
        <div>
            {selectedExamForView && (
                <PrintableReportModal
                    isOpen={!!selectedExamForView}
                    onClose={() => setSelectedExamForView(null)}
                    data={mapExamToReportData(selectedExamForView)}
                    allowThemeSelection={true} // Doctors can select theme
                />
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="page-header">Meus Laudos</h1>
                    <div className="page-header-line" />
                    <p className="text-sm mt-3 font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>Gerencie sua fila de trabalho e histórico.</p>
                </div>
                <div className="w-full sm:max-w-xs">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar paciente..." />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 p-1 rounded-xl w-full sm:w-fit mb-6" style={{ backgroundColor: 'var(--surface-bg)' }}>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 sm:flex-none btn-touch px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'shadow-sm' : 'hover:opacity-80'}`}
                    style={activeTab === 'pending' ? { backgroundColor: 'var(--surface-card)', color: 'var(--text-primary)' } : { color: 'var(--text-muted)' }}
                >
                    Pendentes
                    <span className="ml-2 py-0.5 px-2 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'var(--teal-glow)', color: 'var(--teal-500)' }}>
                        {pendingExams.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`flex-1 sm:flex-none btn-touch px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'shadow-sm' : 'hover:opacity-80'}`}
                    style={activeTab === 'completed' ? { backgroundColor: 'var(--surface-card)', color: 'var(--text-primary)' } : { color: 'var(--text-muted)' }}
                >
                    Concluídos
                    <span className="ml-2 py-0.5 px-2 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-muted)' }}>
                        {completedExams.length}
                    </span>
                </button>
            </div>

            <div className="panel-card overflow-hidden">
                {/* Desktop: Tabela */}
                <div className="exam-table-desktop overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Prioridade</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Paciente / Exame</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Data</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Status</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                            {filteredExams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {exam.urgency === 'Urgente' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">URGENTE</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Rotina</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{exam.patientName}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase" style={{ backgroundColor: 'var(--teal-glow)', color: 'var(--teal-500)' }}>{exam.modality}</span>
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{exam.examType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-500">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4"><Badge status={exam.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {onOpenOhif && (
                                                <Button size="sm" variant="outline" onClick={() => onOpenOhif(exam.id)} className="border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                    OHIF
                                                </Button>
                                            )}
                                            {activeTab === 'pending' ? (
                                                <Button size="sm" onClick={() => onNavigateToDetail(exam.id)} className={exam.urgency === 'Urgente' ? 'bg-red-600 hover:bg-red-700' : ''}>
                                                    <EditIcon className="w-4 h-4 mr-2" />
                                                    Laudar
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedExamForView(exam); }}>
                                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    Ver Laudo
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredExams.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <div className="bg-gray-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <p className="font-medium">Nenhum exame encontrado nesta aba.</p>
                        </div>
                    )}
                </div>

                {/* Mobile: Cards */}
                <div className="exam-card-mobile divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                    {filteredExams.map((exam) => (
                        <div key={exam.id} className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="font-black text-sm truncate" style={{ color: 'var(--text-primary)' }}>{exam.patientName}</p>
                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                        {exam.urgency === 'Urgente' && (
                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 uppercase">Urgente</span>
                                        )}
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase" style={{ backgroundColor: 'var(--teal-glow)', color: 'var(--teal-500)' }}>{exam.modality}</span>
                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{exam.examType}</span>
                                    </div>
                                </div>
                                <Badge status={exam.status} />
                            </div>
                            <p className="text-[10px] text-gray-400">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</p>
                            <div className="flex gap-2">
                                {onOpenOhif && (
                                    <button onClick={() => onOpenOhif(exam.id)} className="btn-touch flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase text-cyan-700" style={{ backgroundColor: '#ecfeff' }}>OHIF</button>
                                )}
                                {activeTab === 'pending' ? (
                                    <button onClick={() => onNavigateToDetail(exam.id)} className={`btn-touch flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase text-white ${exam.urgency === 'Urgente' ? 'bg-red-600' : 'bg-brand-blue-600'}`}>
                                        <EditIcon className="w-3 h-3" />
                                        Laudar
                                    </button>
                                ) : (
                                    <button onClick={() => setSelectedExamForView(exam)} className="btn-touch flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>
                                        Ver Laudo
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredExams.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="font-medium text-sm">Nenhum exame encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorExamsPage;
