
import React, { useState, useMemo } from 'react';
import { mockDoctors } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { UsersIcon } from '../../icons/UsersIcon';
import { SearchIcon } from '../../icons/SearchIcon';
import { Badge } from '../../ui/Badge';
import { StarIcon } from '../../icons/StarIcon';

const DoctorsDatabase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('Todas');

    const specialties = ['Todas', ...new Set(mockDoctors.map(d => d.specialty))];

    const filteredDoctors = useMemo(() => {
        return mockDoctors.filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 doctor.crm.includes(searchTerm);
            const matchesSpecialty = filterSpecialty === 'Todas' || doctor.specialty === filterSpecialty;
            return matchesSearch && matchesSpecialty;
        });
    }, [searchTerm, filterSpecialty]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Banco de Médicos</h1>
                    <p className="text-gray-500 font-medium">Gestão do corpo clínico global da plataforma</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Buscar nome ou CRM..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue-500 outline-none w-full sm:w-64"
                        />
                    </div>
                    <select 
                        value={filterSpecialty}
                        onChange={(e) => setFilterSpecialty(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue-500 outline-none"
                    >
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center font-black text-2xl shadow-inner">
                                {doctor.name.charAt(0)}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                                doctor.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
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
                            <Button variant="outline" className="flex-1 text-xs rounded-xl">Perfil</Button>
                            {doctor.status === 'Pendente' ? (
                                <Button className="flex-1 text-xs rounded-xl bg-green-600 hover:bg-green-700">Aprovar</Button>
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


