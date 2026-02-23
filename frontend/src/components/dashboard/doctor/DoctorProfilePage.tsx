import React from 'react';
import { Badge } from '../../ui/Badge';

export const DoctorProfilePage: React.FC = () => {
    // In a real app, this data would come from a context or API
    const doctorData = {
        name: 'Dr. Roberto Martins',
        specialty: 'Radiologista Sênior',
        crm: '123.456-SP',
        area: 'Radiologia e Diag. por Imagem',
        email: 'roberto.martins@doc.com',
        phone: '(11) 99999-8888',
        certificateValidUntil: '12/2026'
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meu Perfil Profissional</h1>
                    <p className="text-gray-500 font-medium mt-1">Visualize seus dados e documentos.</p>
                </div>
                <div className="bg-blue-50 text-brand-blue-600 px-4 py-2 rounded-lg text-xs font-bold">
                    Para editar seus dados, acesse Configurações {'>'} Perfil
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dados Cadastrais */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        Dados Cadastrais
                        <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black flex items-center gap-1.5 shadow-sm">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            CRM Verificado
                        </span>
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-20 h-20 bg-brand-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-brand-blue-200">
                                {doctorData.name.split(' ').map((n, i) => i < 2 ? n[0] : '').join('')}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">{doctorData.name}</h3>
                                <p className="text-sm text-gray-500">{doctorData.specialty}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">CRM</label>
                                <p className="font-bold text-gray-900">{doctorData.crm}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Especialidade</label>
                                <p className="font-bold text-gray-900">{doctorData.area}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email</label>
                                <p className="font-bold text-gray-900">{doctorData.email}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Telefone</label>
                                <p className="font-bold text-gray-900">{doctorData.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assinatura e Docs */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-black text-gray-900">Assinatura Digital</h2>
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                                Válida
                            </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-center min-h-[100px] mb-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Assinatura" className="h-12 opacity-70" />
                        </div>
                        <p className="text-xs text-gray-400 text-center">Certificado A3 válido até {doctorData.certificateValidUntil}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-6">Documentos e Contratos</h2>
                        <div className="space-y-3">
                             <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-50 p-2.5 rounded-lg text-red-600 group-hover:bg-red-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-700 text-sm">Contrato de Prestação de Serviços</p>
                                        <p className="text-[10px] text-gray-400">Assinado em 15/01/2024</p>
                                    </div>
                                </div>
                                <button className="text-brand-blue-600 font-bold text-sm hover:underline">Baixar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
