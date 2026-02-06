
import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import type { Patient, Exam } from '../../../data/mockData';
import { formatDate } from '../../../utils/formatters';

interface PatientHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
    exams: Exam[];
}

export const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
    isOpen,
    onClose,
    patient,
    exams,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Histórico: ${patient?.name}`}>
            <div className="space-y-4">
                <div className="bg-brand-blue-50 p-4 rounded-2xl border border-brand-blue-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-brand-blue-400">CPF</p>
                            <p className="text-sm font-bold text-brand-blue-900">{patient?.cpf}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-brand-blue-400">Email</p>
                            <p className="text-sm font-bold text-brand-blue-900 truncate">{patient?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Exames Realizados</h4>

                    {exams.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500">Nenhum exame encontrado para este paciente.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {exams.map((exam) => (
                                <div key={exam.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-blue-200 transition-colors shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-900">{exam.examType}</span>
                                        <span className="text-[10px] text-gray-500">{formatDate(exam.dateRequested)} • {exam.modality}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Badge variant={exam.status === 'Concluído' ? 'success' : 'warning'}>
                                            {exam.status}
                                        </Badge>
                                        <span className="text-xs font-bold text-gray-900">R$ {exam.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-end pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} className="px-8">Fechar</Button>
                </div>
            </div>
        </Modal>
    );
};
