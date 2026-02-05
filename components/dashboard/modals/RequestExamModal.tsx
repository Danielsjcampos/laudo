
import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import type { Patient, ExamModality, ExamUrgency } from '../../../data/mockData';
import { useToast } from '../../../contexts/ToastContext';

interface RequestExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onSubmit: (
    patientId: string, 
    examType: string, 
    specialty: string, 
    price: number,
    modality: ExamModality,
    urgency: ExamUrgency,
    bodyPart: string
  ) => void;
}

const SPECIALTIES = ['Radiologia', 'Cardiologia', 'Neurologia', 'Pediatria', 'Ortopedia'];
const MODALITIES: ExamModality[] = ['RX', 'TC', 'RM', 'US', 'MG', 'OT'];
const URGENCIES: ExamUrgency[] = ['Rotina', 'Urgente'];

export const RequestExamModal: React.FC<RequestExamModalProps> = ({
  isOpen,
  onClose,
  patients,
  onSubmit,
}) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [examType, setExamType] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [modality, setModality] = useState<ExamModality>('RX');
  const [urgency, setUrgency] = useState<ExamUrgency>('Rotina');
  const [bodyPart, setBodyPart] = useState('');
  const [price, setPrice] = useState(50.00);
  const { addToast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId && examType) {
      onSubmit(patientId, examType, specialty, price, modality, urgency, bodyPart || 'Geral');
      addToast('Exame enviado para o Marketplace!', 'success');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Requisitar Novo Laudo">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* File Upload Simulation */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-brand-blue-50 hover:border-brand-blue-300 transition-colors cursor-pointer group">
            <div className="bg-white p-3 rounded-full shadow-sm group-hover:shadow-md mb-3">
                 <svg className="w-6 h-6 text-gray-400 group-hover:text-brand-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Clique ou arraste arquivos DICOM</p>
            <p className="text-xs text-gray-500 mt-1">Suporta .dcm, .zip, .rar (Max 500MB)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-medical-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                >
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} - {p.cpf}</option>)}
                </select>
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
                  placeholder="Ex: Ressonância Magnética de Crânio com Contraste"
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
                  placeholder="Ex: Crânio"
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

        <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="px-6">Enviar Solicitação</Button>
        </div>
      </form>
    </Modal>
  );
};
