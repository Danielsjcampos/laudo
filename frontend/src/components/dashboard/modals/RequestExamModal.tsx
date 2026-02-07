
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
    bodyPart: string,
    file: File | null
  ) => void;
  initialPatientId?: string;
}

const SPECIALTIES = ['Radiologia', 'Cardiologia', 'Neurologia', 'Pediatria', 'Ortopedia'];
const MODALITIES: ExamModality[] = ['RX', 'TC', 'RM', 'US', 'MG', 'OT'];
const URGENCIES: ExamUrgency[] = ['Rotina', 'Urgente'];

export const RequestExamModal: React.FC<RequestExamModalProps> = ({
  isOpen,
  onClose,
  patients,
  onSubmit,
  initialPatientId
}) => {
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.id || '');

  // Update patientId when initialPatientId changes or modal opens
  React.useEffect(() => {
    if (initialPatientId) {
      setPatientId(initialPatientId);
    } else if (!patientId && patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [initialPatientId, isOpen, patients]);
  const [examType, setExamType] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [modality, setModality] = useState<ExamModality>('RX');
  const [urgency, setUrgency] = useState<ExamUrgency>('Rotina');
  const [bodyPart, setBodyPart] = useState('');
  const [price, setPrice] = useState(50.00);
  const [file, setFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId && examType) {
      // In a real scenario, we would upload the file here
      // For now, we'll pass it to onSubmit which App.tsx will handle
      onSubmit(patientId, examType, specialty, price, modality, urgency, bodyPart || 'Geral', file);
      addToast('Exame enviado para o Marketplace!', 'success');
      onClose();
    } else if (!file) {
      addToast('Selecione um arquivo DICOM', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      addToast(`Arquivo ${e.target.files[0].name} selecionado`, 'info');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Requisitar Novo Laudo">
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 h-full">

        {/* Coluna Esquerda - 4/12 */}
        <div className="col-span-12 md:col-span-4 space-y-3 flex flex-col">
          {/* File Upload - Vertical */}
          <div
            onClick={() => document.getElementById('dicom-upload')?.click()}
            className={`flex-1 min-h-[140px] border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer hover:bg-gray-50 ${file ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-gray-200'}`}
          >
            <input id="dicom-upload" type="file" accept=".dcm" className="hidden" onChange={handleFileChange} />
            <div className={`p-3 rounded-xl ${file ? 'bg-brand-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {file ?
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> :
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              }
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{file ? file.name : 'Upload DICOM'}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">.dcm (Max 500MB)</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Paciente</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-brand-blue-500 outline-none"
            >
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Prioridade</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as ExamUrgency)}
              className={`w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black outline-none ${urgency === 'Urgente' ? 'text-red-600 bg-red-50' : 'text-gray-900'}`}
            >
              {URGENCIES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>


        {/* Coluna Direita - 8/12 */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-3 content-start">
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Descrição</label>
            <input
              type="text"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              placeholder="Ex: TC Crânio"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Modalidade</label>
            <select
              value={modality}
              onChange={(e) => setModality(e.target.value as ExamModality)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 outline-none"
            >
              {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Especialidade</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 outline-none"
            >
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Parte do Corpo</label>
            <input
              type="text"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              placeholder="Ex: Cabeça"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <div className="col-span-2 mt-1">
            <div className="bg-brand-blue-600 p-3 rounded-2xl shadow-lg flex items-center justify-between gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-brand-blue-200 mb-0.5">Oferta</label>
                <p className="text-[9px] text-brand-blue-100 opacity-80">Valor líquido</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-brand-blue-300 font-bold text-xs">R$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-24 bg-transparent border-b border-brand-blue-400 text-white font-black text-lg text-right focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Botões alinhados na direita inferior */}
          <div className="col-span-2 flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-4 py-2 border-gray-200 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cancelar</Button>
            <Button type="submit" className="px-6 py-2 bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg font-black uppercase tracking-widest text-[10px]">Enviar</Button>
          </div>
        </div>


      </form>
    </Modal>
  );
};
