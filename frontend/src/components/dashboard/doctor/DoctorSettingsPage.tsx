import React, { useState } from 'react';
import { ReportThemePreviewer } from './report-designer/components/ReportThemePreviewer';
import { reportThemes } from './report-designer/themes';

export const DoctorSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'geral' | 'designer' | 'notificacoes' | 'perfil'>('perfil');
    const [profileData, setProfileData] = useState({
        name: 'Dr. Roberto Martins',
        specialty: 'Radiologista Sênior',
        crm: '123.456-SP',
        area: 'Radiologia e Diag. por Imagem',
        email: 'roberto.martins@doc.com',
        phone: '(11) 99999-8888',
    });

    const handleSaveProfile = () => {
        // Mock save
        alert('Perfil atualizado com sucesso!');
    };
    
    // Mock Data for initialization
    const initialData = {
        NOME_CLINICA: "Clínica Exemplo",
        LOGOTIPO_CLINICA: "https://ui-avatars.com/api/?name=Clinic&background=0D8ABC&color=fff", 
        DADOS_PACIENTE_DYNAMIC_BLOCK: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div><strong>Paciente:</strong> João Silva Santos</div>
                <div><strong>Data Nasc:</strong> 15/05/1980 (45 anos)</div>
                <div><strong>ID Exame:</strong> #982374</div>
                <div><strong>Data Exame:</strong> 10/02/2026</div>
            </div>
        `,
        NOME_MEDICO: "João Mendes",
        CRM_MEDICO: "12345/SP",
        ASSINATURA_DIGITAL_MEDICO: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABICAIAAAB8m9B8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHLSURBVHhe7dShDYBADIThv09ZgWEY7pEAnpBwAnXIdqXvN887c/re58vj/PndXU/v8+VjP7f78/0A0MECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANbBAlgHC2AdLIB1sADWwQJYBwtgHSyAdbAA1sECWAcLYB0sgHWwANax/wE6tA7qH5M3+AAAAABJRU5ErkJggg=="
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
                                    <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div></div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <span className="font-bold text-gray-700">Densidade de Informação (Compacta)</span>
                                    <div className="w-12 h-6 bg-brand-blue-600 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div></div>
                                </div>
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
