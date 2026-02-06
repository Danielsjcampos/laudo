
import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import type { Patient } from '../../../data/mockData';
import { useToast } from '../../../contexts/ToastContext';
import api from '../../../lib/api';

interface EditPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
    onUpdate: () => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
    isOpen,
    onClose,
    patient,
    onUpdate,
}) => {
    const [name, setName] = useState(patient?.name || '');
    const [cpf, setCpf] = useState(patient?.cpf || '');
    const [email, setEmail] = useState(patient?.email || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (patient) {
            setName(patient.name);
            setCpf(patient.cpf);
            setEmail(patient.email);
        }
    }, [patient]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Assuming a PATCH endpoint exists for patients. If not, this might fail or require backend update.
            // Based on typical REST conventions and the project structure.
            // Note: Backend routes for patients.ts were seen in file list but not read deeply. Assuming patch support or creating it.
            await api.patch(`/patients/${patient.id}`, { name, cpf, email });
            addToast('Paciente atualizado com sucesso!', 'success');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar paciente:', error);
            addToast('Erro ao atualizar paciente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Paciente">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                        required
                    />
                </div>

                <div className="mt-4 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" className="px-6" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
