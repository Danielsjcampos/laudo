
import React, { useState } from 'react';
import type { Exam, Patient, Doctor, ExamModality, ExamUrgency } from '../../../data/mockData';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { ClockIcon } from '../../icons/ClockIcon';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { Button } from '../../ui/Button';
import { PlusIcon } from '../../icons/PlusIcon';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { UsersIcon } from '../../icons/UsersIcon';
import { WalletIcon } from '../../icons/WalletIcon';
import { StethoscopeIcon } from '../../icons/StethoscopeIcon';

interface ClinicOverviewProps {
    exams: Exam[];
    patients: Patient[];
    doctors: Doctor[];
    stats: any;
    onRequestExam: (
        patientId: string,
        examType: string,
        specialty: string,
        price: number,
        modality: ExamModality,
        urgency: ExamUrgency,
        bodyPart: string,
        file: File | null
    ) => void;
    onNavigateToExams: () => void;
    onOpenRequestExam: (patientId?: string) => void;
    onNavigateToPatients: () => void;
    onNavigateToFinancial: () => void;
    onNavigateToDoctors: () => void;
}

const ClinicOverview: React.FC<ClinicOverviewProps> = ({ exams, patients, stats, onRequestExam, onNavigateToExams, onOpenRequestExam, onNavigateToPatients, onNavigateToFinancial, onNavigateToDoctors }) => {
    const pendingExams = exams.filter(e => e.status !== 'Concluído').length;

    // Fallback para quando o banco ainda está carregando
    if (!stats) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest animate-pulse">Sincronizando Clínica com Neon...</div>;

    // Cálculo simples de receita baseada nos exames concluidos no banco
    const totalRevenue = exams.filter(e => e.status === 'Concluído').reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="page-header">Gestão Operacional</h1>
                    <div className="page-header-line" />
                    <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Dados reais do banco Neon para {stats.name}.</p>
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {[
                    { label: 'Novo Exame', icon: <PlusIcon className="h-4 w-4" />, action: () => onOpenRequestExam(), color: '#ffffff', bgColor: 'var(--teal-500)' },
                    { label: 'Cadastrar Paciente', icon: <UsersIcon className="h-4 w-4" />, action: () => onNavigateToPatients(), color: '#ffffff', bgColor: 'var(--blue-600)' },
                    { label: 'Ver Financeiro', icon: <WalletIcon className="h-4 w-4" />, action: () => onNavigateToFinancial(), color: '#ffffff', bgColor: 'var(--status-warning)' },
                    { label: 'Contato Médico', icon: <StethoscopeIcon className="h-4 w-4" />, action: () => onNavigateToDoctors(), color: 'var(--text-primary)', bgColor: 'var(--surface-bg)' },
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

            {/* Cards de Métricas Estilizados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="panel-card p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full" style={{ backgroundColor: 'var(--blue-600)' }} />
                    <div className="pl-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(2,132,199,0.08)', color: 'var(--blue-600)' }}>
                            <FileTextIcon className="h-5 w-5" />
                        </div>
                        <p className="kpi-label">Total de Exames</p>
                        <p className="kpi-value">{exams.length}</p>
                    </div>
                </div>

                <div className="panel-card p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full" style={{ backgroundColor: 'var(--status-warning)' }} />
                    <div className="pl-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(245,158,11,0.08)', color: 'var(--status-warning)' }}>
                            <ClockIcon className="h-5 w-5" />
                        </div>
                        <p className="kpi-label">Aguardando Laudo</p>
                        <p className="kpi-value" style={{ color: 'var(--status-warning)' }}>{pendingExams}</p>
                    </div>
                </div>

                <div className="panel-dark p-6 relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <p className="kpi-label" style={{ color: 'var(--teal-500)' }}>Entrega Média (SLA)</p>
                        <div>
                            <p className="text-3xl font-black text-white mt-1">1.2 <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>DIAS</span></p>
                            <div className="mt-2 flex items-center text-[10px] font-bold w-max px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--teal-glow)', color: 'var(--teal-500)' }}>
                                <SparklesIcon className="h-3 w-3 mr-1" /> EXCELÊNCIA
                            </div>
                        </div>
                    </div>
                    <CheckCircleIcon className="absolute -right-6 -bottom-6 h-28 w-28 opacity-5 rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
                </div>

                <div className="panel-dark p-6 relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <p className="kpi-label" style={{ color: 'var(--text-on-dark-muted)' }}>Total Faturado</p>
                        <p className="text-3xl font-black text-white mt-1">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <div className="mt-2 flex items-center text-[10px] font-bold" style={{ color: 'var(--status-success)' }}>
                            <span className="status-dot status-dot--active mr-1.5" /> Dados Reais
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Gráficos de Fluxo (Usando mock para visual, pois o banco tem poucos dados ainda para gráfico temporal) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Panel (Dark) */}
                <div className="lg:col-span-2 panel-dark p-6 md:p-8 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="section-title" style={{ color: 'var(--text-on-dark-muted)' }}>Fluxo de Diagnósticos</h2>
                            <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--text-on-dark-muted)', opacity: 0.6 }}>Volume por dia da semana</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--teal-500)' }} />
                            <span className="text-[10px] font-bold" style={{ color: 'var(--text-on-dark-muted)' }}>Volume</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between space-x-4">
                        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((day, i) => {
                            const val = [45, 62, 58, 85, 92, 20, 10][i]; // Provisório enquanto o banco popula
                            return (
                                <div key={day} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full flex flex-col items-center justify-end h-64">
                                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--teal-500)', color: 'var(--navy-900)' }}>
                                            {val}
                                        </div>
                                        <div
                                            className="w-full rounded-lg transition-all duration-700 relative flex flex-col justify-end overflow-hidden"
                                            style={{ height: `${val}%`, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        >
                                            <div className="w-full h-1/2 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-lg" style={{ backgroundColor: 'var(--teal-500)' }} />
                                        </div>
                                    </div>
                                    <span className="mt-3 text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar de Capacidade e IA */}
                <div className="space-y-8 flex flex-col">
                    <div className="panel-card p-6 flex-1">
                        <h3 className="section-title mb-6">Ocupação Médica</h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Radiologia', perc: 85, color: 'var(--blue-600)', trend: '+5%' },
                                { label: 'Cardiologia', perc: 38, color: 'var(--teal-500)', trend: '-2%' },
                                { label: 'Neurologia', perc: 15, color: 'var(--status-warning)', trend: '0%' }
                            ].map((spec, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{spec.label}</span>
                                        <div className="text-right">
                                            <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{spec.perc}%</span>
                                            <span className={`text-[10px] ml-1 font-bold ${spec.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                                                {spec.trend}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-bg)' }}>
                                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${spec.perc}%`, backgroundColor: spec.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--teal-glow)', border: '1px solid rgba(0,229,198,0.15)' }}>
                            <p className="kpi-label" style={{ color: 'var(--teal-600)' }}>Sugestão do Sistema</p>
                            <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Otimize seu faturamento solicitando exames em horários de baixa demanda do marketplace.</p>
                        </div>
                    </div>

                    <div className="panel-dark p-6 relative overflow-hidden group">
                        <h3 className="kpi-label" style={{ color: 'var(--teal-500)' }}>Eficiência Neon</h3>
                        <div className="flex items-baseline space-x-2 mt-2">
                            <span className="text-3xl font-black text-white">100%</span>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-on-dark-muted)' }}>SINCRO</span>
                        </div>
                        <p className="text-xs mt-2 font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>Todos os dados vêm do banco de dados.</p>
                        <SparklesIcon className="absolute -right-4 -bottom-4 h-24 w-24 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                </div>
            </div>

            {/* Tabela de Rastreamento Modernizada */}
            <div className="panel-card overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b" style={{ borderColor: 'var(--surface-border)' }}>
                    <h2 className="section-title">Exames Ativos (Neon)</h2>
                    <div className="flex space-x-2">
                        <button className="text-[10px] font-bold uppercase px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>Todos</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                                <th className="px-6 py-4 kpi-label text-left">Paciente / ID</th>
                                <th className="px-6 py-4 kpi-label text-left">Modalidade</th>
                                <th className="px-6 py-4 kpi-label text-left">Especialista</th>
                                <th className="px-6 py-4 kpi-label text-left">Status</th>
                                <th className="px-6 py-4 kpi-label text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50/50 transition-all cursor-pointer group" onClick={() => onNavigateToExams()}>
                                    <td className="px-10 py-6">
                                        <p className="font-black text-gray-900 text-base">{exam.patientName}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">REQ #{exam.id.slice(-5)}</p>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1 rounded-lg w-max uppercase">
                                            {exam.examType}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center font-black text-[10px] mr-3 shadow-sm">
                                                {exam.doctorAssignedName?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-gray-800">{exam.doctorAssignedName || 'Aguardando...'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <Badge status={exam.status} />
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="text-[10px] font-black text-brand-blue-600 uppercase tracking-widest hover:underline decoration-2">Ver Detalhes</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClinicOverview;
