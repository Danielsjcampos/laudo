
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button } from '../../ui/Button';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { useToast } from '../../../contexts/ToastContext';
import { BrainIcon } from '../../icons/BrainIcon';

const AiLab: React.FC = () => {
    const [testImage, setTestImage] = useState('https://minio.scielo.br/documentstore/1678-7099/h635JPxxJTvRsdPhvmKYjxz/f2a629f46d89228b03fdcefe60dd4c2cb7dc469d.png');
    const [systemPrompt, setSystemPrompt] = useState('Você é um Neuro-Radiologista Sênior. Sua tarefa é analisar esta ressonância magnética cerebral em busca de evidências de tumores, derrames, atrofia cortical ou malformações vasculares. Forneça uma análise preliminar detalhada.');
    const [result, setResult] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [temp, setTemp] = useState(0.2);
    const { addToast } = useToast();

    const runDiagnosticTest = async () => {
        setIsProcessing(true);
        try {
            // No Vite usamos import.meta.env para variáveis de ambiente
            const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 'KEY_NOT_CONFIGURED';
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ text: `CONTEXTO DE TREINAMENTO: ${systemPrompt}\n\nURL DA IMAGEM PARA ANÁLISE: ${testImage}` }],
                config: { 
                    temperature: temp, 
                    thinkingConfig: { thinkingBudget: 12000 } 
                }
            });
            setResult(response.text || 'Sem resultado');
            addToast('Otimização do modelo concluída!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Falha crítica no processamento da IA.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
                <div className="flex items-center">
                    <div className="p-4 rounded-2xl mr-5 shadow-lg flex items-center justify-center transition-transform hover:rotate-6" style={{ backgroundColor: 'var(--navy-800)', border: '1px solid var(--navy-700)' }}>
                        <BrainIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="page-header">IA Sandbox Laboratory</h1>
                        <div className="page-header-line" />
                        <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Calibração de Modelos Gemini 3 Pro para Diagnósticos de Visão</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline">Ver Logs de Erro</Button>
                    <Button onClick={runDiagnosticTest} disabled={isProcessing}>
                        <SparklesIcon className={`h-3 w-3 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                        Iniciar Processamento Vision
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Painel de Controle Técnico */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="panel-card p-6">
                        <h3 className="kpi-label mb-6">Parâmetros do Modelo</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Temperatura</label>
                                    <span className="font-black text-sm" style={{ color: 'var(--blue-600)' }}>{temp}</span>
                                </div>
                                <input 
                                    type="range" min="0" max="1" step="0.1" 
                                    value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                    style={{ accentColor: 'var(--teal-500)' }}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold block mb-2" style={{ color: 'var(--text-secondary)' }}>Thinking Budget</label>
                                <select 
                                    className="w-full p-3 text-xs font-bold rounded-xl outline-none transition-all focus:ring-2"
                                    style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                                >
                                    <option>4.000 tokens</option>
                                    <option selected>12.000 tokens</option>
                                    <option>24.000 tokens (Max)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="panel-card p-6">
                        <h3 className="kpi-label mb-6">Prompt de Referência</h3>
                        <textarea 
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="w-full h-48 p-4 text-xs font-medium leading-relaxed outline-none transition-all focus:ring-2 resize-none rounded-xl"
                            style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>

                {/* Área de Visualização e Resultados */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl relative group border-2" style={{ borderColor: 'var(--navy-700)' }}>
                            <img src={testImage} alt="Input IA" className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-full border text-[10px] text-white font-bold" style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}>
                                INPUT: NEURO_RES_001.DICOM
                            </div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)' }}></div>
                        </div>

                        <div className="panel-card flex flex-col min-h-[500px] overflow-hidden">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50/30" style={{ borderColor: 'var(--surface-border)' }}>
                                <h3 className="kpi-label font-black text-xs">OUTPUT DA IA (ANÁLISE DE CAMADA)</h3>
                                <div className="flex space-x-1.5 px-3 py-1.5 rounded-full bg-black/5">
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-danger)' }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-success)' }}></div>
                                </div>
                            </div>
                            <div className="flex-1 p-8 font-serif text-lg leading-relaxed overflow-y-auto text-gray-800">
                                {isProcessing ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-brand-blue-100 rounded-full"></div>
                                            <div className="w-16 h-16 border-4 border-brand-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-brand-blue-600 animate-pulse">Executando Inferência Profunda...</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-black mt-2 tracking-widest">GEMINI_MULTIMODAL_V3</p>
                                        </div>
                                    </div>
                                ) : result ? (
                                    <div className="whitespace-pre-wrap animate-in fade-in slide-in-from-right-4 duration-1000">
                                        {result}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                                        <SparklesIcon className="h-12 w-12 opacity-20" />
                                        <p className="text-sm font-bold italic">Aguardando comando de validação...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiLab;
