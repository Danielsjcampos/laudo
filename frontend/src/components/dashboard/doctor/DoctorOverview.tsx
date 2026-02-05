
import React from 'react';
import type { Exam } from '../../../data/mockData';
import { Card } from '../../ui/Card';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { ClockIcon } from '../../icons/ClockIcon';
import { EditIcon } from '../../icons/EditIcon';
import { WalletIcon } from '../../icons/WalletIcon';
import { SparklesIcon } from '../../icons/SparklesIcon';

interface DoctorOverviewProps {
    exams: Exam[];
    onNavigateToPendingExams: () => void;
    onNavigateToDetail: (examId: string) => void;
}

const DoctorOverview: React.FC<DoctorOverviewProps> = ({ exams, onNavigateToPendingExams, onNavigateToDetail }) => {
    const pendingExams = exams.filter(e => e.status === 'Aguardando Laudo' || e.status === 'Em Análise');
    const completedCount = exams.filter(e => e.status === 'Concluído').length;
    const estimatedEarnings = exams.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Painel do Especialista</h1>
                    <p className="text-gray-500 font-medium mt-1">Bem-vindo de volta, Dr. Roberto. Há novos exames na fila.</p>
                </div>
                <div className="bg-brand-blue-50 border border-brand-blue-100 px-6 py-3 rounded-2xl flex items-center shadow-sm">
                    <SparklesIcon className="h-5 w-5 text-brand-blue-600 mr-3" />
                    <span className="text-sm font-bold text-brand-blue-700">Meta Diária: {completedCount}/15 Laudos</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Pendente na Fila" value={pendingExams.length} icon={<ClockIcon className="h-6 w-6" />} color="yellow" />
                <Card title="Concluídos (Mês)" value={completedCount} icon={<FileTextIcon className="h-6 w-6" />} color="green" />
                <Card title="Ganhos Estimados" value={`R$ ${estimatedEarnings.toLocaleString()}`} icon={<WalletIcon className="h-6 w-6" />} color="blue" />
                <div className="bg-gradient-to-br from-brand-teal-500 to-brand-teal-700 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-70">Sua Pontuação</p>
                        <p className="text-2xl font-black">4.9 / 5.0</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <SparklesIcon className="h-6 w-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Listagem de Trabalho Principal */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-8 flex justify-between items-center border-b border-gray-50">
                         <h2 className="text-xl font-black text-gray-800">Próximos da Fila</h2>
                         <button onClick={onNavigateToPendingExams} className="font-black text-brand-blue-600 hover:text-brand-blue-700 transition-colors text-xs uppercase tracking-widest">
                            Ver Fila Completa
                        </button>
                    </div>
                     <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <tr className="border-b border-gray-50">
                                    <th scope="col" className="px-8 py-4">Paciente</th>
                                    <th scope="col" className="px-8 py-4">Prioridade / Exame</th>
                                    <th scope="col" className="px-8 py-4">Prazo Restante</th>
                                    <th scope="col" className="px-8 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pendingExams.slice(0, 5).map((exam, i) => (
                                    <tr key={exam.id} className="hover:bg-brand-blue-50/30 transition-all cursor-pointer group" onClick={() => onNavigateToDetail(exam.id)}>
                                        <td className="px-8 py-5">
                                            <div className="font-black text-gray-900">{exam.patientName}</div>
                                            <div className="text-[10px] text-gray-400 font-bold">{exam.clinicName}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${i === 0 ? 'bg-red-500 animate-ping' : 'bg-brand-blue-500'}`}></div>
                                                <span className="font-bold text-gray-700">{exam.examType}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded">2H 15M</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                className="bg-brand-blue-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-brand-blue-200"
                                            >
                                              <EditIcon className="w-4 h-4" />
                                            </button>
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
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Ganhos em Tempo Real</h3>
                        <p className="text-3xl font-black mb-1">R$ {(completedCount * 45).toLocaleString('pt-BR')}</p>
                        <p className="text-xs font-medium text-brand-blue-200">Total acumulado hoje (estimativa)</p>
                        <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                            <div>
                                <p className="text-[9px] font-black uppercase opacity-60">Último Laudo</p>
                                <p className="font-bold text-sm">Há 12 min</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase opacity-60">Próxima Retirada</p>
                                <p className="font-bold text-sm">Dia 05</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-tight">Sua Agilidade</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Tempo Médio / Laudo', val: '14 min', perc: 85 },
                                { label: 'Taxa de Retorno', val: '0.2%', perc: 98 },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-gray-500">{stat.label}</span>
                                        <span className="text-brand-blue-600">{stat.val}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-brand-blue-600 h-full transition-all duration-1000" style={{ width: `${stat.perc}%` }}></div>
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
