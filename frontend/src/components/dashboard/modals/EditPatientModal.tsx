import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';

interface EditPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, name: string, cpf: string, email: string, sex?: string) => void;
    patient: { id: string; name: string; cpf: string; email: string, sex?: string } | null;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({ isOpen, onClose, onSubmit, patient }) => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    
    // New Fields
    const [rg, setRg] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [sex, setSex] = useState('');
    const [motherName, setMotherName] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [phone, setPhone] = useState('');
    
    // Address
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');
    
    // Insurance
    const [insuranceName, setInsuranceName] = useState('');
    const [insuranceNumber, setInsuranceNumber] = useState('');
    const [insuranceValidity, setInsuranceValidity] = useState('');

    useEffect(() => {
        if (patient) {
            setName(patient.name);
            setCpf(patient.cpf);
            setEmail(patient.email);
            // Load other fields if they exist (need to cast or expect extended patient type)
            const p = patient as any;
            setRg(p.rg || '');
            setBirthDate(p.birthDate || '');
            setSex(p.sex || '');
            setMotherName(p.motherName || '');
            setCellphone(p.cellphone || '');
            setPhone(p.phone || '');
            
            if (p.address) {
                setCep(p.address.cep || '');
                setAddress(p.address.street || '');
                setNumber(p.address.number || '');
                setComplement(p.address.complement || '');
                setNeighborhood(p.address.neighborhood || '');
                setCity(p.address.city || '');
                setUf(p.address.uf || '');
            }
            
            if (p.insurance) {
                setInsuranceName(p.insurance.name || '');
                setInsuranceNumber(p.insurance.cardNumber || '');
                setInsuranceValidity(p.insurance.validity || '');
            }
        }
    }, [patient]);

    if (!isOpen || !patient) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Construct detailed update object (in real app, pass this entire object)
        onSubmit(patient.id, name, cpf, email, sex);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[90vh] flex flex-col">
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">Editar Paciente</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <span className="sr-only">Fechar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto flex-1 pr-2">
                    {/* Dados Pessoais */}
                    <section>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Dados Pessoais</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">CPF</label>
                                <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">RG</label>
                                <input type="text" value={rg} onChange={(e) => setRg(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Data de Nascimento</label>
                                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Sexo</label>
                                <select value={sex} onChange={(e) => setSex(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500">
                                    <option value="">Selecione</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                    <option value="O">Outro</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nome da Mãe</label>
                                <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            </div>
                        </div>
                    </section>

                    {/* Contato */}
                    <section>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Contato e Endereço</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">E-mail</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            </div>
                             <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Celular</label>
                                    <input type="text" value={cellphone} onChange={(e) => setCellphone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Telefone Fixo</label>
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                            </div>
                             <div className="md:col-span-2 grid grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">CEP</label>
                                    <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Endereço</label>
                                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                            </div>
                             <div className="grid grid-cols-3 gap-4 md:col-span-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Número</label>
                                    <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Complemento</label>
                                    <input type="text" value={complement} onChange={(e) => setComplement(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Bairro</label>
                                    <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Cidade</label>
                                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">UF</label>
                                    <input type="text" value={uf} onChange={(e) => setUf(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Convênio */}
                    <section>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Convênio</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Convênio</label>
                                <input type="text" value={insuranceName} onChange={(e) => setInsuranceName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1">Nº Carteirinha</label>
                                  <input type="text" value={insuranceNumber} onChange={(e) => setInsuranceNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1">Validade</label>
                                  <input type="text" value={insuranceValidity} onChange={(e) => setInsuranceValidity(e.target.value)} placeholder="MM/AA" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                               </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-50">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Salvar Alterações</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
