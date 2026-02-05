
import React from 'react';
import { mockClinics } from '../../../data/mockData';
import { Card } from '../../ui/Card';
import { ClinicIcon } from '../../icons/ClinicIcon';
import { UsersIcon } from '../../icons/UsersIcon';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { WalletIcon } from '../../icons/WalletIcon';
import { Button } from '../../ui/Button';

interface AdminOverviewProps {
    stats: any;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => {
    // Se não tiver stats carregado, usa um fallback amigável
    if (!stats) return <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest animate-pulse">Sincronizando com Neon...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight text-center md:text-left">Torre de Controle</h1>
                    <p className="text-gray-500 mt-1 text-sm text-center md:text-left">Visão geral do ecossistema LaudoDigital (Real-time)</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Button variant="outline" className="w-full sm:w-auto">Baixar Relatório Anual</Button>
                    <Button className="bg-brand-blue-700 w-full sm:w-auto">Gerar Relatório Consolidado</Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card title="Clínicas na Rede" value={stats.activeClinics} icon={<ClinicIcon className="h-6 w-6 md:h-8 md:w-8" />} color="blue" />
                <Card title="Corpo Clínico" value={stats.totalDoctors} icon={<UsersIcon className="h-6 w-6 md:h-8 md:w-8" />} color="green" />
                <Card title="Volume de Laudos" value={stats.totalExamsProcessed.toLocaleString('pt-BR')} icon={<FileTextIcon className="h-6 w-6 md:h-8 md:w-8" />} color="yellow" />
                <Card title="Faturamento Bruto" value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<WalletIcon className="h-6 w-6 md:h-8 md:w-8" />} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Gráfico Simulado de Volume Financeiro */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-10 gap-4">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800">Crescimento de Diagnósticos</h2>
                        <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400">
                            <span className="flex items-center"><div className="w-2 h-2 bg-brand-blue-500 rounded-full mr-1.5"></div> Realizado</span>
                            <span className="flex items-center"><div className="w-2 h-2 bg-brand-teal-400 rounded-full mr-1.5"></div> Projeção</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between space-x-2 md:space-x-4 h-48 md:h-64">
                        {[45, 62, 58, 85, 92, 78].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div className="w-full bg-brand-blue-50 group-hover:bg-brand-blue-100 rounded-t-lg transition-all duration-500 relative flex items-end overflow-hidden" style={{ height: `${val}%` }}>
                                    <div className="w-full bg-brand-blue-600 rounded-t-lg transition-all duration-700 delay-100 h-2/3"></div>
                                </div>
                                <span className="mt-2 text-[8px] md:text-[10px] font-bold text-gray-400 uppercase">Mes {i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Financeiro Rápido */}
                <div className="bg-gradient-to-br from-brand-blue-900 to-brand-blue-700 p-6 md:p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-brand-blue-200 font-bold uppercase text-[10px] tracking-widest mb-4">Receita de Taxas</h3>
                        <p className="text-3xl md:text-4xl font-extrabold mb-1">R$ {stats.platformProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="text-brand-blue-200 text-xs flex items-center">
                            <span className="bg-green-500/20 text-green-300 text-[9px] px-2 py-0.5 rounded-full mr-2">+12.4%</span> 
                            mês atual
                        </p>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between text-xs">
                            <span className="text-brand-blue-300">Total Transacionado</span>
                            <span className="font-bold">R$ {stats.totalTransferred.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-brand-teal-400 h-full w-[85%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Clínicas de Maior Volume</h2>
                    <div className="space-y-4 md:space-y-6">
                        {mockClinics.sort((a, b) => b.examCount - a.examCount).slice(0, 4).map(clinic => (
                            <div key={clinic.id} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-xl transition-colors">
                                <div className="flex items-center min-w-0">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-blue-50 flex items-center justify-center mr-3 md:mr-4 font-bold text-brand-blue-700 text-lg md:text-xl shrink-0">
                                        {clinic.name.charAt(0)}
                                    </div>
                                    <div className="truncate">
                                        <p className="font-bold text-gray-900 truncate text-sm md:text-base">{clinic.name}</p>
                                        <p className="text-[10px] md:text-xs text-gray-400 truncate">{clinic.location}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-gray-900 text-sm md:text-base">{clinic.examCount.toLocaleString('pt-BR')}</p>
                                    <p className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold">Laudos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Distribuição Ativa</h2>
                    <div className="space-y-4 md:space-y-6">
                        {[
                            { reg: 'São Paulo', val: 42, color: 'bg-brand-blue-600' },
                            { reg: 'Rio de Janeiro', val: 28, color: 'bg-brand-blue-400' },
                            { reg: 'Minas Gerais', val: 18, color: 'bg-brand-teal-500' }
                        ].map((item) => (
                            <div key={item.reg}>
                                <div className="flex justify-between text-[10px] mb-2">
                                    <span className="font-bold text-gray-600">{item.reg.toUpperCase()}</span>
                                    <span className="font-black text-gray-900">{item.val}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 md:h-3 overflow-hidden">
                                    <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
