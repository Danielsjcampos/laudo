
import React from 'react';
import type { Exam } from '../../../data/mockData';
import { mockMonthlyEarningData } from '../../../data/mockData';
import { WalletIcon } from '../../icons/WalletIcon';
import { Button } from '../../ui/Button';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { ClockIcon } from '../../icons/ClockIcon';

interface DoctorFinancialPageProps {
    exams: Exam[];
}

const DoctorFinancialPage: React.FC<DoctorFinancialPageProps> = ({ exams }) => {
    const toReceive = exams.filter(e => e.paymentStatus === 'Pendente' && e.status === 'Concluído').reduce((acc, curr) => acc + curr.price, 0);
    const received = exams.filter(e => e.paymentStatus === 'Pago').reduce((acc, curr) => acc + curr.price, 0);
    const totalThisMonth = mockMonthlyEarningData[mockMonthlyEarningData.length - 1].value;
    const lastMonth = mockMonthlyEarningData[mockMonthlyEarningData.length - 2].value;
    const growth = ((totalThisMonth - lastMonth) / lastMonth) * 100;

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Meus Ganhos</h1>
                    <p className="text-gray-500 font-medium mt-1">Gestão de honorários e performance financeira</p>
                </div>
                <Button className="bg-brand-blue-600 hover:bg-brand-blue-700 shadow-xl shadow-brand-blue-100 rounded-2xl px-8 py-3">
                    Solicitar Resgate Antecipado
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Card Principal de Saldo */}
                <div className="lg:col-span-2 bg-gradient-to-br from-brand-blue-900 via-brand-blue-800 to-brand-blue-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <span className="text-brand-blue-300 font-black uppercase tracking-[0.2em] text-[10px]">Saldo Disponível</span>
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                    <span className="text-[10px] font-bold">CONTA VERIFICADA</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-2xl font-bold text-brand-blue-300 mr-2">R$</span>
                                <span className="text-6xl font-black tabular-nums tracking-tighter">
                                    {received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-8">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-brand-blue-300 text-[9px] font-black uppercase mb-1">Total Acumulado</p>
                                <p className="text-2xl font-black tabular-nums">R$ {(received + toReceive).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-brand-blue-300 text-[9px] font-black uppercase mb-1">A Liberar (Pendente)</p>
                                <p className="text-2xl font-black tabular-nums">R$ {toReceive.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                    {/* Background pattern */}
                    <WalletIcon className="absolute -right-12 -bottom-12 h-64 w-64 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                </div>

                {/* Badge de Performance / Reação */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                        <div className="w-28 h-28 bg-brand-teal-50 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="h-14 w-14 text-brand-teal-500" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-brand-blue-600 text-white p-2 rounded-xl shadow-lg">
                            <span className="text-[10px] font-black">TOP 1%</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Especialista Elite</h3>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Você concluiu {exams.filter(e => e.status === 'Concluído').length} laudos com 98% de satisfação este mês.</p>
                    </div>
                    <div className="w-full bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Progresso do Bônus Mensal</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-blue-600 h-full w-[85%] transition-all duration-1000"></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] font-bold text-gray-400">85/100 LAUDOS</span>
                            <span className="text-[10px] font-black text-brand-blue-600">+ R$ 500,00</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Gráfico de Evolução */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black text-gray-900">Evolução de Receita</h2>
                        <div className="flex items-center text-green-500 font-bold bg-green-50 px-3 py-1 rounded-full text-xs">
                            <span className="mr-1">↑</span> {growth.toFixed(1)}% vs mês ant.
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between space-x-4">
                        {mockMonthlyEarningData.map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div
                                    className="w-full bg-brand-blue-50 group-hover:bg-brand-blue-100 rounded-2xl transition-all duration-500 relative flex flex-col justify-end overflow-hidden"
                                    style={{ height: `${(data.value / 10000) * 100}%` }}
                                >
                                    <div className="w-full bg-brand-blue-600 h-1/2 rounded-t-2xl transition-all duration-700 opacity-80 group-hover:opacity-100"></div>
                                    <div className="absolute top-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-black text-brand-blue-800">R$ {data.value}</span>
                                    </div>
                                </div>
                                <span className="mt-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribuição por Modalidade */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">Por Categoria</h2>
                    <div className="space-y-6">
                        {[
                            { label: 'Cardiologia', val: 75, color: 'bg-brand-blue-600' },
                            { label: 'Radiologia', val: 15, color: 'bg-brand-teal-500' },
                            { label: 'Neurologia', val: 10, color: 'bg-yellow-500' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className="text-gray-900">{item.val}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                    <div className={`${item.color} h-full transition-all duration-1000 delay-${i * 200}`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Dica de Performance</p>
                        <p className="text-sm text-gray-600 font-medium italic">Exames de Ressonância estão com alta demanda e pagam 2.5x mais que Raio-X hoje.</p>
                    </div>
                </div>
            </div>

            {/* Tabela de Transações Modernizada */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-900">Extrato Detalhado</h2>
                    <div className="flex space-x-2">
                        <Button variant="outline" className="text-xs rounded-xl font-black uppercase">Filtrar Período</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-6">Data de Liberação</th>
                                <th className="px-10 py-6">Exame / Unidade Parceira</th>
                                <th className="px-10 py-6">Honorário Líquido</th>
                                <th className="px-10 py-6">Status da Transação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {exams.filter(e => e.status === 'Concluído').map(exam => (
                                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-10 py-6 text-gray-500 font-medium">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-10 py-6">
                                        <div className="font-bold text-gray-900 group-hover:text-brand-blue-600 transition-colors">{exam.examType}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{exam.clinicName}</div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-brand-teal-600 font-black text-lg">R$ {exam.price.toFixed(2)}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center">
                                            {exam.paymentStatus === 'Pago' ? (
                                                <div className="flex items-center text-green-600">
                                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Creditado</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-yellow-600">
                                                    <ClockIcon className="h-4 w-4 mr-2" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Processando</span>
                                                </div>
                                            )}
                                        </div>
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

export default DoctorFinancialPage;
