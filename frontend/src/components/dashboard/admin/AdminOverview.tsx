
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
    if (!stats) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--teal-500)', borderTopColor: 'transparent' }} />
                <p className="kpi-label">Sincronizando dados...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="page-header">Torre de Controle</h1>
                    <div className="page-header-line" />
                    <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Visão geral do ecossistema LaudoDigital (Real-time)</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Button variant="outline" className="w-full sm:w-auto btn-touch">Baixar Relatório</Button>
                    <Button variant="primary" className="w-full sm:w-auto btn-touch">Relatório Consolidado</Button>
                </div>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <Card title="Clínicas na Rede" value={stats.activeClinics ?? 0} icon={<ClinicIcon className="h-5 w-5" />} color="blue" />
                <Card title="Corpo Clínico" value={stats.totalDoctors ?? 0} icon={<UsersIcon className="h-5 w-5" />} color="teal" />
                <Card title="Volume de Laudos" value={(stats.totalExamsProcessed ?? 0).toLocaleString('pt-BR')} icon={<FileTextIcon className="h-5 w-5" />} color="yellow" />
                <Card title="Faturamento Bruto" value={`R$ ${(stats.totalRevenue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<WalletIcon className="h-5 w-5" />} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Panel (Dark) */}
                <div className="lg:col-span-2 panel-dark p-6 md:p-8 flex flex-col overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h2 className="section-title" style={{ color: 'var(--text-on-dark-muted)' }}>Crescimento de Diagnósticos</h2>
                        </div>
                        <div className="flex items-center space-x-4 text-[10px] font-bold" style={{ color: 'var(--text-on-dark-muted)' }}>
                            <span className="flex items-center"><div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: 'var(--teal-500)' }} /> Realizado</span>
                            <span className="flex items-center"><div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: 'var(--blue-500)' }} /> Projeção</span>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between space-x-2 md:space-x-4 h-48 md:h-56">
                        {[45, 62, 58, 85, 92, 78].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div
                                    className="w-full rounded-t-lg transition-all duration-500 relative flex items-end overflow-hidden"
                                    style={{ height: `${val}%`, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                >
                                    <div
                                        className="w-full rounded-t-lg transition-all duration-700 delay-100"
                                        style={{ height: '65%', backgroundColor: 'var(--teal-500)' }}
                                    />
                                </div>
                                <span className="mt-2 text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>
                                    Mes {i + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Card (Dark) */}
                <div className="panel-dark p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="kpi-label" style={{ color: 'var(--text-on-dark-muted)' }}>Receita de Taxas</h3>
                        <p className="text-3xl md:text-4xl font-black text-white mt-2 mb-1">
                            R$ {(stats.platformProfit ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs flex items-center mt-2" style={{ color: 'var(--text-on-dark-muted)' }}>
                            <span className="text-[9px] px-2 py-0.5 rounded-full mr-2" style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399' }}>+12.4%</span>
                            mês atual
                        </p>
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="flex justify-between text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                            <span>Total Transacionado</span>
                            <span className="font-bold text-white">R$ {(stats.totalTransferred ?? 0).toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                            <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: 'var(--teal-500)' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Clinics */}
                <div className="panel-card p-6 md:p-8">
                    <h2 className="section-title mb-6">Clínicas de Maior Volume</h2>
                    <div className="space-y-3">
                        {mockClinics.sort((a, b) => b.examCount - a.examCount).slice(0, 4).map(clinic => (
                            <div key={clinic.id} className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-xl transition-colors">
                                <div className="flex items-center min-w-0">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 font-bold text-sm shrink-0"
                                        style={{ backgroundColor: 'rgba(0,229,198,0.08)', color: 'var(--teal-600)' }}
                                    >
                                        {clinic.name.charAt(0)}
                                    </div>
                                    <div className="truncate">
                                        <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{clinic.name}</p>
                                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{clinic.location}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{(clinic.examCount ?? 0).toLocaleString('pt-BR')}</p>
                                    <p className="kpi-label">Laudos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribution */}
                <div className="panel-card p-6 md:p-8">
                    <h2 className="section-title mb-6">Distribuição Ativa</h2>
                    <div className="space-y-5">
                        {[
                            { reg: 'São Paulo', val: 42, color: 'var(--blue-600)' },
                            { reg: 'Rio de Janeiro', val: 28, color: 'var(--teal-500)' },
                            { reg: 'Minas Gerais', val: 18, color: 'var(--blue-400)' }
                        ].map((item) => (
                            <div key={item.reg}>
                                <div className="flex justify-between text-[10px] mb-2">
                                    <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{item.reg}</span>
                                    <span className="font-black" style={{ color: 'var(--text-primary)' }}>{item.val}%</span>
                                </div>
                                <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--surface-bg)' }}>
                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
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
