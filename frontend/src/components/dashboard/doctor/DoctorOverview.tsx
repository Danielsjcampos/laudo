
import React from 'react';
import type { Exam } from '../../../data/mockData';
import { Card } from '../../ui/Card';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { ClockIcon } from '../../icons/ClockIcon';
import { EditIcon } from '../../icons/EditIcon';
import { WalletIcon } from '../../icons/WalletIcon';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { BrainIcon } from '../../icons/BrainIcon';
import { Badge } from '../../ui/Badge';

interface DoctorOverviewProps {
    exams: Exam[];
    allExams: Exam[];
    onNavigateToPendingExams: () => void;
    onNavigateToDetail: (examId: string) => void;
    onNavigateToMarketplace: () => void;
    onNavigateToAiConsult: () => void;
    onNavigateToChat: () => void;
    onNavigateToFinancial: () => void;
    onAcceptExam: (examId: string) => void;
    isDutyMode: boolean;
    onToggleDutyMode: () => void;
}

const DoctorOverview: React.FC<DoctorOverviewProps> = ({ 
    exams, 
    allExams, 
    onNavigateToPendingExams, 
    onNavigateToDetail, 
    onNavigateToMarketplace, 
    onNavigateToAiConsult, 
    onNavigateToChat,
    onNavigateToFinancial,
    onAcceptExam,
    isDutyMode,
    onToggleDutyMode
}) => {
    const [modalityFilter, setModalityFilter] = React.useState('');
    const [regionFilter, setRegionFilter] = React.useState('');

    const filteredPendingExams = exams.filter(e => {
        const isPending = e.status === 'Aguardando Laudo' || e.status === 'Em Análise';
        const matchesModality = modalityFilter ? e.modality === modalityFilter : true;
        // Mock region check since we don't have region data on Exam interface yet, usually it's on Clinic.
        // For now we will skip region check or assume it matches if empty.
        const matchesRegion = true; 
        
        return isPending && matchesModality && matchesRegion;
    });

    const pendingExams = filteredPendingExams;
    const completedCount = exams.filter(e => e.status === 'Concluído').length;
    const estimatedEarnings = exams.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="page-header">Painel do Especialista</h1>
                    <div className="page-header-line" />
                    <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Bem-vindo de volta, Dr. Roberto. Há novos exames na fila.</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3 p-2 rounded-xl" style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDutyMode ? 'text-green-600' : 'text-gray-400'}`}>
                            {isDutyMode ? 'Modo Plantão Ativo' : 'Modo Plantão Inativo'}
                        </span>
                        <button 
                            onClick={onToggleDutyMode}
                            className="w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out"
                            style={{ backgroundColor: isDutyMode ? 'var(--teal-500)' : '#e5e7eb' }}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isDutyMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <div className="flex gap-2">
                         <select 
                            className="text-xs font-semibold rounded-xl py-2 px-3 focus:ring-0 focus:outline-none"
                            style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                            value={modalityFilter}
                            onChange={(e) => setModalityFilter(e.target.value)}
                        >
                            <option value="">Todas Modalidades</option>
                            <option value="RX">Raio-X (RX)</option>
                            <option value="TC">Tomografia (TC)</option>
                            <option value="RM">Ressonância (RM)</option>
                            <option value="MG">Mamografia (MG)</option>
                        </select>
                         <select 
                            className="text-xs font-semibold rounded-xl py-2 px-3 focus:ring-0 focus:outline-none"
                            style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                        >
                            <option value="">Todas Regiões</option>
                            <option value="SP">São Paulo</option>
                            <option value="RJ">Rio de Janeiro</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {[
                    { label: 'Marketplace', icon: <SparklesIcon className="h-4 w-4" />, action: () => onNavigateToMarketplace(), color: '#ffffff', bgColor: 'var(--teal-500)' },
                    { label: 'Consultório IA', icon: <BrainIcon className="h-4 w-4" />, action: () => onNavigateToAiConsult(), color: '#ffffff', bgColor: 'var(--blue-600)' },
                    { label: 'Meus Laudos', icon: <FileTextIcon className="h-4 w-4" />, action: () => onNavigateToPendingExams(), color: '#ffffff', bgColor: 'var(--status-warning)' },
                    { label: 'Mensagens', icon: <SparklesIcon className="h-4 w-4" />, action: () => onNavigateToChat(), color: 'var(--text-primary)', bgColor: 'var(--surface-bg)' },
                    { label: 'Meus Ganhos', icon: <WalletIcon className="h-4 w-4" />, action: () => onNavigateToFinancial(), color: 'var(--text-primary)', bgColor: 'var(--surface-bg)' },
                ].map((btn, i) => (
                    <button
                        key={i}
                        onClick={(e) => {
                            e.preventDefault();
                            btn.action();
                        }}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] shadow-sm"
                        style={{ backgroundColor: btn.bgColor, color: btn.color }}
                    >
                        {btn.icon}
                        {btn.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <Card title="Pendente na Fila" value={pendingExams.length} icon={<ClockIcon className="h-5 w-5" />} color="yellow" />
                <Card title="Concluídos (Mês)" value={completedCount} icon={<FileTextIcon className="h-5 w-5" />} color="green" />
                <Card title="Ganhos Estimados" value={`R$ ${estimatedEarnings.toLocaleString()}`} icon={<WalletIcon className="h-5 w-5" />} color="blue" />
                <div className="panel-dark p-6 flex items-center justify-between">
                    <div>
                        <p className="kpi-label" style={{ color: 'var(--teal-500)' }}>Sua Pontuação</p>
                        <p className="text-2xl font-black text-white mt-1">4.9 / 5.0</p>
                    </div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--teal-glow)', color: 'var(--teal-500)' }}>
                        <SparklesIcon className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Work Queue */}
                <div className="lg:col-span-2 panel-card overflow-hidden flex flex-col">
                    <div className="p-6 flex justify-between items-center border-b" style={{ borderColor: 'var(--surface-border)' }}>
                        <h2 className="section-title">Próximos da Fila</h2>
                        <button onClick={onNavigateToPendingExams} className="text-[10px] font-bold uppercase tracking-wider transition-colors" style={{ color: 'var(--teal-500)' }}>
                            Ver Fila Completa
                        </button>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                                    <th scope="col" className="px-6 py-3 kpi-label text-left">Paciente</th>
                                    <th scope="col" className="px-6 py-3 kpi-label text-left">Prioridade / Exame</th>
                                    <th scope="col" className="px-6 py-3 kpi-label text-left">Prazo Restante</th>
                                    <th scope="col" className="px-6 py-3 kpi-label text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pendingExams.slice(0, 5).map((exam, i) => (
                                    <tr key={exam.id} className="hover:bg-gray-50/50 transition-all cursor-pointer group" onClick={() => onNavigateToDetail(exam.id)}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{exam.patientName}</div>
                                            <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{exam.clinicName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${i === 0 ? 'bg-red-500 animate-ping' : ''}`} style={i !== 0 ? { backgroundColor: 'var(--teal-500)' } : {}} />
                                                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{exam.examType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>2H 15M</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                {(exam as any).externalSuggestion && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onNavigateToDetail(exam.id);
                                                            // Logic to focus suggestion will be in ExamDetailPage
                                                        }}
                                                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 text-[9px] font-black uppercase tracking-tighter hover:bg-yellow-100 transition-colors"
                                                    >
                                                        <SparklesIcon className="w-3 h-3" />
                                                        Ver Sugestão
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                                                    style={{ backgroundColor: 'var(--navy-800)', color: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
                                                    <EditIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {pendingExams.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                <FileTextIcon className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                <p className="font-bold">Fila de trabalho vazia. Bom descanso!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar de Performance / Insights */}
                <div className="space-y-6">
                    <div className="panel-dark p-6">
                        <h3 className="kpi-label" style={{ color: 'var(--teal-500)' }}>Ganhos em Tempo Real</h3>
                        <p className="text-3xl font-black text-white mt-2 mb-1">R$ {(completedCount * 45).toLocaleString('pt-BR')}</p>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>Total acumulado hoje (estimativa)</p>
                        <div className="mt-6 pt-6 flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div>
                                <p className="text-[9px] font-bold uppercase" style={{ color: 'var(--text-on-dark-muted)', opacity: 0.6 }}>Último Laudo</p>
                                <p className="font-bold text-sm text-white">Há 12 min</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold uppercase" style={{ color: 'var(--text-on-dark-muted)', opacity: 0.6 }}>Próxima Retirada</p>
                                <p className="font-bold text-sm text-white">Dia 05</p>
                            </div>
                        </div>
                    </div>

                    <div className="panel-card p-6">
                        <h3 className="section-title mb-6">Sua Agilidade</h3>
                        <div className="space-y-5">
                            {[
                                { label: 'Tempo Médio / Laudo', val: '14 min', perc: 85 },
                                { label: 'Taxa de Retorno', val: '0.2%', perc: 98 },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                        <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                                        <span style={{ color: 'var(--teal-500)' }}>{stat.val}</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-bg)' }}>
                                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${stat.perc}%`, backgroundColor: 'var(--teal-500)' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Marketplace Preview - Últimos 5 Disponíveis */}
            {(() => {
                const marketplaceExams = allExams.filter(e => e.status === 'Disponível').slice(0, 5);
                if (marketplaceExams.length === 0) return null;
                return (
                    <div className="panel-card overflow-hidden">
                        <div className="p-6 flex justify-between items-center border-b" style={{ borderColor: 'var(--surface-border)' }}>
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="h-4 w-4" style={{ color: 'var(--teal-500)' }} />
                                <h2 className="section-title">Últimos do Marketplace</h2>
                            </div>
                            <button onClick={onNavigateToMarketplace} className="text-[10px] font-bold uppercase tracking-wider transition-colors" style={{ color: 'var(--teal-500)' }}>
                                Ver Todos
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                                        <th scope="col" className="px-6 py-3 kpi-label text-left">Paciente</th>
                                        <th scope="col" className="px-6 py-3 kpi-label text-left">Exame</th>
                                        <th scope="col" className="px-6 py-3 kpi-label text-left">Valor</th>
                                        <th scope="col" className="px-6 py-3 kpi-label text-left">Status</th>
                                        <th scope="col" className="px-6 py-3 kpi-label text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {marketplaceExams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50/50 transition-all cursor-pointer group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{exam.patientName}</div>
                                                <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{exam.clinicName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[10px] font-black px-3 py-1 rounded-lg w-max uppercase" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>
                                                    {exam.examType}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-sm" style={{ color: 'var(--teal-500)' }}>R$ {exam.price.toLocaleString('pt-BR')}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge status={exam.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onAcceptExam(exam.id); }}
                                                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all hover:shadow-md"
                                                    style={{ backgroundColor: 'var(--teal-500)', color: 'var(--navy-900)' }}
                                                >
                                                    Aceitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default DoctorOverview;
