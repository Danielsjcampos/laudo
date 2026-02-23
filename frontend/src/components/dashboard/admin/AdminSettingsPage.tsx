
import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../contexts/ToastContext';
import api from '../../../lib/api';
import { PreReportTemplatesTab } from './PreReportTemplatesTab';

interface PricingItem {
  id: string;
  modality: string;
  urgency: string;
  price: number;
}

interface SystemSettings {
  feeGlobal: number;
  feeDev: number;
}

const DEFAULT_MODALITIES = ['RX', 'TC', 'RM', 'US', 'MG', 'OT'];
const URGENCIES = ['Rotina', 'Urgente'];

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'financeiro' | 'pre_laudos'>('financeiro');
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [modalities, setModalities] = useState<string[]>(DEFAULT_MODALITIES);
  const [settings, setSettings] = useState<SystemSettings>({ feeGlobal: 15, feeDev: 10 });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [isAddingModality, setIsAddingModality] = useState(false);
  const [newModality, setNewModality] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pricingRes, settingsRes] = await Promise.all([
        api.get('/pricing'),
        api.get('/pricing/settings')
      ]);
      
      const pricingData = pricingRes.data as PricingItem[];
      setPricing(pricingData);
      setSettings(settingsRes.data);
      
      const existingModalities = Array.from(new Set(pricingData.map(item => item.modality)));
      const combined = Array.from(new Set([...DEFAULT_MODALITIES, ...existingModalities]));
      setModalities(combined);
    } catch (error) {
      addToast('Erro ao carregar configurações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0;
    setPricing(prev => prev.map(item => item.id === id ? { ...item, price } : item));
  };

  const savePrice = async (item: PricingItem) => {
    setSavingId(item.id);
    try {
      await api.post('/pricing/update', {
        modality: item.modality,
        urgency: item.urgency,
        price: item.price
      });
      addToast(`${item.modality} (${item.urgency}) atualizado!`, 'success');
    } catch (error) {
      addToast('Erro ao salvar preço', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const saveSettingsList = async () => {
    setSavingSettings(true);
    try {
      await api.post('/pricing/settings', settings);
      addToast('Configurações financeiras atualizadas!', 'success');
    } catch (error) {
      addToast('Erro ao salvar configurações', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddModality = async () => {
    if (!newModality) return;
    const modality = newModality.toUpperCase();
    
    if (modalities.includes(modality)) {
      addToast('Esta modalidade já existe!', 'error');
      return;
    }

    try {
      const defaultPrice = 50;
      await Promise.all(URGENCIES.map(urgency => 
        api.post('/pricing/update', { modality, urgency, price: defaultPrice })
      ));
      
      addToast(`Modalidade ${modality} adicionada com sucesso!`, 'success');
      setNewModality('');
      setIsAddingModality(false);
      fetchData();
    } catch (error) {
      addToast('Erro ao adicionar modalidade', 'error');
    }
  };

  const handleDeleteModality = async (modality: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a modalidade ${modality}? Todos os preços associados serão removidos.`)) {
      return;
    }

    try {
      await api.delete(`/pricing/${modality}`);
      addToast(`Modalidade ${modality} removida!`, 'success');
      fetchData();
    } catch (error) {
      addToast('Erro ao remover modalidade', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-mono animate-pulse uppercase tracking-[0.2em]">CARREGANDO PROTOCOLOS FINANCEIROS...</div>;
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
      <div className="px-8 pt-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Configurações do Sistema</h1>
        <p className="text-gray-500 font-medium mb-8">Gerencie preços, taxas e modelos de pré-laudo do sistema.</p>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('financeiro')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'financeiro' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Financeiro
          </button>
          <button
            onClick={() => setActiveTab('pre_laudos')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'pre_laudos' ? 'bg-white text-brand-blue-600 border-x border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Pré-Laudos
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white p-8 overflow-y-auto">
        {activeTab === 'pre_laudos' && (
          <div className="max-w-5xl animate-in fade-in duration-300">
            <PreReportTemplatesTab />
          </div>
        )}

        {activeTab === 'financeiro' && (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-300">
      {/* Header com Design Técnico */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-l-8 border-gray-900 pl-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none italic">
            Núcleo <span className="text-brand-blue-600">Financeiro</span>
          </h1>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mt-4">
            Protocolos de Rendimento & Serviços do Marketplace
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingModality(true)}
          className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-none font-black text-[10px] tracking-widest uppercase transition-all shadow-[12px_12px_0px_#E2E8F0] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          + Registrar_Modalidade
        </Button>
      </div>

      {/* Grid de Tabelas de Preço */}
      <div className="grid xl:grid-cols-2 gap-16">
        {URGENCIES.map(urgency => (
          <div key={urgency} className="bg-white border-2 border-gray-900 shadow-[20px_20px_0px_rgba(0,0,0,0.03)] relative group">
            <div className={`p-8 border-b-2 border-gray-900 flex justify-between items-center ${urgency === 'Urgente' ? 'bg-red-700' : 'bg-brand-blue-700'}`}>
              <h2 className="text-white font-black text-xl tracking-tighter uppercase italic">
                {urgency} <span className="text-white/40">//</span> Tabela de Preços
              </h2>
              <div className="flex gap-2">
                <div className="w-8 h-2 bg-white/20"></div>
                <div className="w-4 h-2 bg-white/40"></div>
              </div>
            </div>

            <div className="p-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-gray-900/5">
                    <th className="py-4 text-[11px] font-black uppercase text-gray-400 text-left tracking-widest">Protocolo</th>
                    <th className="py-4 text-[11px] font-black uppercase text-gray-400 text-right tracking-widest">Valor (R$)</th>
                    <th className="py-4 text-[11px] font-black uppercase text-gray-400 text-right tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {modalities.map(modality => {
                    const item = pricing.find(p => p.modality === modality && p.urgency === urgency) || {
                      id: `${modality}-${urgency}`,
                      modality,
                      urgency,
                      price: 0
                    };

                    return (
                      <tr key={item.id} className="group/row hover:bg-gray-50/50 transition-colors">
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleDeleteModality(modality)}
                              className="opacity-0 group-hover/row:opacity-100 transition-all p-2 hover:bg-red-50 text-red-400 hover:text-red-600"
                              title="Remover Modalidade"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <span className="font-black text-gray-900 text-2xl tracking-tighter">{modality}</span>
                          </div>
                        </td>
                        <td className="py-6 text-right w-56">
                          <div className="relative inline-block w-full">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => handlePriceChange(item.id, e.target.value)}
                              className="w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-900 px-4 py-3 text-right font-black text-xl text-gray-900 outline-none transition-all placeholder-gray-200"
                              placeholder="0.00"
                            />
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 tracking-tighter">R$</span>
                          </div>
                        </td>
                        <td className="py-6 text-right pl-6">
                          <button
                            onClick={() => savePrice(item as PricingItem)}
                            disabled={savingId === item.id}
                            className={`p-3 border-2 border-gray-900 transition-all ${savingId === item.id ? 'opacity-20' : 'opacity-100 hover:bg-gray-900 hover:text-white active:scale-90 shadow-[4px_4px_0px_#f0f0f0] active:shadow-none'}`}
                            title="Salvar Preço"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gray-900/5 -z-10 rotate-12"></div>
          </div>
        ))}
      </div>

      {/* Global Financial Controls */}
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-gray-900 p-10 border-t-8 border-brand-blue-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-white/5 font-black text-[12rem] -translate-y-16 translate-x-16 pointer-events-none italic">LOGIC</div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-4">Motor de Rendimento Financeiro</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.15em] leading-relaxed opacity-70">
                  Defina as taxas de corretagem do marketplace e a retenção técnica para desenvolvimento. 
                  A "Taxa do Marketplace" incide sobre o valor bruto. A "Comissão de Devs" é calculada sobre a taxa do marketplace, não sobre o total.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue-400">Taxa Marketplace (%)</label>
                  <input 
                    type="number"
                    value={settings.feeGlobal}
                    onChange={(e) => setSettings({...settings, feeGlobal: parseFloat(e.target.value) || 0})}
                    className="w-full bg-white/5 border-2 border-white/20 focus:border-brand-blue-500 p-4 text-3xl font-black text-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-purple-400">Comissão Devs (%)</label>
                  <input 
                    type="number"
                    value={settings.feeDev}
                    onChange={(e) => setSettings({...settings, feeDev: parseFloat(e.target.value) || 0})}
                    className="w-full bg-white/5 border-2 border-white/20 focus:border-brand-blue-500 p-4 text-3xl font-black text-white outline-none transition-all"
                  />
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">% DA TAXA DO MARKETPLACE</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <Button 
                onClick={saveSettingsList}
                isLoading={savingSettings}
                className="bg-brand-blue-600 hover:bg-brand-blue-500 text-gray-900 px-12 py-6 rounded-none font-black text-xs tracking-[0.2em] uppercase shadow-[10px_10px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                Sincronizar
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-10 border-2 border-gray-900 flex flex-col justify-center items-center text-center space-y-6">
          <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Simulação de Rendimento</span>
          <div className="space-y-2">
            <p className="text-gray-400 text-xs uppercase font-bold">Retenção Total da Plataforma</p>
            <p className="text-6xl font-black text-gray-900 tracking-tighter">
              {(settings.feeGlobal + (settings.feeGlobal * (settings.feeDev/100))).toFixed(1)}%
            </p>
          </div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed border-t border-gray-200 pt-4 mt-2">
            <p className="mb-1">Detalhamento da Taxa:</p>
            <p className="text-gray-900">Marketplace: {settings.feeGlobal}%</p>
            <p className="text-brand-purple-600">+ Dev Utils: {(settings.feeGlobal * (settings.feeDev/100)).toFixed(1)}%</p>
            <p className="text-[9px] text-gray-400 mt-1">(10% de {settings.feeGlobal}%)</p>
          </div>
        </div>
      </div>

      {/* Modal de Adição - Estilo Sharp */}
      {isAddingModality && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xl">
          <div className="bg-white border-8 border-gray-900 p-12 max-w-lg w-full shadow-[40px_40px_0px_rgba(0,0,0,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -rotate-45 translate-x-12 -translate-y-12"></div>
            
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-10 italic border-b-4 border-gray-900 pb-4 inline-block">
              Registrar Protocolo
            </h2>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Identificador da Modalidade (Código)</label>
                <input
                  type="text"
                  autoFocus
                  value={newModality}
                  onChange={(e) => setNewModality(e.target.value.toUpperCase())}
                  className="w-full bg-gray-100 border-b-8 border-gray-900 p-6 text-4xl font-black text-gray-900 outline-none focus:bg-gray-50 transition-all uppercase placeholder-gray-200"
                  placeholder="EX: PET"
                />
              </div>

              <div className="flex gap-6 pt-4">
                <button 
                  onClick={() => setIsAddingModality(false)}
                  className="flex-1 bg-gray-100 text-gray-500 font-black uppercase text-xs tracking-widest py-6 hover:bg-gray-200 transition-all"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleAddModality}
                  className="flex-1 bg-gray-900 text-white font-black uppercase text-xs tracking-widest py-6 hover:bg-black shadow-[8px_8px_0px_#E2E8F0] active:shadow-none transition-all"
                >
                  INICIALIZAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
        )}
      </div>
    </div>
  );
};
