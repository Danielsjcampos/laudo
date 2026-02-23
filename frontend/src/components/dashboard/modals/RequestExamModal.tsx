
import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import type { Patient, ExamModality, ExamUrgency } from '../../../data/mockData';
import { useToast } from '../../../contexts/ToastContext';
import api from '../../../lib/api';
import { EXAM_CATALOG, ModalityType, BodyRegion, ExamDefinition } from '../../../data/examDefinitions';

interface RequestExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onSubmit: (
    patientId: string,
    examType: string,
    specialty: string,
    price: number,
    modality: ExamModality,
    urgency: ExamUrgency,
    bodyPart: string,
    file: File | null,
    clinicalHistory?: string,
    medicalRequestFile?: File | null
  ) => void;
  initialPatientId?: string;
  onOpenRegisterPatient?: () => void;
}

const SPECIALTIES = ['Radiologia', 'Cardiologia', 'Neurologia', 'Pediatria', 'Ortopedia', 'Gastroenterologia', 'Urologia', 'Ginecologia', 'Angiologia'];
const MODALITIES: ExamModality[] = ['RX', 'TC', 'RM', 'USG', 'MG', 'OT']; // Using USG instead of US to match Catalog
const URGENCIES: ExamUrgency[] = ['Rotina', 'Urgente'];
const LATERALITIES = ['Direito', 'Esquerdo', 'Bilateral'];

