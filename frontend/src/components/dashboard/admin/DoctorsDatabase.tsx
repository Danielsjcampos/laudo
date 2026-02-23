import React, { useState, useMemo, useEffect } from 'react';
import { mockDoctors, Doctor } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { UsersIcon } from '../../icons/UsersIcon';
import { SearchIcon } from '../../icons/SearchIcon';
import { Badge } from '../../ui/Badge';
import { StarIcon } from '../../icons/StarIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { AddDoctorModal } from './AddDoctorModal';

const DoctorsDatabase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('Todas');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Local state for doctors to support adding new ones in this verified session
    const [doctorsList, setDoctorsList] = useState(mockDoctors);

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Doctor>>({});

    useEffect(() => {
        if (selectedDoctor) {
            setEditForm(selectedDoctor);
        }
    }, [selectedDoctor]);

    const specialties = ['Todas', ...new Set(doctorsList.map(d => d.specialty))];

    const filteredDoctors = useMemo(() => {
        return doctorsList.filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 doctor.crm.includes(searchTerm);
            const matchesSpecialty = filterSpecialty === 'Todas' || doctor.specialty === filterSpecialty;
            return matchesSearch && matchesSpecialty;
        });
    }, [searchTerm, filterSpecialty, doctorsList]);

    const handleApprove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        alert(`Médico ${id} aprovado com sucesso! (Mock)`);
        
        // Update local state to show 'Ativo'
        setDoctorsList(prev => prev.map(d => d.id === id ? { ...d, status: 'Ativo' } : d));
    };

    const handleAddDoctor = (doctor: Doctor) => {
        setDoctorsList(prev => [doctor, ...prev]);
        setIsAddModalOpen(false);
        alert('Médico cadastrado com sucesso! Aguardando aprovação final.');
    };

    const handleSaveDoctor = () => {
        if (editForm.id) {
            alert(`Dados de ${editForm.name} atualizados! (Mock)`);
            setDoctorsList(prev => prev.map(d => d.id === editForm.id ? { ...d, ...editForm } as Doctor : d));
            setIsEditing(false);
            setSelectedDoctor(null);
        }
    };

    const handleViewProfile = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsEditing(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
             <AddDoctorModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddDoctor} 
             />

             {selectedDoctor && (
                 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDoctor(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar Médico' : 'Perfil Profissional'}</h3>
                            <button onClick={() => setSelectedDoctor(null)} className="text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Fechar</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {!isEditing ? (
                            <>
                                <div className="text-center mb-6">
                                     <div className="w-24 h-24 rounded-full bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center font-black text-3xl mx-auto mb-3">
                                        {selectedDoctor.name.charAt(0)}
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900">{selectedDoctor.name}</h2>
                                    <p className="text-gray-500">{selectedDoctor.specialty}</p>
                                </div>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-bold text-gray-600">CRM</span>
                                        <span className="text-sm font-mono text-gray-900">{selectedDoctor.crm}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-bold text-gray-600">Status</span>
                                        <span className={`text-sm font-bold ${selectedDoctor.status === 'Ativo' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedDoctor.status}</span>
                                    </div>
                                     <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-bold text-gray-600">Avaliação</span>
                                        <span className="text-sm font-bold text-yellow-600 flex items-center"><StarIcon className="w-3 h-3 mr-1 fill-current"/> {selectedDoctor.rating}</span>
                                    </div>
                                </div>
        
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setSelectedDoctor(null)}>Fechar</Button>
                                    <Button className="flex-1" onClick={() => setIsEditing(true)}>Editar Dados</Button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome</label>
                                    <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Especialidade</label>
                                    <input type="text" value={editForm.specialty || ''} onChange={e => setEditForm({...editForm, specialty: e.target.value})} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">CRM</label>
                                    <input type="text" value={editForm.crm || ''} onChange={e => setEditForm({...editForm, crm: e.target.value})} className="w-full p-2 border rounded-lg" />
                                </div>
                                 <div className="flex gap-3 pt-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                    <Button className="flex-1" onClick={handleSaveDoctor}>Salvar</Button>
                                </div>
                            </div>
                        )}
                    </div>
                 </div>
             )}

            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
                <div>
                    <h1 className="page-header">Banco de Médicos</h1>
                    <div className="page-header-line" />
                    <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Gestão do corpo clínico global da plataforma</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Cadastrar Médico
                    </Button>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Buscar nome ou CRM..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 w-full sm:w-64"
                            style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <select 
                        value={filterSpecialty}
                        onChange={(e) => setFilterSpecialty(e.target.value)}
                        className="px-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-2"
                        style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                    >
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="panel-card p-6 hover:shadow-md transition-shadow group animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl" style={{ backgroundColor: 'var(--teal-glow)', color: 'var(--teal-600)' }}>
                                {doctor.name.charAt(0)}
                            </div>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest" style={
                                doctor.status === 'Ativo' 
                                ? { backgroundColor: 'var(--teal-glow)', color: 'var(--teal-600)' } 
                                : { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-warning)' }
                            }>
                                {doctor.status.toUpperCase()}
                            </span>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-brand-blue-600 transition-colors">{doctor.name}</h3>
                            <p className="text-xs text-gray-400 font-medium mb-4">CRM: {doctor.crm} • {doctor.specialty}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center">
                                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-sm font-black text-gray-700">{doctor.rating > 0 ? doctor.rating : 'Novo'}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Desde {new Date(doctor.joinedDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-2">
                            <Button variant="outline" className="flex-1 text-xs rounded-xl" onClick={() => handleViewProfile(doctor)}>Perfil</Button>
                            {doctor.status === 'Pendente' ? (
                                <Button className="flex-1 text-xs rounded-xl bg-green-600 hover:bg-green-700" onClick={(e) => handleApprove(doctor.id, e)}>Aprovar</Button>
                            ) : (
                                <Button className="flex-1 text-xs rounded-xl bg-brand-blue-600">Histórico</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">Nenhum médico encontrado com esses critérios.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorsDatabase;
