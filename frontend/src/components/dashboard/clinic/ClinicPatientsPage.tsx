import React, { useState, useMemo } from 'react';
import type { Patient } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { PlusIcon } from '../../icons/PlusIcon';
import api from '../../../lib/api';
import { EditPatientModal } from '../modals/EditPatientModal';
import { AddPatientModal } from '../modals/AddPatientModal';
import SearchInput from '../../ui/SearchInput';

interface ClinicPatientsPageProps {
    patients: Patient[];
    onRegisterPatient: (data: { name: string, cpf: string, email: string, sex?: string }) => void;
}

const ClinicPatientsPage: React.FC<ClinicPatientsPageProps> = ({ patients, onRegisterPatient }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => {
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.cpf.includes(searchTerm)
        );
    }, [patients, searchTerm]);

    const handleEditClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
    };

    const handleUpdatePatient = async (id: string, name: string, cpf: string, email: string, sex?: string) => {
        try {
            await api.put(`/patients/${id}`, { name, cpf, email, sex });
            alert('Paciente atualizado com sucesso!');
            setIsEditModalOpen(false); // Close modal on success
            // Ideally trigger a data refresh here
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar paciente.');
        }
    };

    return (
        <div>
            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={onRegisterPatient}
            />

            <EditPatientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                patient={selectedPatient}
                onSubmit={handleUpdatePatient}
            />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-header">Gerenciamento de Pacientes</h1>
                    <div className="page-header-line" />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-64">
                        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nome ou CPF..." />
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Cadastrar Paciente
                    </Button>
                </div>
            </div>

            <div className="panel-card overflow-hidden">
                <div className="p-6 border-b" style={{ borderColor: 'var(--surface-border)' }}>
                    <h2 className="section-title">Todos os Pacientes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--surface-bg)' }}>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">Nome</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">CPF</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-left">E-mail</th>
                                <th scope="col" className="px-6 py-3 kpi-label text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{patient.name}</td>
                                    <td className="px-6 py-4">{patient.cpf}</td>
                                    <td className="px-6 py-4">{patient.email}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3 italic">
                                        <button onClick={() => handleEditClick(patient)} className="text-xs font-bold uppercase tracking-wider transition-all hover:text-blue-600" style={{ color: 'var(--blue-600)' }}>Editar</button>
                                        <button className="text-xs font-bold uppercase tracking-wider transition-all" style={{ color: 'var(--text-muted)' }}>Histórico</button>
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
