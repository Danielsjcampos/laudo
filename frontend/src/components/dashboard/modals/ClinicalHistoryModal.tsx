
import React from 'react';

interface ClinicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: string | null;
  patientName: string;
}

export const ClinicalHistoryModal: React.FC<ClinicalHistoryModalProps> = ({ isOpen, onClose, history, patientName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-up">
        <div className="bg-brand-blue-600 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-xl">História Clínica</h2>
            <p className="text-brand-blue-100 text-sm mt-1">Paciente: {patientName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-h-[200px] overflow-x-hidden">
            <p className="text-gray-700 whitespace-pre-wrap break-words break-all leading-relaxed text-lg pb-4">
              {history || "Nenhuma história clínica informada pelo solicitante."}
            </p>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
