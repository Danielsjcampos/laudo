import React, { useState, useEffect } from 'react';
import { ReportThemePreviewer } from './report-designer/components/ReportThemePreviewer';
import { reportThemes } from './report-designer/themes';
import api from '../../../lib/api';
import { authService } from '../../../services/authService';

export const DoctorSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'geral' | 'designer' | 'notificacoes' | 'perfil'>('perfil');
    const [userId, setUserId] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('isDarkMode') === 'true');
    const [isCompactMode, setIsCompactMode] = useState(() => localStorage.getItem('isCompactMode') === 'true');
    const [chatSearchable, setChatSearchable] = useState(true);
    const [sendReadReceipts, setSendReadReceipts] = useState(true);

    const [profileData, setProfileData] = useState({
        name: 'Dr. Roberto Martins',
        specialty: 'Radiologista Sênior',
        crm: '123.456-SP',
        area: 'Radiologia e Diag. por Imagem',
        email: 'roberto.martins@doc.com',
        phone: '(11) 99999-8888',
    });

    useEffect(() => {
        authService.getMe().then(async res => {
            if (res.user) {
                setUserId(res.user.id);
                try {
                    const doctorsRes = await api.get('/doctors');
                    const myDoc = doctorsRes.data.find((d: any) => d.name === res.user.name);
                    if (myDoc) {
                        setChatSearchable(myDoc.chatSearchable ?? true);
                        setSendReadReceipts(myDoc.sendReadReceipts ?? true);
                    }
                } catch(e) {}
            }
        }).catch(err => console.error(err));
    }, []);

    const handleSaveProfile = async () => {
        try {
            if (userId) {
                await api.put(`/doctors/${userId}`, {
                    name: profileData.name,
                    specialty: profileData.specialty,
                    crm: profileData.crm,
                    chatSearchable,
                    sendReadReceipts
                });
            }
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar perfil.');
        }
    };
    
    // Toggle Handlers
    const toggleDarkMode = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        localStorage.setItem('isDarkMode', String(next));
    };

    const toggleCompactMode = () => {
        const next = !isCompactMode;
        setIsCompactMode(next);
        localStorage.setItem('isCompactMode', String(next));
    };

    const toggleChatSearchable = () => {
        setChatSearchable(!chatSearchable);
    };

    const toggleSendReadReceipts = () => {
        setSendReadReceipts(!sendReadReceipts);
    };
    
    // Mock Data for initialization
    const initialData = {
        NOME_CLINICA: "Clínica Radiologia Avançada",
        LOGOTIPO_CLINICA: "https://ui-avatars.com/api/?name=CRA&background=0066cc&color=fff", 
        DADOS_PACIENTE_DYNAMIC_BLOCK: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div><strong>Paciente:</strong> João Silva Santos</div>
                <div><strong>Data Nasc:</strong> 15/05/1980 (45 anos)</div>
                <div><strong>ID Exame:</strong> #982374</div>
                <div><strong>Data Exame:</strong> 10/02/2026</div>
            </div>
        `,
        NOME_MEDICO: profileData.name,
        CRM_MEDICO: profileData.crm,
        ASSINATURA_DIGITAL_MEDICO: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Signature_of_John_Hancock.svg",
        CLINICA_SOLICITANTE: "Hospital das Clínicas de São Paulo",
        DATA_HORA_PEDIDO: "09/02/2026 14:30",
        DATA_HORA_LAUDO: "10/02/2026 10:15"
    };

    const tenantConfig = {
        clinicName: "Clínica Radiologia Avançada",
        logoUrl: "https://ui-avatars.com/api/?name=CRA&background=0066cc&color=fff",
        primaryColor: "#0066cc"
    };

    const onThemeSelect = (id: string) => {
        localStorage.setItem('selected_report_theme_id', id);
        console.log("Theme Selected and Saved:", id);
    };

    const handleGenerateAI = async () => {
        // Mock AI Generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return `
            <h2>Laudo Técnico: Ressonância Magnética de Crânio</h2>
            <h3>Indicação Clínica</h3>
            <p>Cefaleia crônica hemicraniana à direita, refratária a tratamento medicamentoso.</p>
            
            <h3>Técnica</h3>
            <p>Foram obtidas imagens nos planos axial, sagital e coronal, utilizando sequências ponderadas em T1, T2, FLAIR e Difusão.</p>
            
            <h3>Análise</h3>
            <p>Parênquima encefálico com intensidade de sinal conservada. Ausência de lesões expansivas, isquêmicas ou hemorrágicas agudas. Sistema ventricular supratentorial e infratentorial de morfologia e dimensões normais. Linha média centrada.</p>
            <p>Fossa posterior sem alterações. Tronco encefálico e cerebelo conservados. Cisternas da base livres.</p>
            
            <h3>Conclusão</h3>
            <p>Exame de RM do crânio dentro dos padrões de normalidade para a faixa etária.</p>
        `;
    };

    return (
        <div className="h-full flex flex-col pt-6">
            <div className="px-6 flex-none">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Configurações & Preferências</h1>
                <p className="text-gray-500 font-medium mb-6">Personalize sua experiência de laudo e notificações.</p>
                
                {/* Tabs */}
                <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('perfil')}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all whitespace-nowrap ${activeTab === 'perfil' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Perfil Profissional
                    </button>
                    <button 
                        onClick={() => setActiveTab('geral')}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all whitespace-nowrap ${activeTab === 'geral' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Geral
                    </button>
                    <button 
                        onClick={() => setActiveTab('designer')}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'designer' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Designer de Laudos
                    </button>
                    <button 
                        onClick={() => setActiveTab('notificacoes')}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'notificacoes' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Notificações
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-white relative">
                {activeTab === 'perfil' && (
                    <div className="p-8 animate-in fade-in max-w-3xl space-y-8 overflow-y-auto h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Editar Dados Cadastrais</h2>
                            <button onClick={handleSaveProfile} className="bg-brand-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-blue-700 shadow-lg shadow-brand-blue-200 transition-colors">
                                Salvar Alterações
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                                <input 
                                    type="text" 
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Cargo / Título</label>
                                <input 
                                    type="text" 
                                    value={profileData.specialty}
                                    onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">CRM</label>
                                <input 
                                    type="text" 
                                    value={profileData.crm}
                                    onChange={(e) => setProfileData({...profileData, crm: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Área de Atuação</label>
                                <input 
                                    type="text" 
                                    value={profileData.area}
                                    onChange={(e) => setProfileData({...profileData, area: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Profissional</label>
                                <input 
                                    type="email" 
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                                <input 
                                    type="text" 
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'geral' && (
                     <div className="p-8 animate-in fade-in max-w-2xl space-y-8 overflow-y-auto h-full">
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Preferências de Visualização</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <span className="font-bold text-gray-700">Modo Escuro (Dark Mode)</span>
                                    <div onClick={toggleDarkMode} className={`w-12 h-6 ${isDarkMode ? 'bg-brand-blue-600' : 'bg-gray-200'} rounded-full relative cursor-pointer transition-colors`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${isDarkMode ? 'right-1' : 'left-1'}`}></div></div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <span className="font-bold text-gray-700">Densidade de Informação (Compacta)</span>
                                    <div onClick={toggleCompactMode} className={`w-12 h-6 ${isCompactMode ? 'bg-brand-blue-600' : 'bg-gray-200'} rounded-full relative cursor-pointer transition-colors`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${isCompactMode ? 'right-1' : 'left-1'}`}></div></div>
                                </div>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Privacidade</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div>
                                        <span className="font-bold text-gray-700 block">Visível na busca do Chat</span>
                                        <span className="text-xs text-gray-500">Permite que clínicas busquem por seu perfil no sistema de chat geral</span>
                                    </div>
                                    <div onClick={toggleChatSearchable} className={`w-12 h-6 ${chatSearchable ? 'bg-brand-blue-600' : 'bg-gray-200'} rounded-full relative cursor-pointer transition-colors`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${chatSearchable ? 'right-1' : 'left-1'}`}></div></div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div>
                                        <span className="font-bold text-gray-700 block">Enviar Confirmação de Leitura</span>
                                        <span className="text-xs text-gray-500">Permite que outros saibam quando você leu suas mensagens no chat (dois tiques azuis)</span>
                                    </div>
                                    <div onClick={toggleSendReadReceipts} className={`w-12 h-6 ${sendReadReceipts ? 'bg-brand-blue-600' : 'bg-gray-200'} rounded-full relative cursor-pointer transition-colors`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${sendReadReceipts ? 'right-1' : 'left-1'}`}></div></div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button onClick={handleSaveProfile} className="bg-brand-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-blue-700 shadow-lg shadow-brand-blue-200 transition-colors">
                                    Salvar Preferências
                                </button>
                            </div>
                        </section>
                     </div>
                )}

                {activeTab === 'designer' && (
                   <div className="h-full overflow-hidden animate-in fade-in">
                        <ReportThemePreviewer 
                            themes={reportThemes}
                            initialData={initialData}
                            onThemeSelect={onThemeSelect}
                            onGenerateAI={handleGenerateAI}
                            tenantConfig={tenantConfig}
                        />
                   </div>
                )}

                {activeTab === 'notificacoes' && (
                     <div className="p-8 animate-in fade-in max-w-2xl space-y-8 overflow-y-auto h-full">
                         <div className="p-6 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                             <p className="text-gray-500 font-medium">Configurações de notificação estarão disponíveis em breve.</p>
                         </div>
                     </div>
                )}
            </div>
        </div>
    );
};
