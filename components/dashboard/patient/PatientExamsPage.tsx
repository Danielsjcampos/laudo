import React, { useMemo } from 'react';
import type { Exam } from '../../../data/mockData';
import { Badge } from '../../ui/Badge';
import { DownloadIcon } from '../../icons/DownloadIcon';
import { FileTextIcon } from '../../icons/FileTextIcon';
import { Card } from '../../ui/Card';
import { ClockIcon } from '../../icons/ClockIcon';

interface PatientExamsPageProps {
    exams: Exam[];
    onNavigateToDetail: (examId: string) => void;
}

const PatientExamsPage: React.FC<PatientExamsPageProps> = ({ exams, onNavigateToDetail }) => {
    
    const handleDownload = (e: React.MouseEvent, exam: Exam) => {
        e.stopPropagation(); 
        alert(`Simulando download do laudo para: ${exam.examType}`);
    }

    const completedExams = useMemo(() => exams.filter(e => e.status === 'Concluído'), [exams]);
    const pendingExams = useMemo(() => exams.filter(e => e.status !== 'Concluído'), [exams]);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                     <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Portal do Paciente</h1>
                     <p className="text-gray-500 mt-2">Acompanhe seus exames e resultados em tempo real.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                     <div className="bg-green-50 p-3 rounded-xl mr-4">
                         <FileTextIcon className="h-6 w-6 text-green-600" />
                     </div>
                     <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Laudos Prontos</p>
                         <p className="text-2xl font-black text-gray-900">{completedExams.length}</p>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                     <div className="bg-yellow-50 p-3 rounded-xl mr-4">
                         <ClockIcon className="h-6 w-6 text-yellow-600" />
                     </div>
                     <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Em Análise</p>
                         <p className="text-2xl font-black text-gray-900">{pendingExams.length}</p>
                     </div>
                 </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Histórico de Exames</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-8 py-5">Exame</th>
                                <th scope="col" className="px-8 py-5">Data</th>
                                <th scope="col" className="px-8 py-5">Médico Responsável</th>
                                <th scope="col" className="px-8 py-5">Status</th>
                                <th scope="col" className="px-8 py-5 text-right">Laudo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-brand-blue-50/30 transition-all cursor-pointer group" onClick={() => onNavigateToDetail(exam.id)}>
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-gray-900 text-base">{exam.examType}</div>
                                        <div className="text-xs text-brand-blue-600 font-medium bg-brand-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">{exam.modality}</div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                                        {new Date(exam.dateRequested).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                                        {exam.doctorAssignedName || <span className="text-gray-300 italic">A definir</span>}
                                    </td>
                                    <td className="px-8 py-5"><Badge status={exam.status} /></td>
                                    <td className="px-8 py-5 text-right">
                                        {exam.status === 'Concluído' ? (
                                            <button 
                                                onClick={(e) => handleDownload(e, exam)} 
                                                className="inline-flex items-center text-sm font-bold text-brand-blue-600 hover:text-brand-blue-800 transition-colors bg-brand-blue-50 hover:bg-brand-blue-100 px-4 py-2 rounded-lg"
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-2"/>
                                                Baixar PDF
                                            </button>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Aguardando</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {exams.length === 0 && (
                        <div className="text-center py-16">
                             <p className="text-gray-400 font-medium">Você ainda não possui exames registrados.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default PatientExamsPage;
