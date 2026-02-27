import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { authService } from '../../../services/authService';

export const ClinicSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'geral' | 'marketplace' | 'notificacoes'>('geral');
    const [userId, setUserId] = useState<string | null>(null);
    
    // Mock States for toggles
    const [settings, setSettings] = useState({
        notificationsEmail: true,
        notificationsSms: false,
        autoApproveDocs: true,
        marketplaceVisibility: true,
        defaultPricetable: 'padrao_2024',
        chatSearchable: true,
        sendReadReceipts: true
    });

    useEffect(() => {
        authService.getMe().then(async res => {
            if (res.user) {
                setUserId(res.user.id);
                try {
                    const clinicsRes = await api.get('/clinics');
                    const myClinic = clinicsRes.data.find((c: any) => c.adminEmail === res.user.email);
                    if (myClinic) {
                        setSettings(prev => ({
                            ...prev,
                            chatSearchable: myClinic.chatSearchable ?? true,
                            sendReadReceipts: myClinic.sendReadReceipts ?? true
                        }));
                    }
                } catch(e) {}
            }
        }).catch(err => console.error(err));
    }, []);

    const handleToggle = async (key: keyof typeof settings) => {
        const newValue = !settings[key];
        setSettings(prev => ({ ...prev, [key]: newValue }));

        const keyStr = String(key);
        try {
            const payload: any = {};
            if (keyStr === 'chatSearchable') payload.chatSearchable = newValue;
            if (keyStr === 'sendReadReceipts') payload.sendReadReceipts = newValue;

            if (userId) {
                await api.put(`/clinics/${userId}`, payload);
            }
        } catch (err) {
            console.error(`Failed to update ${keyStr}`, err);
        }
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
            <div className="px-8 pt-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Configurações da Clínica</h1>
                <p className="text-gray-500 font-medium mb-8">Gerencie preferências de sistema, notificações e integrações.</p>
                
                {/* Tabs */}
                <div className="flex space-x-1 border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('geral')}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'geral' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Geral
                    </button>
                    <button 
                        onClick={() => setActiveTab('marketplace')}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'marketplace' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Marketplace & Valores
                    </button>
                    <button 
                        onClick={() => setActiveTab('notificacoes')}
                        className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'notificacoes' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Notificações
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white p-8 overflow-y-auto">
                {activeTab === 'geral' && (
                    <div className="max-w-3xl space-y-8 animate-in fade-in active:scale-100 duration-300">
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Preferências do Sistema</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">Aprovação Automática de Médicos</p>
                                        <p className="text-xs text-gray-500 mt-1">Permitir que médicos certificados peguem exames sem revisão manual prévia.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('autoApproveDocs')}
                                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${settings.autoApproveDocs ? 'bg-brand-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.autoApproveDocs ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Privacidade</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">Visível na busca do Chat</p>
                                        <p className="text-xs text-gray-500 mt-1">Permite que médicos busquem sua clínica para contatos proativos.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('chatSearchable')}
                                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${settings.chatSearchable ? 'bg-brand-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.chatSearchable ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">Enviar Confirmação de Leitura</p>
                                        <p className="text-xs text-gray-500 mt-1">Permite que outros saibam quando você leu suas mensagens no chat (dois tiques azuis).</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('sendReadReceipts')}
                                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${settings.sendReadReceipts ? 'bg-brand-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.sendReadReceipts ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>

                    </div>
                )}

                {activeTab === 'marketplace' && (
                    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
                         <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Configuração de Venda</h2>
                             <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">Visibilidade no Marketplace</p>
                                        <p className="text-xs text-gray-500 mt-1">Seus exames aparecem para médicos externos na rede nacional.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('marketplaceVisibility')}
                                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${settings.marketplaceVisibility ? 'bg-brand-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.marketplaceVisibility ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Tabela de Preços Referência</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.defaultPricetable === 'padrao_2024' ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setSettings(prev => ({...prev, defaultPricetable: 'padrao_2024'}))}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-800">Tabela Padrão 2024</span>
                                        {settings.defaultPricetable === 'padrao_2024' && <div className="w-3 h-3 bg-brand-blue-600 rounded-full"/>}
                                    </div>
                                    <p className="text-xs text-gray-500">Preços médios de mercado ajustados automaticamente por região.</p>
                                </div>
                                <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.defaultPricetable === 'cbhpm' ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setSettings(prev => ({...prev, defaultPricetable: 'cbhpm'}))}>
                                     <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-800">CBHPM + 20%</span>
                                        {settings.defaultPricetable === 'cbhpm' && <div className="w-3 h-3 bg-brand-blue-600 rounded-full"/>}
                                    </div>
                                    <p className="text-xs text-gray-500">Baseada na Classificação Brasileira Hierarquizada com ágio.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'notificacoes' && (
                     <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Alertas e Avisos</h2>
                             <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">Notificações por E-mail</p>
                                        <p className="text-xs text-gray-500 mt-1">Receba avisos quando um laudo for entregue ou atrasado.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('notificationsEmail')}
                                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${settings.notificationsEmail ? 'bg-brand-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.notificationsEmail ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">Alertas por SMS</p>
                                        <p className="text-xs text-gray-500 mt-1">Avisos urgentes sobre falhas de sistema ou prazos críticos.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle('notificationsSms')}
                                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${settings.notificationsSms ? 'bg-brand-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.notificationsSms ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>
                     </div>
                )}
            </div>
        </div>
    );
};
