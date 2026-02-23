import React from 'react';

import type { Doctor } from '../../../data/mockData';

export const ClinicSchedulePage: React.FC = () => (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Agenda de Exames</h1>
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Funcionalidade de agendamento em desenvolvimento.</p>
            <p className="text-sm text-gray-400 mt-2">Em breve você poderá gerenciar a agenda de todas as modalidades aqui.</p>
        </div>
    </div>
);

interface ClinicDoctorsContactPageProps {
    doctors: Doctor[];
    onContact: (doctorId: string) => void;
}

export const ClinicDoctorsContactPage: React.FC<ClinicDoctorsContactPageProps> = ({ doctors, onContact }) => (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contato Médico</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Diretório de Especialistas</h2>
            <p className="text-gray-500 mb-6">Entre em contato diretamente com os médicos que realizaram laudos para sua clínica.</p>
            <div className="space-y-4">
                {doctors.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum médico encontrado vinculado aos seus laudos.</p>
                ) : (
                    doctors.map(doctor => (
                        <div key={doctor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-brand-blue-100 rounded-full flex items-center justify-center text-brand-blue-600 font-bold">
                                    {doctor.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{doctor.name}</p>
                                    <p className="text-xs text-gray-500">{doctor.specialty} (CRM {doctor.crm})</p>
                                </div>
                            </div>
                            <button onClick={() => onContact(doctor.id)} className="text-sm font-bold text-brand-blue-600 hover:text-brand-blue-800">Enviar Mensagem</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);

export const ClinicAdminSupportPage: React.FC = () => (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Suporte Administrativo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-blue-600 text-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-2">Precisa de ajuda urgente?</h2>
                <p className="text-brand-blue-100 mb-6">Nossa equipe de suporte está disponível 24/7 para resolver problemas críticos.</p>
                <button className="bg-white text-brand-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-brand-blue-50 transition-colors">
                    Abrir Chat ao Vivo
                </button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Canais de Atendimento</h2>
                <ul className="space-y-3 text-gray-600">
                    <li>📧 suporte@laudodigital.com</li>
                    <li>📞 0800 123 4567</li>
                    <li>💬 WhatsApp: (11) 99999-9999</li>
                </ul>
            </div>
        </div>
    </div>
);

export const ClinicProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        razaoSocial: 'Saúde Plena Diagnósticos Ltda.',
        cnpj: '12.345.678/0001-90',
        endereco: 'Av. Paulista, 1000 - São Paulo, SP',
        responsavelTecnico: 'Dr. Silva (CRM 98765)',
        email: 'contato@saudeplena.com',
        telefone: '(11) 3333-4444'
    });

    const handleSave = () => {
        setIsEditing(false);
        // Here we would call the API to update the profile
        console.log('Saved profile:', formData);
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Perfil da Clínica</h1>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-6 py-2 rounded-xl font-bold transition-colors ${
                        isEditing 
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200' 
                        : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700 shadow-lg shadow-brand-blue-200'
                    }`}
                >
                    {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
                </button>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Dados Institucionais</h2>
                        {isEditing && <span className="text-xs font-bold text-amber-500 uppercase bg-amber-50 px-2 py-1 rounded">Modo de Edição</span>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 font-bold uppercase text-xs mb-1">Razão Social</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={formData.razaoSocial}
                                        onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-brand-blue-500 outline-none font-medium text-gray-900"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 p-2 pl-0">{formData.razaoSocial}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold uppercase text-xs mb-1">CNPJ</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={formData.cnpj}
                                        onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-brand-blue-500 outline-none font-medium text-gray-900 bg-gray-50 cursor-not-allowed"
                                        disabled
                                        title="CNPJ não pode ser alterado"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 p-2 pl-0">{formData.cnpj}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold uppercase text-xs mb-1">Responsável Técnico</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={formData.responsavelTecnico}
                                        onChange={(e) => setFormData({...formData, responsavelTecnico: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-brand-blue-500 outline-none font-medium text-gray-900"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 p-2 pl-0">{formData.responsavelTecnico}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 font-bold uppercase text-xs mb-1">Endereço</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={formData.endereco}
                                        onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-brand-blue-500 outline-none font-medium text-gray-900"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 p-2 pl-0">{formData.endereco}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold uppercase text-xs mb-1">Email Institucional</label>
                                {isEditing ? (
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-brand-blue-500 outline-none font-medium text-gray-900"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 p-2 pl-0">{formData.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold uppercase text-xs mb-1">Telefone / WhatsApp</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-brand-blue-500 outline-none font-medium text-gray-900"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 p-2 pl-0">{formData.telefone}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Contratos e Documentos</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-50 p-2 rounded text-red-600 group-hover:bg-red-100 transition-colors">PDF</div>
                                <span className="font-medium text-gray-700">Contrato de Prestação de Serviços.pdf</span>
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-gray-600">Assinado em 10/01/2025</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-50 p-2 rounded text-red-600 group-hover:bg-red-100 transition-colors">PDF</div>
                                <span className="font-medium text-gray-700">Aditivo Contratual 2026.pdf</span>
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-gray-600">Assinado em 05/02/2026</span>
                        </div>
                         {isEditing && (
                            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold hover:border-brand-blue-300 hover:text-brand-blue-500 transition-all flex items-center justify-center gap-2">
                                <span className="text-xl mb-0.5">+</span> Enviar Novo Documento
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
