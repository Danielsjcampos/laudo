import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { PlusIcon } from '../../icons/PlusIcon';
import { WalletIcon } from '../../icons/WalletIcon';
import { Clinic } from '../../../data/mockData';
import api from '../../../lib/api';
import { AddClinicModal } from '../modals/AddClinicModal';

const ClinicManagement: React.FC = () => {
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchClinics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/clinics');
            setClinics(response.data);
        } catch (error) {
            console.error('Error fetching clinics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <AddClinicModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={fetchClinics} 
            />

            {/* Manage Modal */}
            {selectedClinic && (
                 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedClinic(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                             <div>
                                <h3 className="text-2xl font-black text-gray-900">{selectedClinic.name}</h3>
                                <p className="text-gray-500">{selectedClinic.location}</p>
                            </div>
                            <button onClick={() => setSelectedClinic(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <span className="sr-only">Fechar</span>
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Volume Total</p>
                                <p className="text-xl font-black text-gray-900">{selectedClinic.examCount.toLocaleString()} Laudos</p>
                                <p className="text-xs text-brand-blue-600 font-bold mt-1">Transacionado: R$ {(selectedClinic.examCount * 45).toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Administrador</p>
                                <p className="text-lg font-bold text-gray-900 truncate">{selectedClinic.adminEmail}</p>
                                <p className="text-xs text-gray-500 mt-1">Desde {new Date(selectedClinic.joinedDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900">Ações Administrativas</h4>
                            <div className="flex gap-4">
                                <Button className="flex-1 bg-brand-blue-600">Editar Dados</Button>
                                <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">Suspender</Button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-header">Gerência de Parceiros</h1>
                    <div className="page-header-line" />
                    <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Controle de clínicas parceiras e métricas de volume</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Adicionar Nova Unidade
                </Button>
            </div>

            <div className="panel-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                            <th className="px-8 py-4 kpi-label">Parceiro / Admin</th>
                            <th className="px-8 py-4 kpi-label">Localização</th>
                            <th className="px-8 py-4 kpi-label">Volume (Laudos)</th>
                            <th className="px-8 py-4 kpi-label">Status</th>
                            <th className="px-8 py-4 kpi-label text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                        {clinics.map(clinic => (
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
                                    <p className="font-bold text-gray-900">{clinic.location}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                                            <span>{clinic.examCount.toLocaleString()} laudos</span>
                                        </div>
                                        <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-brand-teal-500 h-full transition-all duration-1000" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full" style={
                                        clinic.subscriptionStatus === 'Ativa' 
                                        ? { backgroundColor: 'var(--teal-glow)', color: 'var(--teal-600)' } 
                                        : { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)' }
                                    }>
                                        {clinic.subscriptionStatus === 'Ativa' ? 'ATIVO' : 'INATIVO'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-gray-300 hover:text-brand-blue-600 transition-colors mr-2">
                                        <WalletIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => setSelectedClinic(clinic)} className="text-sm font-black text-gray-900 hover:text-brand-blue-600 transition-colors">GERENCIAR</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div className="p-12 text-center text-gray-400">Carregando parceiros...</div>
                )}
                {!loading && clinics.length === 0 && (
                     <div className="p-12 text-center text-gray-400">Nenhuma unidade cadastrada.</div>
                )}
            </div>
            
            <div className="p-8 bg-brand-teal-900 rounded-[2rem] text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Precisa expandir a rede?</h3>
                    <p className="text-brand-teal-200 text-sm max-w-md">O convite para novas clínicas gera automaticamente um link de integração para o sistema de gestão local via HL7/DICOM.</p>
                </div>
                <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-white text-brand-teal-900 font-black px-10 py-4 rounded-2xl hover:bg-brand-teal-50 relative z-10"
                >
                    Convidar Nova Clínica
                </Button>
                {/* Efeito Visual de Fundo */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-teal-400/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default ClinicManagement;
