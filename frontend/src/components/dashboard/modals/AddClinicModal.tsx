import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import api from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

interface AddClinicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddClinicModal: React.FC<AddClinicModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [monthlyFee, setMonthlyFee] = useState(450);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/clinics', {
                name,
                location,
                adminEmail,
                monthlyFee
            });
            addToast('Unidade cadastrada com sucesso!', 'success');
            onSuccess();
            onClose();
            // Clear form
            setName('');
            setLocation('');
            setAdminEmail('');
        } catch (error: any) {
            console.error('Error adding clinic:', error);
            const message = error.response?.data?.error || 'Erro ao cadastrar unidade';
            addToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900">Adicionar Nova Unidade</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nome da Clínica</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none"
                            placeholder="Ex: Unidade Centro"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Localização (Cidade, UF)</label>
                        <input 
                            type="text" 
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none"
                            placeholder="Ex: São Paulo, SP"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">E-mail Administrativo</label>
                        <input 
                            type="email" 
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none"
                            placeholder="unidade@email.com"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 italic">Será criado um usuário automático para este e-mail.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mensalidade SaaS (R$)</label>
                        <input 
                            type="number" 
                            required
                            value={monthlyFee}
                            onChange={(e) => setMonthlyFee(Number(e.target.value))}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-blue-500 outline-none font-bold"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" className="flex-1 bg-brand-blue-600" disabled={loading}>
                            {loading ? 'Processando...' : 'Confirmar Cadastro'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
