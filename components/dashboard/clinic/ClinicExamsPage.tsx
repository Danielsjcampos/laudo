import React, { useState, useMemo } from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import SearchInput from '../../ui/SearchInput';

interface ClinicExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
}

const ClinicExamsPage: React.FC<ClinicExamsPageProps> = ({ exams, onNavigateToDetail }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredExams = useMemo(() => {
        return exams.filter(exam => 
            exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.doctorAssignedName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [exams, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Exames</h1>
                <div className="w-full max-w-xs">
                    <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por paciente, exame..." />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Todos os Exames</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Paciente</th>
                                <th scope="col" className="px-6 py-3">Tipo de Exame</th>
                                <th scope="col" className="px-6 py-3">Médico Responsável</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExams.map((exam) => (
                                <tr key={exam.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{exam.patientName}</td>
                                    <td className="px-6 py-4">{exam.examType}</td>
                                    <td className="px-6 py-4">{exam.doctorAssignedName || 'Não atribuído'}</td>
                                    <td className="px-6 py-4">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4"><Badge status={exam.status} /></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onNavigateToDetail(exam.id)} className="font-medium text-brand-blue-600 hover:underline">Ver Detalhes</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredExams.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>Nenhum exame encontrado.</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default ClinicExamsPage;
