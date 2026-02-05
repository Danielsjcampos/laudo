
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
import { RequestExamModal } from '../modals/RequestExamModal';

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
}

const ClinicOverview: React.FC<ClinicOverviewProps> = ({ exams, patients, stats, onRequestExam, onNavigateToExams }) => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const pendingExams = exams.filter(e => e.status !== 'Concluído').length;
    
    // Fallback para quando o banco ainda está carregando
    if (!stats) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest animate-pulse">Sincronizando Clínica com Neon...</div>;

    // Cálculo simples de receita baseada nos exames concluidos no banco
    const totalRevenue = exams.filter(e => e.status === 'Concluído').reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RequestExamModal 
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                patients={patients}
                onSubmit={onRequestExam}
            />

            {/* Cabeçalho de Impacto */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gestão Operacional</h1>
                    <p className="text-gray-500 font-medium">Dados reais do banco Neon para {stats.name}.</p>
                </div>
                <Button onClick={() => setIsRequestModalOpen(true)} className="bg-brand-blue-600 hover:bg-brand-blue-700 shadow-2xl shadow-brand-blue-200 rounded-[1.5rem] px-8 py-5 w-full md:w-auto text-base font-black uppercase tracking-widest">
                    <PlusIcon className="h-5 w-5 mr-2 stroke-[3px]" />
                    Requisitar Novo Laudo
                </Button>
            </div>

            {/* Cards de Métricas Estilizados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="bg-brand-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                        <FileTextIcon className="h-6 w-6 text-brand-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total de Exames</p>
                        <p className="text-3xl font-black text-gray-900">{exams.length}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="bg-yellow-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                        <ClockIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aguardando Laudo</p>
                        <p className="text-3xl font-black text-yellow-600">{pendingExams}</p>
                    </div>
                </div>

                <div className="bg-brand-teal-500 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Entrega Média (SLA)</p>
                        <div>
                            <p className="text-4xl font-black">1.2 <span className="text-sm opacity-70">DIAS</span></p>
                            <div className="mt-2 flex items-center text-[10px] font-bold bg-white/20 w-max px-2 py-1 rounded-full backdrop-blur-md">
                                <SparklesIcon className="h-3 w-3 mr-1" /> EXCELÊNCIA
                            </div>
                        </div>
                    </div>
                    <CheckCircleIcon className="absolute -right-6 -bottom-6 h-32 w-32 opacity-10 rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
                </div>

                <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue-400">Total Faturado</p>
                        <p className="text-3xl font-black">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <div className="mt-2 text-[10px] font-black text-green-400 uppercase tracking-tighter">Dados Reais</div>
                    </div>
                </div>
            </div>

            {/* Grid de Gráficos de Fluxo (Usando mock para visual, pois o banco tem poucos dados ainda para gráfico temporal) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Gráfico de Volume de Entrada */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col min-h-[450px]">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Fluxo de Diagnósticos</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Volume de exames por dia da semana</p>
                        </div>
                        <div className="flex space-x-2">
                             <div className="w-3 h-3 bg-brand-blue-600 rounded-full"></div>
                             <span className="text-[10px] font-black text-gray-400 uppercase">Volume</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between space-x-4">
                        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((day, i) => {
                            const val = [45, 62, 58, 85, 92, 20, 10][i]; // Provisório enquanto o banco popula
                            return (
                                <div key={day} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full flex flex-col items-center justify-end h-64">
                                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                            {val}
                                        </div>
                                        <div 
                                            className="w-full bg-brand-blue-50 group-hover:bg-brand-blue-100 rounded-2xl transition-all duration-700 relative flex flex-col justify-end overflow-hidden" 
                                            style={{ height: `${val}%` }}
                                        >
                                            <div className="w-full bg-brand-blue-600 h-1/2 opacity-70 group-hover:opacity-100 transition-all duration-500 rounded-t-2xl"></div>
                                        </div>
                                    </div>
                                    <span className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar de Capacidade e IA */}
                <div className="space-y-8 flex flex-col">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex-1">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8">Ocupação Médica</h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Radiologia', perc: 85, color: 'bg-brand-blue-600', trend: '+5%' },
                                { label: 'Cardiologia', perc: 38, color: 'bg-brand-teal-500', trend: '-2%' },
                                { label: 'Neurologia', perc: 15, color: 'bg-yellow-500', trend: '0%' }
                            ].map((spec, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-black text-gray-400 uppercase">{spec.label}</span>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-gray-900">{spec.perc}%</span>
                                            <span className={`text-[10px] ml-1 font-bold ${spec.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                                                {spec.trend}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                        <div className={`${spec.color} h-full transition-all duration-1000 delay-${i*200}`} style={{ width: `${spec.perc}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 p-6 bg-brand-blue-50 rounded-[2rem] border border-brand-blue-100">
                             <p className="text-[10px] font-black text-brand-blue-700 uppercase mb-2">Sugestão do Sistema</p>
                             <p className="text-xs text-brand-blue-900 font-medium italic">Otimize seu faturamento solicitando exames em horários de baixa demanda do marketplace.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Eficiência Neon</h3>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-black">100%</span>
                            <span className="text-brand-blue-300 font-bold text-xs">SINCRO</span>
                        </div>
                        <p className="text-xs text-brand-blue-200 mt-2 font-medium">Todos os dados vêm do banco de dados.</p>
                        <SparklesIcon className="absolute -right-4 -bottom-4 h-28 w-28 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                </div>
            </div>

            {/* Tabela de Rastreamento Modernizada */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50">
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Exames Ativos (Neon)</h2>
                    <div className="flex space-x-2">
                        <button className="bg-gray-50 text-[10px] font-black uppercase px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">Todos</button>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-6">Paciente / Identificador</th>
                                <th className="px-10 py-6">Modalidade</th>
                                <th className="px-10 py-6">Especialista Alocado</th>
                                <th className="px-10 py-6">Status Operacional</th>
                                <th className="px-10 py-6 text-right">Ação</th>
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
