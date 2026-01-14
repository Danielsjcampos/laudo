import React from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import { DownloadIcon } from '../../icons/DownloadIcon';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { Card } from '../../ui/Card';


interface PatientExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
}


const PatientExamsPage: React.FC<PatientExamsPageProps> = ({ exams, onNavigateToDetail }) => {
    
    const handleDownload = (e: React.MouseEvent, exam: Exam) => {
        e.stopPropagation(); // Prevent row click from triggering navigation
        alert(`Simulando download do laudo para: ${exam.examType} de ${new Date(exam.dateRequested).toLocaleDateString('pt-BR')}`);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Portal do Paciente</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <Card title="Meus Exames" value={exams.length} icon={<FileTextIcon className="h-8 w-8" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Meu Histórico de Exames</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tipo de Exame</th>
                                <th scope="col" className="px-6 py-3">Médico</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Laudo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam) => (
                                <tr key={exam.id} className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => onNavigateToDetail(exam.id)}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{exam.examType}</td>
                                    <td className="px-6 py-4">{exam.doctorAssignedName}</td>
                                    <td className="px-6 py-4">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4"><Badge status={exam.status} /></td>
                                    <td className="px-6 py-4">
                                        {exam.status === 'Concluído' ? (
                                            <button onClick={(e) => handleDownload(e, exam)} className="flex items-center font-medium text-brand-blue-600 hover:underline">
                                                <DownloadIcon className="w-4 h-4 mr-1"/>
                                                Baixar
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">Indisponível</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default PatientExamsPage;
