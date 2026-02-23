import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { OhifViewer } from '../components/dashboard/shared/OhifViewer';
import { Button } from '../components/ui/Button';
import { Exam, mockExams } from '../data/mockData';
import { Badge } from '../components/ui/Badge';
import { FileTextIcon } from '../components/icons/FileTextIcon';
import { ClinicalHistoryModal } from '../components/dashboard/modals/ClinicalHistoryModal';
import { ReportEditor } from '../components/dashboard/doctor/ReportEditor';
import { useToast } from '../contexts/ToastContext';

const SharedExamPage: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [crm, setCrm] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [exam, setExam] = useState<Exam | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [suggestionText, setSuggestionText] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        // Extract token from URL
        // More robust extraction: get the segment after /share/
        const match = window.location.pathname.match(/\/share\/([^\/]+)/);
        const tokenFromUrl = match ? match[1] : '';
        console.log("Raw Token from URL:", tokenFromUrl);
        setToken(tokenFromUrl);
    }, []);

    const handleAccess = async () => {
        if (!crm.trim()) return;
        setLoading(true);
        setError(null);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Use Local Mock Data avoiding 401
            // In real prod, this would call a public endpoint like /api/share/validate
            // Decodes the base64 token which we made as "examId-timestamp"
            let examIdToFind = '';
            
            console.log("Attempting to decode token:", token);

            try {
                // Restore standard base64 from URL-safe format
                let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
                // Remove any trailing equal signs to manually re-pad
                base64 = base64.replace(/=+$/, '');
                
                while (base64.length % 4) {
                    base64 += '=';
                }

                console.log("Restored Base64:", base64);
                const decoded = atob(base64);
                console.log("Decoded String:", decoded);
                
                // Expected format: examId|timestamp
                if(decoded.includes('|')) {
                    examIdToFind = decoded.split('|')[0];
                } else if(decoded.includes('-')) {
                    // Fallback for old link format
                    examIdToFind = decoded.split('-')[0];
                }
                console.log("Extracted Exam ID:", examIdToFind);

            } catch (e) {
                console.error("Token decode fail:", e);
                setError(`Erro de decodificação: ${(e as Error).message}`);
                setLoading(false);
                return;
            }

            // First, try to find in Mock Data (Fast & Offline-dev friendly)
            let found = mockExams.find(e => e.id === examIdToFind);

            if (!found) {
                 console.log(`🔍 Exam ${examIdToFind} not in mock, trying API...`);
                 try {
                     // Try to fetch from backend public endpoint
                     // Note: We use relative path '/public/exams/' assuming axios baseURL includes '/api'
                     // If baseURL is http://localhost:3001/api, then this becomes http://localhost:3001/api/public/exams/:id
                     // Our server route is defined as app.get('/api/public/exams/:id') so this matches.
                     const response = await api.get(`/public/exams/${examIdToFind}`);
                     if (response.data) {
                         console.log("✅ Exam found via API:", response.data.id);
                         found = response.data;
                     }
                 } catch (apiError) {
                     console.error("❌ API Fetch failed:", apiError);
                     // Fallthrough to error state below
                 }
            }

             if (found) {
                 // Cast or Map backend data to frontend interface if needed
                 // For now assuming direct compatibility
                 setExam(found as Exam);
                 setSuggestionText((found as any).aiDraft || ''); 
                 setIsAuthenticated(true);
             } else {
                 console.warn("Exam not found for ID:", examIdToFind);
                 setError(`Exame não encontrado (ID: ${examIdToFind || '?'}). Link expirado ou inválido.`);
             }

        } catch (err) {
            console.error(err);
            setError('Falha na validação do link.');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated && exam) {
        return (
            <div className="h-screen flex flex-col bg-gray-50 font-sans overflow-hidden">
                <ClinicalHistoryModal 
                    isOpen={isHistoryOpen} 
                    onClose={() => setIsHistoryOpen(false)} 
                    history={exam.clinicalHistory || null}
                    patientName={exam.patientName}
                />

                {/* Header Estilo ExamDetailPage */}
                <div className="bg-white border-b border-gray-100 p-4 shrink-0 shadow-sm z-10">
                    <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-lg font-black text-gray-900">{exam.patientName}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        ID: {exam.patientId} <span className="mx-2">|</span> ACC: {exam.accessionNumber || 'N/A'}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Exame</p>
                                    <p className="text-sm font-extrabold text-blue-900">{exam.examType}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsHistoryOpen(true)}
                                className="border-gray-200"
                            >
                                <FileTextIcon className="w-4 h-4 mr-2" />
                                História Clínica
                            </Button>
                            
                            <div className="text-right mr-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Prioridade</p>
                                <p className={`text-sm font-extrabold italic ${exam.urgency === 'Urgente' ? 'text-red-500' : 'text-gray-900'}`}>
                                    {exam.urgency || 'Rotina'}
                                </p>
                            </div>
                            <Badge status={exam.status} />
                            
                            <div className="ml-4 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg text-[10px] font-black uppercase tracking-tighter animate-pulse">
                                Segunda Opinião
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 p-4 min-h-0 overflow-hidden">
                    {/* Viewer */}
                    <div className="bg-black rounded-3xl overflow-hidden shadow-lg border border-gray-800 flex flex-col relative h-full">
                        <OhifViewer 
                            dicomUrl={exam.dicomUrl || '/uploads/dicom/dicom-1770660617222-232539700.dcm'} 
                            onBack={() => {}} 
                        />
                    </div>

                    {/* Editor de Sugestão */}
                    <div className="flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
                        <div className="flex-1 flex flex-col min-h-[400px]">
                            <div className="mb-3 px-4 py-2 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
                                <p className="text-sm font-bold text-blue-900">Modo de Sugestão</p>
                                <p className="text-xs text-blue-700 opacity-80 uppercase font-black">Sua opinião será encaminhada ao médico responsável.</p>
                            </div>
                            
                            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                   <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Editor de Sugestão</span>
                                   <div className="flex gap-2">
                                       <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                       <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                       <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                   </div>
                                </div>
                                <ReportEditor
                                    value={suggestionText}
                                    onChange={setSuggestionText}
                                    themeId="classic"
                                />
                            </div>
                        </div>

                        {/* Botão de Envio de Sugestão */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center shrink-0">
                            <div className="text-xs text-gray-500">
                                <span className="block font-bold">DR(A). {crm}</span>
                                <span className="text-[10px] uppercase">Médico Consultor</span>
                            </div>
                            <Button 
                                onClick={async () => {
                                    if (!suggestionText.trim()) {
                                        addToast('A sugestão não pode estar vazia.', 'error');
                                        return;
                                    }

                                    // Check if we are using mock data or real backend data
                                    // If exam came from API (has no mock flag or we found it via API call), use API
                                    const isRealExam = !mockExams.find(e => e.id === exam.id);

                                    if (isRealExam || exam) {
                                        try {
                                             await api.post(`/public/exams/${exam.id}/suggestion`, {
                                                 suggestion: suggestionText,
                                                 crm: crm,
                                                 name: name
                                             });
                                             addToast('Sugestão enviada e salva com sucesso!', 'success');
                                        } catch (saveError) {
                                            console.error("Failed to save suggestion:", saveError);
                                            addToast('Erro ao salvar sugestão. Tente novamente.', 'error');
                                        }
                                    } else {
                                        // Fallback for Mock demo
                                        const ex = mockExams.find(e => e.id === exam.id);
                                        if(ex) {
                                            if(!ex.suggestions) ex.suggestions = [];
                                            ex.suggestions.push({
                                                id: `s_${Date.now()}`,
                                                doctorName: name || 'Médico Externo',
                                                doctorCrm: crm,
                                                content: suggestionText,
                                                createdAt: new Date().toISOString()
                                            });
                                        }
                                        addToast('Sugestão enviada (Modo Demo)!', 'success');
                                    }
                                }} 
                                className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white shadow-lg"
                            >
                                Enviar Sugestão
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Seguro</h1>
                    <p className="text-gray-500 text-sm">Este é um link de acesso restrito para segunda opinião médica. Por favor, identifique-se.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Seu Nome Completo</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ex: Dr. João Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Seu CRM</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ex: 123456-SP"
                            value={crm}
                            onChange={(e) => setCrm(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <Button 
                        onClick={handleAccess} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200"
                        disabled={loading || !crm || !name}
                    >
                        {loading ? 'Validando...' : 'Acessar Exame'}
                    </Button>

                    <p className="text-[10px] text-gray-400 text-center mt-6">
                        O acesso será registrado nos logs de auditoria do sistema em conformidade com a LGPD.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SharedExamPage;
