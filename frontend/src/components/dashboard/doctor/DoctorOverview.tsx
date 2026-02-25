import React from 'react';
import type { Exam } from '../../../data/mockData';
import MarketplaceExams from './MarketplaceExams';
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
    const pendingExams = exams.filter(e => e.status === 'Aguardando Laudo' || e.status === 'Em Análise');
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
                <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
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

                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
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
                        className="btn-touch flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] shadow-sm w-full sm:w-auto"
                        style={{ backgroundColor: btn.bgColor, color: btn.color }}
                    >
                        {btn.icon}
                        {btn.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
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
                {/* Marketplace Integration */}
                <div className="lg:col-span-2 panel-card overflow-hidden flex flex-col">
                    <div className="p-6 h-full flex flex-col">
                        <MarketplaceExams 
                            exams={allExams} 
                            onAccept={onAcceptExam} 
                            hasActiveExam={false} 
                            isDutyMode={isDutyMode}
                            compactMode={true}
                        />
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

        </div>
    );
};

export default DoctorOverview;
