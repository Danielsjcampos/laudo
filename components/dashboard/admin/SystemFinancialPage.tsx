
import React from 'react';
import { mockClinics, mockGlobalStats } from '../../../data/mockData';
import { Card } from '../../ui/Card';
import { WalletIcon } from '../../icons/WalletIcon';
import { Button } from '../../ui/Button';
import { ClinicIcon } from '../../icons/ClinicIcon';

const SystemFinancialPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Financeiro Consolidado</h1>
                    <p className="text-gray-500 font-medium">Gestão de fluxo de caixa, SaaS e taxas de marketplace</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" className="rounded-xl">Conciliação Bancária</Button>
                    <Button className="bg-brand-blue-700 rounded-xl">Fechar Mês Atual</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-blue-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                    <h3 className="text-brand-blue-300 text-[10px] font-black uppercase tracking-widest mb-2">Lucro da Plataforma (Take Rate)</h3>
                    <p className="text-4xl font-black">R$ {mockGlobalStats.platformProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="mt-6 flex items-center text-xs text-brand-blue-200">
                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mr-2">+15%</span> vs Jan/2024
                    </div>
                    <WalletIcon className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Transacionado</h3>
                    <p className="text-3xl font-black text-gray-900">R$ {mockGlobalStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="mt-6 flex flex-col space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-gray-400">Repassado (Médicos)</span>
                            <span className="text-gray-900">85%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-blue-600 h-full w-[85%]"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Receita SaaS (Assinaturas)</h3>
                    <p className="text-3xl font-black text-gray-900">R$ 48.200,00</p>
                    <div className="mt-6 flex space-x-2">
                        <div className="flex-1 bg-green-50 p-3 rounded-2xl">
                            <p className="text-[10px] font-bold text-green-700 uppercase">Ativas</p>
                            <p className="text-lg font-black text-green-900">45</p>
                        </div>
                        <div className="flex-1 bg-red-50 p-3 rounded-2xl">
                            <p className="text-[10px] font-bold text-red-700 uppercase">Inadimp.</p>
                            <p className="text-lg font-black text-red-900">3</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Receitas por Clínica */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 mb-8">Faturamento por Clínica (SaaS)</h2>
                    <div className="space-y-6">
                        {mockClinics.slice(0, 5).map(clinic => (
                            <div key={clinic.id} className="flex items-center justify-between group">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-brand-blue-50 transition-colors">
                                        <ClinicIcon className="h-5 w-5 text-gray-400 group-hover:text-brand-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{clinic.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{clinic.subscriptionStatus}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900">R$ {clinic.monthlyFee.toLocaleString('pt-BR')}</p>
                                    <p className="text-[9px] text-gray-400 font-bold">FECHAMENTO 15/{new Date().getMonth() + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-10 rounded-2xl text-xs font-black uppercase tracking-widest">Ver Todas as Assinaturas</Button>
                </div>

                {/* Últimos Repasses */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 mb-8">Próximos Repasses (Médicos)</h2>
                    <div className="space-y-6">
                        {[
                            { name: 'Dr. Roberto Martins', val: 4500.20, date: 'Em 2 dias', status: 'Processando' },
                            { name: 'Dra. Lúcia Lima', val: 3200.00, date: 'Amanhã', status: 'Agendado' },
                            { name: 'Dr. Fernando Gomes', val: 890.50, date: 'Em 5 dias', status: 'Pendente' },
                            { name: 'Dra. Marina Silva', val: 1540.00, date: 'Hoje', status: 'Processando' }
                        ].map((pay, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-brand-teal-100 text-brand-teal-700 flex items-center justify-center font-bold text-xs mr-4">
                                        {pay.name.charAt(4)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{pay.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{pay.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-brand-teal-600">R$ {pay.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{pay.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                        <p className="text-[10px] text-yellow-800 leading-relaxed">
                            <span className="font-black">NOTA:</span> Repasses são processados automaticamente via API bancária após a assinatura digital do laudo pelo médico e confirmação de pagamento pela clínica.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemFinancialPage;
