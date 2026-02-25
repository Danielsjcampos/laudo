import React, { useState, useMemo } from 'react';
import type { Exam } from '../../../data/mockData';
import { Button } from '../../ui/Button';
import { ClinicIcon } from '../../icons/ClinicIcon';
import { ClockIcon } from '../../icons/ClockIcon';
import SearchInput from '../../ui/SearchInput';

interface MarketplaceExamsProps {
  exams: Exam[];
  onAccept: (examId: string) => void;
  hasActiveExam: boolean;
  isDutyMode?: boolean;
  compactMode?: boolean;
}

const MODALITIES = ['RX', 'TC', 'RM', 'US', 'MG', 'OT'];
const REGIONS = ['Sul', 'Sudeste', 'Centro-Oeste', 'Nordeste', 'Norte']; // Mock regions

const MarketplaceExams: React.FC<MarketplaceExamsProps> = ({ exams, onAccept, hasActiveExam, isDutyMode = false, compactMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [regionFilter, setRegionFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const availableExams = exams.filter(e => e.status === 'Disponível');

  const filteredExams = useMemo(() => {
    let result = availableExams.filter(exam => {
      const matchesSearch = 
        exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.clinicName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesModality = selectedModalities.length === 0 || selectedModalities.includes(exam.modality);
      const matchesUrgency = !onlyUrgent || exam.urgency === 'Urgente';
      const matchesRegion = regionFilter ? true : true; // Mock: In real app, check exam.clinic.region

      return matchesSearch && matchesModality && matchesUrgency && matchesRegion;
    });

    // Priority: Urgent first
    return result.sort((a, b) => {
        if (a.urgency === 'Urgente' && b.urgency !== 'Urgente') return -1;
        if (a.urgency !== 'Urgente' && b.urgency === 'Urgente') return 1;
        return 0;
    });
  }, [availableExams, searchTerm, selectedModalities, onlyUrgent, regionFilter]);

  const toggleModality = (mod: string) => {
    setSelectedModalities(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  return (
    <div className={`flex ${compactMode ? 'flex-col gap-4' : 'flex-col lg:flex-row gap-6 lg:gap-8'}`}>
      {/* Filters — botão toggle no mobile */}
      <div className="lg:hidden flex items-center gap-2">
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar exames..." />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-touch shrink-0 px-3 py-2 rounded-xl text-sm font-bold border"
          style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
        >
          🔍
        </button>
      </div>
      {/* Filters Sidebar/Topbar */}
      <div className={`shrink-0 ${compactMode ? 'flex flex-row items-center gap-3 overflow-x-auto pb-2 w-full custom-scrollbar' : 'w-full lg:w-64 space-y-6 lg:block'} ${showFilters || compactMode ? 'block' : 'hidden'}`}>
        {!compactMode && (
          <div className="hidden lg:block">
              <h2 className="section-title mb-4">Filtros</h2>
              <SearchInput 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                  placeholder="Buscar exames..." 
              />
          </div>
        )}

        {compactMode && (
           <div className="w-56 shrink-0">
               <SearchInput 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                  placeholder="Buscar..." 
              />
           </div>
        )}

        <div className={compactMode ? 'shrink-0' : ''}>
            {!compactMode && <h3 className="kpi-label mb-3">Prioridade</h3>}
            <label className={`flex items-center space-x-3 p-2 rounded-xl cursor-pointer transition-colors hover:opacity-80 ${compactMode ? 'border whitespace-nowrap bg-white' : ''}`} style={compactMode ? { borderColor: 'var(--surface-border)' } : { backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${onlyUrgent ? 'bg-red-500 border-red-500' : 'border-gray-300 bg-white'}`}>
                    {onlyUrgent && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={onlyUrgent} 
                    onChange={() => setOnlyUrgent(!onlyUrgent)} 
                />
                <span className={`text-xs font-bold ${onlyUrgent ? 'text-red-600' : 'text-gray-600'}`}>Apenas Urgentes</span>
            </label>
        </div>

        <div className={compactMode ? 'shrink-0 w-36' : ''}>
            {!compactMode && <h3 className="kpi-label mb-3">Região</h3>}
            <select 
                value={regionFilter} 
                onChange={(e) => setRegionFilter(e.target.value)}
                className={`w-full p-2 text-xs font-bold rounded-xl focus:outline-none focus:ring-2`}
                style={{ backgroundColor: compactMode ? '#ffffff' : 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
            >
                <option value="">Todas Regiões</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
        </div>

        <div className={compactMode ? 'shrink-0 flex items-center' : ''}>
            {!compactMode && <h3 className="kpi-label mb-3">Modalidade</h3>}
            <div className={compactMode ? 'flex gap-2' : 'space-y-2'}>
                {MODALITIES.map(mod => (
                    <label key={mod} className={`flex items-center space-x-2 cursor-pointer group ${compactMode ? 'px-3 py-2 border rounded-xl bg-white hover:bg-gray-50' : ''}`} style={compactMode ? { borderColor: selectedModalities.includes(mod) ? 'var(--brand-blue-600)' : 'var(--surface-border)' } : {}}>
                        {!compactMode && (
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedModalities.includes(mod) ? 'bg-brand-blue-600 border-brand-blue-600' : 'border-gray-300 bg-white group-hover:border-brand-blue-400'}`}>
                            {selectedModalities.includes(mod) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        )}
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={selectedModalities.includes(mod)} 
                            onChange={() => toggleModality(mod)} 
                        />
                        <span className={`text-xs font-bold ${selectedModalities.includes(mod) && compactMode ? 'text-brand-blue-700' : 'text-gray-600 group-hover:text-gray-900'}`}>{mod}</span>
                    </label>
                ))}
            </div>
        </div>
      </div>

      {/* Grid de exames */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="page-header">Marketplace</h1>
                <div className="page-header-line" />
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Mostrando {filteredExams.length} de {availableExams.length} disponíveis
            </div>
        </div>

        {filteredExams.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <ClinicIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum exame encontrado</h3>
                <p className="text-gray-500 mt-1">Tente ajustar seus filtros de busca.</p>
            </div>
        ) : compactMode ? (
           <div className="flex flex-col gap-3 pb-4">
              {filteredExams.map(exam => {
                 const isUrgent = exam.urgency === 'Urgente';
                 const isPriorityWarning = isUrgent && !isDutyMode;
                 const isDisabled = false; // Bypassing block as per user request to allow taking multiple exams
                 
                 let buttonText = 'Pegar';
                 let buttonTitle = 'Pegar exame para laudar';
                 
                 if (isPriorityWarning) {
                     buttonTitle = 'Prioridade: Recomendado para médicos em plantão, mas disponível para você.';
                 }

                 return (
                    <div key={exam.id} className={`rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:shadow-md border ${isPriorityWarning ? 'border-amber-200 bg-amber-50/30' : 'bg-white'}`} style={{ borderColor: isPriorityWarning ? undefined : 'var(--surface-border)' }}>
                       <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
                          <div className="flex flex-col items-center justify-center gap-1 shrink-0 w-12">
                             {isUrgent && <span className="bg-red-100 text-red-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Urg</span>}
                             <span className="bg-brand-blue-100 text-brand-blue-700 text-xs font-black px-2 py-1 rounded-md">{exam.modality}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{exam.examType}</h3>
                                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md shrink-0 hidden sm:block">{exam.bodyPart || 'Geral'}</span>
                             </div>
                             <div className="flex items-center text-xs text-gray-500 gap-4">
                                <span className="flex items-center truncate"><ClinicIcon className="h-3 w-3 mr-1 text-gray-400 shrink-0" />{exam.clinicName}</span>
                                <span className="items-center shrink-0 hidden sm:flex"><ClockIcon className="h-3 w-3 mr-1 text-gray-400 shrink-0" />{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</span>
                             </div>
                          </div>
                          
                          <div className="shrink-0 flex items-center justify-end gap-6 sm:ml-4">
                             <div className="text-right hidden sm:block">
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Valor</p>
                                 <span className="text-sm font-black" style={{ color: 'var(--teal-500)' }}>R$ {exam.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                             </div>
                             <Button 
                                 onClick={() => onAccept(exam.id)} 
                                 className={`btn-touch text-xs px-4 py-2 font-black uppercase tracking-wider ${isDisabled ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'shadow-md shadow-brand-blue-200/50'}`}
                                 disabled={isDisabled}
                                 title={buttonTitle}
                             >
                                 {buttonText}
                             </Button>
                          </div>
                       </div>
                    </div>
                 );
              })}
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {filteredExams.map(exam => {
                const isUrgent = exam.urgency === 'Urgente';
                const isPriorityWarning = isUrgent && !isDutyMode;
                const isDisabled = false;
                
                let buttonText = 'Pegar Agora';
                let buttonTitle = 'Pegar exame para laudar';
                
                if (isPriorityWarning) {
                    buttonTitle = 'Prioridade: Recomendado para médicos em plantão, mas disponível para você.';
                }

                return (
                <div key={exam.id} className={`rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col group overflow-hidden ${isPriorityWarning ? 'border-amber-200' : ''}`} style={{ backgroundColor: 'var(--surface-card)', borderColor: isPriorityWarning ? undefined : 'var(--surface-border)' }}>
                    <div className="p-5 flex-grow relative">
                        {isUrgent && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                                Urgente
                            </div>
                        )}
                        {isPriorityWarning && (
                            <div className="absolute top-0 left-0 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase tracking-tight">
                                Prioridade Plantão
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-brand-blue-100 text-brand-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                                {exam.modality}
                            </span>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                {exam.bodyPart || 'Geral'}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-brand-blue-600 transition-colors">
                            {exam.examType}
                        </h3>
                        
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                                <ClinicIcon className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="truncate">{exam.clinicName}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t flex items-center justify-between transition-colors" style={{ borderColor: 'var(--surface-border)', backgroundColor: 'var(--surface-bg)' }}>
                        <div className="flex flex-col">
                            <span className="kpi-label">Valor</span>
                            <span className="text-lg font-black" style={{ color: 'var(--teal-500)' }}>R$ {exam.price.toFixed(2)}</span>
                        </div>
                        <Button 
                            onClick={() => onAccept(exam.id)} 
                            className={`btn-touch shadow-lg ${isDisabled ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'shadow-brand-blue-200/50'}`}
                            disabled={isDisabled}
                            title={buttonTitle}
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceExams;
