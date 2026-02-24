import React, { useState, useMemo } from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import SearchInput from '../../ui/SearchInput';
import { PlusIcon } from '../../icons/PlusIcon';
import { Button } from '../../ui/Button';

interface ClinicExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
    onEditExam?: (examId: string) => void;
    onDeleteExam?: (examId: string) => void;
    onOpenOhif?: (examId: string) => void;
    onOpenRequestExam?: (patientId?: string) => void;
}

const ClinicExamsPage: React.FC<ClinicExamsPageProps> = ({ exams, onNavigateToDetail, onOpenOhif, onEditExam, onDeleteExam, onOpenRequestExam }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const matchesSearch = exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.doctorAssignedName?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesDate = dateFilter ? new Date(exam.dateRequested).toLocaleDateString('pt-BR') === new Date(dateFilter).toLocaleDateString('pt-BR') : true;
            const matchesStatus = statusFilter ? exam.status === statusFilter : true;

            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [exams, searchTerm, dateFilter, statusFilter]);

    const handleDeleteClick = (examId: string) => {
        setDeleteConfirmId(examId);
    };

    const confirmDelete = () => {
        if (deleteConfirmId && onDeleteExam) {
            onDeleteExam(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    return (
        <div>
            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-900/75 transition-opacity z-[100]" onClick={() => setDeleteConfirmId(null)} />
                    <div className="fixed inset-0 z-[110] flex min-h-full items-center justify-center p-4">
                        <div className="relative transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all w-full max-w-md">
                            <div className="bg-white px-8 pt-8 pb-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 text-center mb-2">Confirmar Exclusão</h3>
                                <p className="text-sm text-gray-600 text-center mb-6">
                                    Tem certeza que deseja deletar este exame? Esta ação não pode ser desfeita.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="page-header">Gerenciamento de Exames</h1>
                    <div className="page-header-line" />
                </div>
                {onOpenRequestExam && (
                    <Button
                        onClick={() => onOpenRequestExam && onOpenRequestExam()}
                        className="w-full sm:w-auto btn-touch"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Novo Exame
                    </Button>
                )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input 
                        type="date" 
                        className="text-sm rounded-xl p-2.5 focus:outline-none focus:ring-2"
                        style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                     <select
                        className="text-sm rounded-xl p-2.5 focus:outline-none focus:ring-2"
                        style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Todos Status</option>
                        <option value="Disponível">Disponível</option>
                        <option value="Aguardando Laudo">Aguardando Laudo</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Concluído">Concluído</option>
                    </select>
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar..." />
                </div>
            </div>

            <div className="panel-card overflow-hidden">
                <div className="p-4 md:p-6 border-b" style={{ borderColor: 'var(--surface-border)' }}>
                    <h2 className="section-title">Todos os Exames ({filteredExams.length})</h2>
                </div>

                {/* Desktop: Tabela */}
                <div className="exam-table-desktop overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Paciente</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Tipo de Exame</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Médico</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Data</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Status</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                            {filteredExams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{exam.patientName}</td>
                                    <td className="px-6 py-4">{exam.examType}</td>
                                    <td className="px-6 py-4">{exam.doctorAssignedName || 'Não atribuído'}</td>
                                    <td className="px-6 py-4">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4"><Badge status={exam.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onNavigateToDetail(exam.id)} className="btn-touch p-2 text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors" title="Ver Detalhes">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                            {onOpenRequestExam && (
                                                <button onClick={() => onOpenRequestExam(exam.patientId)} className="btn-touch p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Novo Exame">
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {onOpenOhif && (
                                                <button onClick={() => onOpenOhif(exam.id)} className="btn-touch p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors" title="OHIF">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                </button>
                                            )}
                                            {onEditExam && (
                                                <button onClick={() => { if (exam.status !== 'Concluído') onEditExam!(exam.id); else alert('Não é possível editar exames concluídos.'); }} className={`btn-touch p-2 rounded-lg transition-colors ${exam.status === 'Concluído' ? 'text-gray-300 cursor-not-allowed' : 'text-yellow-600 hover:bg-yellow-50'}`} disabled={exam.status === 'Concluído'}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                            )}
                                            {onDeleteExam && (
                                                <button onClick={() => { if (exam.status !== 'Concluído') handleDeleteClick(exam.id); else alert('Não é possível deletar exames concluídos.'); }} className={`btn-touch p-2 rounded-lg transition-colors ${exam.status === 'Concluído' ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`} disabled={exam.status === 'Concluído'}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredExams.length === 0 && (
                        <div className="text-center py-8 text-gray-500"><p>Nenhum exame encontrado.</p></div>
                    )}
                </div>

                {/* Mobile: Cards */}
                <div className="exam-card-mobile divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                    {filteredExams.map((exam) => (
                        <div key={exam.id} className="p-4 space-y-3">
                            <button onClick={() => onNavigateToDetail(exam.id)} className="btn-touch w-full flex flex-col gap-2 text-left">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-black text-gray-900 text-sm truncate">{exam.patientName}</p>
                                        <p className="text-[10px] text-gray-500">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')} · {exam.doctorAssignedName || 'Não atribuído'}</p>
                                    </div>
                                    <Badge status={exam.status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="bg-gray-100 text-gray-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">{exam.examType}</div>
                                    <span className="text-xs font-bold" style={{ color: 'var(--blue-600)' }}>Ver Detalhes →</span>
                                </div>
                            </button>
                            {/* Ações rápidas mobile */}
                            <div className="flex gap-2">
                                {onOpenOhif && (
                                    <button onClick={() => onOpenOhif(exam.id)} className="btn-touch flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>
                                        OHIF
                                    </button>
                                )}
                                {onEditExam && exam.status !== 'Concluído' && (
                                    <button onClick={() => onEditExam!(exam.id)} className="btn-touch flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase text-yellow-700" style={{ backgroundColor: '#fef9c3' }}>Editar</button>
                                )}
                                {onDeleteExam && exam.status !== 'Concluído' && (
                                    <button onClick={() => handleDeleteClick(exam.id)} className="btn-touch flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase text-red-700" style={{ backgroundColor: '#fee2e2' }}>Deletar</button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredExams.length === 0 && (
                        <div className="text-center py-8 text-gray-500"><p>Nenhum exame encontrado.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClinicExamsPage;
