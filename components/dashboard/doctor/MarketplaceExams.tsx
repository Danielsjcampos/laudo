
import React from 'react';
import type { Exam } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { ClinicIcon } from '../../icons/ClinicIcon';
import { ClockIcon } from '../../icons/ClockIcon';

interface MarketplaceExamsProps {
  exams: Exam[];
  onAccept: (examId: string) => void;
}

const MarketplaceExams: React.FC<MarketplaceExamsProps> = ({ exams, onAccept }) => {
  const availableExams = exams.filter(e => e.status === 'Disponível');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace de Exames</h1>
      <p className="text-gray-600 mb-8">Exames disponíveis para laudo em sua especialidade.</p>

      {availableExams.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center">
          <p className="text-gray-500">Nenhum exame disponível no momento. Fique de olho!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableExams.map(exam => (
            <div key={exam.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-brand-blue-50 text-brand-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">
                    {exam.specialtyRequired}
                  </span>
                  <span className="text-brand-teal-600 font-bold text-lg">
                    R$ {exam.price.toFixed(2)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.examType}</h3>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClinicIcon className="h-4 w-4 mr-2" />
                    {exam.clinicName}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Postado em: {new Date(exam.dateRequested).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <Button onClick={() => onAccept(exam.id)} className="w-full">
                  Aceitar Laudo
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceExams;
