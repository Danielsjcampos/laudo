import React, { useState, useMemo } from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import { EditIcon } from '../../icons/EditIcon';
import SearchInput from '../../ui/SearchInput';
import { Button } from '../../ui/Button';

interface DoctorExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
}

const DoctorExamsPage: React.FC<DoctorExamsPageProps> = ({ exams, onNavigateToDetail }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const pendingExams = exams.filter(e => e.status === 'Aguardando Laudo' || e.status === 'Em Análise' || e.status === 'Laudando');

    const filteredExams = useMemo(() => {
        return pendingExams.filter(exam => 
            exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.examType.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pendingExams, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                   <h1 className="text-3xl font-bold text-gray-900">Exames Pendentes</h1>
                   <p className="text-gray-500 mt-1">Gerencie sua fila de laudos prioritários.</p>
                </div>
                <div className="w-full max-w-xs">
                    <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por paciente..." />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4">Prioridade</th>
                                <th scope="col" className="px-6 py-4">Paciente / Exame</th>
                                <th scope="col" className="px-6 py-4">Data</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredExams.map((exam) => (
                                <tr key={exam.id} className="bg-white hover:bg-brand-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        {exam.urgency === 'Urgente' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                                URGENTE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Rotina
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-base">{exam.patientName}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold bg-brand-blue-50 text-brand-blue-600 px-1.5 py-0.5 rounded uppercase">{exam.modality}</span>
                                                <span className="text-xs text-gray-500">{exam.examType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-500">
                                        {new Date(exam.dateRequested).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4"><Badge status={exam.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <Button 
                                            size="sm" 
                                            onClick={() => onNavigateToDetail(exam.id)} 
                                            className={exam.urgency === 'Urgente' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : ''}
                                        >
                                            <EditIcon className="w-4 h-4 mr-2" />
                                            Laudar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredExams.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                             <div className="bg-gray-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                             </div>
                             <p className="font-medium">Nenhum exame pendente na sua lista.</p>
                             <p className="text-sm mt-1">Acesse o Marketplace para buscar novos laudos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorExamsPage;
