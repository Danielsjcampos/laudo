import React, { useState, useMemo } from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import { EditIcon } from '../../icons/EditIcon';
import { CompleteReportModal } from '../modals/CompleteReportModal';
import SearchInput from '../../ui/SearchInput';

interface DoctorExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
    onCompleteReport: (examId: string) => void;
}

const DoctorExamsPage: React.FC<DoctorExamsPageProps> = ({ exams, onNavigateToDetail, onCompleteReport }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const pendingExams = exams.filter(e => e.status === 'Aguardando Laudo' || e.status === 'Em Análise');

    const filteredExams = useMemo(() => {
        return pendingExams.filter(exam => 
            exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.examType.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pendingExams, searchTerm]);

    const handleOpenModal = (exam: Exam) => {
        setSelectedExam(exam);
        setIsModalOpen(true);
    };

    const handleConfirmComplete = () => {
        if (selectedExam) {
            onCompleteReport(selectedExam.id);
        }
        setIsModalOpen(false);
        setSelectedExam(null);
    };

    return (
        <div>
            {selectedExam && (
                <CompleteReportModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    exam={selectedExam}
                    onConfirm={handleConfirmComplete}
                />
            )}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Exames Pendentes</h1>
                <div className="w-full max-w-xs">
                    <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por paciente ou exame..." />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Aguardando Laudo</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Paciente</th>
                                <th scope="col" className="px-6 py-3">Tipo de Exame</th>
                                <th scope="col" className="px-6 py-3">Data da Requisição</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExams.map((exam) => (
                                <tr key={exam.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{exam.patientName}</td>
                                    <td className="px-6 py-4">{exam.examType}</td>
                                    <td className="px-6 py-4">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4"><Badge status={exam.status} /></td>
                                    <td className="px-6 py-4 flex items-center space-x-4">
                                        <button onClick={() => handleOpenModal(exam)} className="flex items-center font-medium text-brand-blue-600 hover:underline">
                                            <EditIcon className="w-4 h-4 mr-1" />
                                            Laudar
                                        </button>
                                        <button onClick={() => onNavigateToDetail(exam.id)} className="font-medium text-gray-500 hover:underline">Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredExams.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                             <p>Nenhum exame pendente encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorExamsPage;
