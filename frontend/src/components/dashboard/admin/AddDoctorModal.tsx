import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Doctor } from '../../../data/mockData';

interface AddDoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (doctor: Doctor) => void;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [crm, setCrm] = useState('');
    const [uf, setUf] = useState('SP');
    const [loading, setLoading] = useState(false);
    const [verifiedData, setVerifiedData] = useState<{ name: string; specialty: string; source: string } | null>(null);
    const [error, setError] = useState('');
    const [isManualEdit, setIsManualEdit] = useState(false);

    const handleVerifyCRM = async () => {
        setLoading(true);
        setError('');
        setVerifiedData(null);
        setIsManualEdit(false);

        try {
            const response = await fetch(`http://localhost:3001/api/common/verify-crm?crm=${crm}&uf=${uf}`);
            if (!response.ok) {
                throw new Error('Falha na comunicação com o servidor');
            }
            const data = await response.json();
            
            if (data && data.name) {
                // Map backend sources to frontend UI identifiers
                let uiSource = 'none';
                if (data.source === 'Official') uiSource = 'council';
                else if (data.source === 'Search') uiSource = 'internet';
                else if (data.source === 'ProfessionalMock') uiSource = 'local';
                else if (data.source === 'Internal') uiSource = 'local';

                setVerifiedData({
                    name: data.name,
                    specialty: data.specialty,
                    source: uiSource
                });
            } else {
                setError('Este número não foi localizado nos registros médicos (CRM) de ' + uf + '.');
                // If not found, we automatically offer manual edit
                setVerifiedData({
                    name: '',
                    specialty: '',
                    source: 'none'
                });
                setIsManualEdit(true);
            }
        } catch (err: any) {
            console.error('Error verifying CRM:', err);
            setError('O serviço de consulta oficial está instável. Por favor, insira os dados manualmente.');
            setVerifiedData({
                name: '',
                specialty: '',
                source: 'none'
            });
            setIsManualEdit(true);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!verifiedData) return;

        const newDoctor: Doctor = {
            id: `d${Date.now()}`,
            name: verifiedData.name,
            crm: `${crm}-${uf}`,
            specialty: verifiedData.specialty,
            status: 'Pendente',
            joinedDate: new Date().toISOString(),
            rating: 0
        };

        onAdd(newDoctor);
        onClose();
        setCrm('');
        setVerifiedData(null);
        setIsManualEdit(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900">Cadastrar Novo Médico</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!verifiedData ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CRM</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={crm}
                                    onChange={(e) => setCrm(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none"
                                    placeholder="Ex: 123456"
                                />
                                <select 
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value)}
                                    className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none bg-white font-bold"
                                >
                                    {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA'].map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                            {error && (
                                <div className="mt-2 space-y-2">
                                    <p className="text-red-500 text-xs font-bold">{error}</p>
                                    <a 
                                        href={`https://www.google.com/search?q=CRM+${crm}+${uf}+medico`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-brand-blue-600 hover:text-brand-blue-800 underline block"
                                    >
                                        Procurar no Google por "{crm}-{uf}"
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="bg-brand-blue-50 p-4 rounded-xl border border-brand-blue-100">
                            <p className="text-xs text-brand-blue-700 leading-relaxed mb-2">
                                <strong>Validação Externa:</strong> Para garantir a veracidade dos dados, recomendamos consultar o CRM diretamente na base oficial.
                            </p>
                            <a 
                                href="https://guiamedico.cremesp.org.br" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] font-black uppercase tracking-widest text-brand-blue-600 hover:text-brand-blue-800 flex items-center"
                            >
                                Acessar Guia Médico CREMESP
                                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </div>

                        <Button 
                            className="w-full h-12 text-lg" 
                            onClick={handleVerifyCRM}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Consultando Base...
                                </span>
                            ) : 'Buscar Dados'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                                {verifiedData.source === 'none' ? (
                                    <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                ) : (
                                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">
                                {verifiedData.source === 'none' ? 'Identificação Manual' : 'Médico Identificado'}
                            </h4>
                            <p className="text-gray-500 text-xs px-8">
                                {verifiedData.source === 'council' && `Verificado nos registros do CFM / CREMESP.`}
                                {verifiedData.source === 'internet' && `Encontrado via indexação pública (Doctoralia/Escavador).`}
                                {verifiedData.source === 'local' && `Identificado em nossa base de demonstração técnica.`}
                                {verifiedData.source === 'none' && `Não foi possível validar automaticamente. Por favor, confira os dados.`}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nome do Médico</label>
                                {isManualEdit ? (
                                    <input 
                                        type="text" 
                                        value={verifiedData.name} 
                                        onChange={(e) => setVerifiedData({...verifiedData, name: e.target.value})}
                                        className="w-full p-2 border rounded-lg text-sm font-bold text-gray-900" 
                                    />
                                ) : (
                                    <p className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">{verifiedData.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Especialidade Principal</label>
                                {isManualEdit ? (
                                    <input 
                                        type="text" 
                                        value={verifiedData.specialty} 
                                        onChange={(e) => setVerifiedData({...verifiedData, specialty: e.target.value})}
                                        className="w-full p-2 border rounded-lg text-sm font-bold text-gray-900" 
                                    />
                                ) : (
                                    <p className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">{verifiedData.specialty}</p>
                                )}
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">CRM/UF</label>
                                    <p className="font-mono font-bold text-gray-900">{crm}-{uf}</p>
                                </div>
                                {!isManualEdit && (
                                    <button 
                                        onClick={() => setIsManualEdit(true)} 
                                        className="text-xs font-bold text-brand-blue-600 hover:text-brand-blue-800 underline"
                                    >
                                        Corrigir Dados?
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => { setVerifiedData(null); setIsManualEdit(false); }}>Voltar</Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleConfirm}>Confirmar Cadastro</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
