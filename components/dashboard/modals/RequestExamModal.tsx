
import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import type { Patient } from '../../../data/mockData';
import { useToast } from '../../../contexts/ToastContext';

interface RequestExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onSubmit: (patientId: string, examType: string, specialty: string, price: number) => void;
}

const SPECIALTIES = ['Radiologia', 'Cardiologia', 'Neurologia', 'Pediatria', 'Ortopedia'];

export const RequestExamModal: React.FC<RequestExamModalProps> = ({
  isOpen,
  onClose,
  patients,
  onSubmit,
}) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [examType, setExamType] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [price, setPrice] = useState(50.00);
  const { addToast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId && examType) {
      onSubmit(patientId, examType, specialty, price);
      addToast('Exame enviado para o Marketplace!', 'success');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Requisitar Novo Laudo">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Exame</label>
            <input
              type="text"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              placeholder="Ex: Ressonância de Crânio"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue-500"
                >
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Ofertado (R$)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue-500"
                  step="0.01"
                  min="1"
                />
              </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Enviar para Rede</Button>
        </div>
      </form>
    </Modal>
  );
};
