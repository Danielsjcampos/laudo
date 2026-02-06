import React, { useState, useMemo } from 'react';
import type { Patient } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { PlusIcon } from '../../icons/PlusIcon';
import { AddPatientModal } from '../modals/AddPatientModal';
import SearchInput from '../../ui/SearchInput';

interface ClinicPatientsPageProps {
    patients: Patient[];
    onRegisterPatient?: (name: string, cpf: string, email: string) => void;
    onViewHistory?: (patientId: string) => void;
    onEditPatient?: (patientId: string) => void;
}

const ClinicPatientsPage: React.FC<ClinicPatientsPageProps> = ({ patients, onRegisterPatient, onViewHistory, onEditPatient }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => {
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.cpf.includes(searchTerm)
        );
    }, [patients, searchTerm]);

    return (
        <div>
            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={onRegisterPatient}
            />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Pacientes</h1>
                <div className="flex items-center space-x-4">
                    <div className="w-full max-w-xs">
                        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nome ou CPF..." />
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Cadastrar Paciente
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Todos os Pacientes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">CPF</th>
                                <th scope="col" className="px-6 py-3">E-mail</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{patient.name}</td>
                                    <td className="px-6 py-4">{patient.cpf}</td>
                                    <td className="px-6 py-4">{patient.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => onEditPatient?.(patient.id)}
                                            className="font-medium text-brand-blue-600 hover:underline"
                                        >
                                            Editar
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => onViewHistory?.(patient.id)}
                                            className="font-medium text-brand-blue-600 hover:underline"
                                        >
                                            Ver Histórico
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPatients.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>Nenhum paciente encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClinicPatientsPage;
