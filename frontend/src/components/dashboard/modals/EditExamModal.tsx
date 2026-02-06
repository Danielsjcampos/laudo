
import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import type { Exam, ExamModality, ExamUrgency } from '../../../data/mockData';
import { useToast } from '../../../contexts/ToastContext';
import api from '../../../lib/api';

interface EditExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    exam: Exam;
    onUpdate: () => void;
}

const SPECIALTIES = ['Radiologia', 'Cardiologia', 'Neurologia', 'Pediatria', 'Ortopedia'];
const MODALITIES: ExamModality[] = ['RX', 'TC', 'RM', 'US', 'MG', 'OT'];
const URGENCIES: ExamUrgency[] = ['Rotina', 'Urgente'];

export const EditExamModal: React.FC<EditExamModalProps> = ({
    isOpen,
    onClose,
    exam,
    onUpdate,
}) => {
    const [examType, setExamType] = useState(exam?.examType || '');
    const [specialty, setSpecialty] = useState(exam?.specialtyRequired || SPECIALTIES[0]);
    const [modality, setModality] = useState<ExamModality>(exam?.modality || 'RX');
    const [urgency, setUrgency] = useState<ExamUrgency>(exam?.urgency || 'Rotina');
    const [bodyPart, setBodyPart] = useState(exam?.bodyPart || '');
    const [price, setPrice] = useState(exam?.price || 50.00);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (exam) {
            setExamType(exam.examType);
            setSpecialty(exam.specialtyRequired);
            setModality(exam.modality);
            setUrgency(exam.urgency);
            setBodyPart(exam.bodyPart || '');
            setPrice(exam.price);
        }
    }, [exam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.patch(`/exams/${exam.id}`, {
                examType,
                specialtyRequired: specialty,
                modality,
                urgency,
                bodyPart,
                price
            });
            addToast('Exame atualizado com sucesso!', 'success');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar exame:', error);
            addToast('Erro ao atualizar exame.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Exame">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <p className="text-sm font-bold text-brand-blue-600 mb-1">Paciente: {exam?.patientName}</p>
                        <div className="h-px bg-gray-100 w-full mb-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Modalidade</label>
                        <select
                            value={modality}
                            onChange={(e) => setModality(e.target.value as ExamModality)}
                            className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                        >
                            {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                        <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value as ExamUrgency)}
                            className={`w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none font-medium ${urgency === 'Urgente' ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-700'}`}
                        >
                            {URGENCIES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Exame</label>
                        <input
                            type="text"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Região/Parte do Corpo</label>
                        <input
                            type="text"
                            value={bodyPart}
                            onChange={(e) => setBodyPart(e.target.value)}
                            className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                        <select
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                        >
                            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Oferta ao Lauda (R$)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full pl-10 pr-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none font-bold text-gray-900"
                                step="0.01"
                                min="1"
                            />
                        </div>
                    </div>
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
