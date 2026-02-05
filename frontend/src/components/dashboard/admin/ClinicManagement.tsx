
import React from 'react';
import { mockClinics } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { PlusIcon } from '../../icons/PlusIcon';
import { WalletIcon } from '../../icons/WalletIcon';

const ClinicManagement: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Gerência de Parceiros</h1>
                    <p className="text-gray-500 font-medium">Controle de faturamento e métricas de uso por clínica</p>
                </div>
                <Button className="rounded-xl shadow-xl shadow-brand-blue-100">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Adicionar Nova Unidade
                </Button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                            <th className="px-8 py-6">Parceiro / Admin</th>
                            <th className="px-8 py-6">Mensalidade</th>
                            <th className="px-8 py-6">Uso (Laudos)</th>
                            <th className="px-8 py-6">Status Recorrência</th>
                            <th className="px-8 py-6 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {mockClinics.map(clinic => (
                            <tr key={clinic.id} className="hover:bg-gray-50/50 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-brand-blue-600 text-white flex items-center justify-center font-bold mr-4 shadow-lg shadow-brand-blue-100">
                                            {clinic.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-brand-blue-600 transition-colors">{clinic.name}</p>
                                            <p className="text-xs text-gray-400">{clinic.adminEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-gray-900">R$ {clinic.monthlyFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <p className="text-[10px] text-gray-400 font-bold italic">SaaS Enterprise</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                                            <span>{clinic.examCount.toLocaleString()} laudos</span>
                                            <span>Capacidade: 80%</span>
                                        </div>
                                        <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-brand-teal-500 h-full transition-all duration-1000" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${
                                        clinic.subscriptionStatus === 'Ativa' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {clinic.subscriptionStatus.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-gray-300 hover:text-brand-blue-600 transition-colors mr-2">
                                        <WalletIcon className="h-5 w-5" />
                                    </button>
                                    <button className="text-sm font-black text-gray-900 hover:text-brand-blue-600 transition-colors">GERENCIAR</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-8 bg-brand-teal-900 rounded-[2rem] text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Precisa expandir a rede?</h3>
                    <p className="text-brand-teal-200 text-sm max-w-md">O convite para novas clínicas gera automaticamente um link de integração para o sistema de gestão local via HL7/DICOM.</p>
                </div>
                <Button className="bg-white text-brand-teal-900 font-black px-10 py-4 rounded-2xl hover:bg-brand-teal-50 relative z-10">
                    Convidar Nova Clínica
                </Button>
                {/* Efeito Visual de Fundo */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-teal-400/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default ClinicManagement;