export const RequestExamModal: React.FC<RequestExamModalProps> = ({
  isOpen,
  onClose,
  patients,
  onSubmit,
  initialPatientId,
  onOpenRegisterPatient
}) => {
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.id || '');
  
  // Update patientId when initialPatientId changes or modal opens
  React.useEffect(() => {
    if (initialPatientId) {
      setPatientId(initialPatientId);
    } else if (!patientId && patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [initialPatientId, isOpen, patients]);

  // Exam Selection State
  const [modality, setModality] = useState<ModalityType>('RX');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [examSearch, setExamSearch] = useState<string>('');
  const [showExamList, setShowExamList] = useState(false);
  const [laterality, setLaterality] = useState<string>(''); // For exams with side
  
  const [dynamicCatalog, setDynamicCatalog] = useState(EXAM_CATALOG);

  useEffect(() => {
    const fetchCatalog = async () => {
        try {
            const response = await api.get('/templates/catalog');
            if (response.data && Object.keys(response.data).length > 0) {
                setDynamicCatalog(response.data);
            }
        } catch (error) {
            console.warn('Could not fetch dynamic catalog, using fallback');
        }
    };
    fetchCatalog();
  }, []);

  // Computed values
  const availableRegions = dynamicCatalog[modality] || [];
  const currentRegion = availableRegions.find(r => r.name === selectedRegion);
  
  // Create a flattened list of all exams for this modality to allow global search
  const allModalityExams = React.useMemo(() => {
    const exams: (ExamDefinition & { regionName: string })[] = [];
    availableRegions.forEach(reg => {
      reg.exams.forEach(ex => {
        exams.push({ ...ex, regionName: reg.name });
      });
    });
    return exams;
  }, [availableRegions]);

  // Filtered exams based on search term
  // If a region is selected, filter by that region. If not, show all of the modality.
  const sourceExams = selectedRegion ? (currentRegion?.exams || []) : allModalityExams;
  const filteredExams = sourceExams.filter(e => 
    e.name.toLowerCase().includes(examSearch.toLowerCase())
  );

  const currentExamDef = allModalityExams.find(e => e.name === selectedExam);
  
  // Laterality logic: 
  // 1. If it's a known exam, follow the definition
  // 2. If it's a custom exam but in a musculoskeletal region, allow laterality
  const lateralRegions = ['Ombro', 'Cotovelo', 'Punho', 'Mão', 'Quadril', 'Fêmur', 'Joelho', 'Tornozelo', 'Pé', 'Clavícula', 'Braço', 'Antebraço', 'Perna', 'Escápula', 'Músculo-Esquelético', 'Membros Superiores', 'Membros Inferiores'];
  
  // Determine region to check for laterality (either the selected one or the one tied to the exam)
  const regionToCheck = selectedRegion || currentExamDef?.regionName || '';
  const requiresLaterality = currentExamDef ? currentExamDef.hasLaterality : lateralRegions.some(r => regionToCheck.includes(r));

  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [urgency, setUrgency] = useState<ExamUrgency>('Rotina');
  const [clinicalHistory, setClinicalHistory] = useState('');
  const [price, setPrice] = useState(50.00);
  const [file, setFile] = useState<File | null>(null);
  const [medicalRequestFile, setMedicalRequestFile] = useState<File | null>(null);
  const { addToast } = useToast();

  // Reset dependent fields when parents change
  useEffect(() => {
    setSelectedRegion('');
    setSelectedExam('');
    setExamSearch('');
    setLaterality('');
  }, [modality]);

  useEffect(() => {
    if (selectedRegion && selectedExam) {
        // If the current selected exam doesn't belong to the new region, clear it
        const belongs = availableRegions.find(r => r.name === selectedRegion)?.exams.some(e => e.name === selectedExam);
        if (!belongs && !examSearch) {
            setSelectedExam('');
            setExamSearch('');
        }
    }
    setLaterality('');
  }, [selectedRegion]);

  // Sync search input with selected exam when it changes (dropdown selection)
  useEffect(() => {
    if (selectedExam && !examSearch) {
      setExamSearch(selectedExam);
    }
  }, [selectedExam]);

  // Handle manual typing
  const handleExamSearchChange = (val: string) => {
    setExamSearch(val);
    setSelectedExam(val); // Assume the typed text is the exam name (custom)
    setShowExamList(true);
  };

  // Helper to smart extract laterality from exam name
  const extractLaterality = (name: string): { cleanName: string; detectedSide: string } => {
    const lowerName = name.toLowerCase();
    let detectedSide = '';
    let cleanName = name;

    if (lowerName.includes('bilateral')) {
      detectedSide = 'Bilateral';
      cleanName = name.replace(/\s*-?\s*bilateral/i, '').trim();
    } else if (lowerName.includes('esquerdo') || lowerName.includes('esquerda')) {
      detectedSide = 'Esquerdo';
      cleanName = name.replace(/\s*-?\s*esquerd[oa]/i, '').trim();
    } else if (lowerName.includes('direito') || lowerName.includes('direita')) {
      detectedSide = 'Direito';
      cleanName = name.replace(/\s*-?\s*direit[oa]/i, '').trim();
    }

    // Clean up any trailing hyphens or parentheses if left behind
    cleanName = cleanName.replace(/\s-\s*$/, '').replace(/\(\s*\)$/, '').trim();
    
    return { cleanName, detectedSide };
  };

  const selectExamFromList = (exam: ExamDefinition & { regionName?: string }) => {
    const { cleanName, detectedSide } = extractLaterality(exam.name);
    
    setSelectedExam(cleanName);
    setExamSearch(cleanName);
    
    if (detectedSide) {
      setLaterality(detectedSide);
    }
    
    if (exam.regionName && !selectedRegion) {
        setSelectedRegion(exam.regionName);
    }
    setShowExamList(false);
  };

  // Close list when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowExamList(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch dynamic price based on modality and urgency
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Map USG back to US if needed by pricing API, or assume pricing API handles USG
        const modParam = modality === 'USG' ? 'US' : modality; 
        const response = await api.get(`/pricing/calculate?modality=${modParam}&urgency=${urgency}`);
        if (response.data && response.data.price) {
          setPrice(response.data.price);
        }
      } catch (error) {
        console.warn('Could not fetch dynamic price, using fallback');
      }
    };
    fetchPrice();
  }, [modality, urgency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId && selectedExam) {
      // Construct final exam name
      let finalExamName = selectedExam;
      if (requiresLaterality && laterality) {
        finalExamName += ` ${laterality}`;
      }

      onSubmit(
          patientId, 
          finalExamName, 
          specialty, 
          price, 
          modality as any, 
          urgency, 
          selectedRegion || 'Geral', 
          file, 
          clinicalHistory,
          medicalRequestFile // Pass the second file
      );
      
      addToast('Exame enviado para o Marketplace!', 'success');
      onClose();
    } else {
        addToast('Preencha os dados do paciente e o nome do exame', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      addToast(`DICOM ${e.target.files[0].name} selecionado`, 'info');
    }
  };

  const handleMedicalRequestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedicalRequestFile(e.target.files[0]);
      addToast(`Pedido Médico ${e.target.files[0].name} selecionado`, 'info');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Requisitar Novo Laudo" maxWidth="max-w-7xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6 h-full p-2">

        {/* Coluna Esquerda - 3/12 (Upload & Info Básica) */}
        <div className="col-span-12 md:col-span-3 space-y-4 flex flex-col">
          {/* File Upload - Vertical */}
          <div
            onClick={() => document.getElementById('dicom-upload')?.click()}
            className={`flex-1 min-h-[200px] border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer hover:bg-gray-50 hover:border-brand-blue-300 group ${file ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-gray-200'}`}
          >
            <input id="dicom-upload" type="file" accept=".dcm" className="hidden" onChange={handleFileChange} />
            <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${file ? 'bg-brand-teal-500 text-white shadow-lg shadow-brand-teal-200' : 'bg-gray-100 text-gray-400'}`}>
              {file ?
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> :
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              }
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{file ? file.name : 'Upload DICOM'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">.dcm (Max 500MB)</p>
            </div>
          </div>

          {/* Medical Request Upload */}
          <div
            onClick={() => document.getElementById('medical-request-upload')?.click()}
            className={`p-4 border-2 border-dashed rounded-2xl flex items-center gap-3 transition-all cursor-pointer hover:bg-gray-50 hover:border-brand-blue-300 group ${medicalRequestFile ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-gray-200'}`}
          >
            <input id="medical-request-upload" type="file" accept="image/*,.pdf" className="hidden" onChange={handleMedicalRequestFileChange} />
            <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${medicalRequestFile ? 'bg-brand-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700 truncate">{medicalRequestFile ? medicalRequestFile.name : 'Pedido Médico'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Imagens ou PDF</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-4">

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">Paciente</label>
                <div className="flex gap-2">
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-brand-blue-500 outline-none transition-all hover:border-brand-blue-200"
                  >
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {onOpenRegisterPatient && (
                    <button 
                      type="button" 
                      onClick={onOpenRegisterPatient}
                      className="px-3 bg-brand-blue-50 text-brand-blue-600 rounded-xl border border-brand-blue-100 hover:bg-brand-blue-600 hover:text-white transition-all flex items-center justify-center group"
                      title="Cadastrar Novo Paciente"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">Prioridade</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as ExamUrgency)}
                      className={`w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black outline-none transition-all ${urgency === 'Urgente' ? 'text-red-500 bg-red-50 border-red-200' : 'text-gray-700'}`}
                    >
                      {URGENCIES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">Especialidade</label>
                    <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none"
                        >
                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
              </div>
          </div>
        </div>


        {/* Coluna Direita - 9/12 (Detalhes do Exame) */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-5">
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-2">
                    <div className="bg-brand-blue-50 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Detalhes do Exame</h3>
                        <p className="text-xs text-gray-500">Selecione as características do procedimento</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* 1. Modalidade */}
                    <div className="col-span-3">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">Modalidade</label>
                        <select
                        value={modality}
                        onChange={(e) => setModality(e.target.value as ModalityType)}
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-brand-blue-500 transition-all cursor-pointer"
                        >
                        {Object.keys(dynamicCatalog).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* 2. Busca Inteligente de Exame (Campo Principal) */}
                    <div className="col-span-9 relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">Exame (Busque por nome ou região)</label>
                        <div className="relative group/exam">
                            <input
                                type="text"
                                value={examSearch}
                                onChange={(e) => handleExamSearchChange(e.target.value)}
                                onFocus={() => setShowExamList(true)}
                                placeholder={`Ex: ${modality === 'RX' ? 'Tórax, Crânio, Mão...' : 'Abdome, Encéfalo...'}`}
                                className="w-full h-[54px] px-5 bg-white border-2 border-gray-100 rounded-2xl text-base font-bold text-gray-900 outline-none focus:border-brand-blue-500 focus:ring-4 focus:ring-brand-blue-50 transition-all pr-12 shadow-sm"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {examSearch && filteredExams.length === 0 && (
                                    <span className="text-[10px] font-black uppercase text-brand-teal-600 bg-brand-teal-50 px-2 py-1 rounded-lg border border-brand-teal-100 animate-in fade-in zoom-in-90 scale-100">Exame Novo</span>
                                )}
                                <svg className={`w-5 h-5 transition-colors ${showExamList ? 'text-brand-blue-500' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Dropdown de opções filtradas */}
                            {showExamList && (
                                <div className="absolute z-50 left-0 right-0 top-full mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl max-h-[400px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sugestões de {modality}</span>
                                        <span className="text-[10px] text-gray-400">{filteredExams.length} encontrados</span>
                                    </div>
                                    <div className="overflow-y-auto max-h-[340px] custom-scrollbar">
                                        {filteredExams.length > 0 ? (
                                            <ul className="py-2">
                                                {filteredExams.map(e => (
                                                    <li 
                                                        key={`${e.regionName}-${e.name}`}
                                                        onClick={() => selectExamFromList(e as any)}
                                                        className="px-5 py-3.5 hover:bg-brand-blue-50 cursor-pointer transition-all flex justify-between items-center group/item border-l-4 border-transparent hover:border-brand-blue-500"
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-bold text-gray-800 group-hover/item:text-brand-blue-700 transition-colors">{e.name}</span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/item:text-brand-blue-300">{e.regionName}</span>
                                                        </div>
                                                        {selectedExam === e.name && (
                                                            <div className="bg-brand-blue-500 p-1 rounded-full text-white">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-8 text-center bg-white">
                                                <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </div>
                                                <p className="text-sm font-bold text-gray-600 mb-1">Exame não listado no catálogo</p>
                                                <p className="text-xs text-gray-400">Você pode continuar digitando para enviar como um exame personalizado.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Região (Agora é um detalhe informativo que pode ser trocado se quiser) */}
                    <div className="col-span-12">
                        <div className="flex items-center gap-3">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Região Selecionada:</label>
                            {selectedRegion ? (
                                <div className="flex items-center gap-2 bg-brand-blue-50 px-3 py-1 rounded-full border border-brand-blue-100">
                                    <span className="text-xs font-bold text-brand-blue-700">{selectedRegion}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedRegion('')}
                                        className="text-brand-blue-400 hover:text-brand-blue-600 p-0.5"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ) : (
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="text-xs font-bold text-gray-400 bg-transparent border-none outline-none cursor-pointer hover:text-gray-600 transition-colors"
                                >
                                    <option value="">Selecione para filtrar... (Opcional)</option>
                                    {availableRegions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lateralidade (Condicional) */}
                {requiresLaterality && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                         <label className="block text-[10px] font-black uppercase tracking-wider text-brand-blue-400 mb-1.5 ml-1">Lateralidade</label>
                        <div className="flex gap-2">
                            {LATERALITIES.map(l => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLaterality(l)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${laterality === l ? 'bg-brand-blue-500 text-white border-brand-blue-600 shadow-md transform scale-[1.02]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* História Clínica */}
            <div className="flex-1">
                 <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">História Clínica (Queixa)</label>
                <textarea
                value={clinicalHistory}
                onChange={(e) => setClinicalHistory(e.target.value)}
                placeholder="Descreva os sintomas, histórico relevante, suspeita clínica..."
                className="w-full h-full min-h-[120px] px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none resize-none focus:ring-2 focus:ring-brand-blue-500 transition-all hover:bg-gray-50"
                />
            </div>
            
            {/* Footer Actions */}
            <div className="flex items-end justify-between mt-auto pt-2">
                 <div className="bg-gray-900 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-6 min-w-[200px]">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">Oferta Líquida</label>
                        <p className="text-[10px] text-gray-500 opacity-80">Valor para o médico</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-500 font-bold text-xs">R$</span>
                        <span className="text-white font-black text-3xl tracking-tight">
                        {price.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="h-14 px-8 rounded-2xl border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50">
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={!selectedExam || (requiresLaterality && !laterality)}
                        className="h-14 px-10 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-2xl shadow-lg shadow-brand-blue-200 font-black uppercase tracking-widest text-xs transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        Enviar Exame
                    </Button>
                </div>
            </div>

        </div>

      </form>
    </Modal>
  );
};
