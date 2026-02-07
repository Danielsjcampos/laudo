import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';

interface EditPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, name: string, cpf: string, email: string) => void;
    patient: { id: string; name: string; cpf: string; email: string } | null;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({ isOpen, onClose, onSubmit, patient }) => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (patient) {
            setName(patient.name);
            setCpf(patient.cpf);
            setEmail(patient.email);
        }
    }, [patient]);

    if (!isOpen || !patient) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(patient.id, name, cpf, email);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Editar Paciente</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <span className="sr-only">Fechar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200 outline-none transition-all font-medium"
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">CPF</label>
                        <input
                            type="text"
                            required
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200 outline-none transition-all font-medium"
                            placeholder="000.000.000-00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200 outline-none transition-all font-medium"
                            placeholder="paciente@email.com"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Salvar Alterações</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
