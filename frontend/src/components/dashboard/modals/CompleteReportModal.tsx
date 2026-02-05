import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import type { Exam } from '../../../data/mockData';
import { useToast } from '../../../contexts/ToastContext';

interface CompleteReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  onConfirm: () => void;
}

export const CompleteReportModal: React.FC<CompleteReportModalProps> = ({
  isOpen,
  onClose,
  exam,
  onConfirm,
}) => {
  const { addToast } = useToast();

  const handleConfirm = () => {
    onConfirm();
    addToast('Laudo concluído com sucesso!', 'success');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Concluir Laudo">
        <div>
            <p className="text-gray-700 mb-2">
                Você está prestes a marcar o laudo do exame abaixo como concluído.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4 text-sm">
                <p><span className="font-semibold">Paciente:</span> {exam.patientName}</p>
                <p><span className="font-semibold">Exame:</span> {exam.examType}</p>
                <p><span className="font-semibold">Data:</span> {new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</p>
            </div>
            <p className="text-gray-700">
                Esta ação não pode ser desfeita. Deseja continuar?
            </p>
        </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleConfirm}>
          Confirmar Conclusão
        </Button>
      </div>
    </Modal>
  );
};
