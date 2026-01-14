
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
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            addToast('Erro: API Key não configurada. Verifique o arquivo .env.local', 'error');
            setIsProcessing(false);
            return;
        }

        try {
            let imagePart = null;
            if (testImage) {
                try {
                    const imgResponse = await fetch(testImage);
                    if (!imgResponse.ok) throw new Error("Failed to fetch image");
                    const arrayBuffer = await imgResponse.arrayBuffer();

                    let binary = '';
                    const bytes = new Uint8Array(arrayBuffer);
                    const len = bytes.byteLength;
                    for (let i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    const base64 = window.btoa(binary);

                    imagePart = {
                        inlineData: {
                            data: base64,
                            mimeType: imgResponse.headers.get('content-type') || 'image/png'
                        }
                    };
                } catch (e) {
                    console.error("Failed to fetch image", e);
                    addToast('Falha ao baixar imagem para análise. Verifique a URL.', 'error');
                    setIsProcessing(false);
                    return;
                }
            }

            const ai = new GoogleGenAI({ apiKey });

            const parts: any[] = [];
            if (systemPrompt) parts.push({ text: `CONTEXTO DE TREINAMENTO: ${systemPrompt}` });
            if (imagePart) parts.push(imagePart);

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-thinking-exp-01-21',
                contents: [{ role: 'user', parts: parts }],
                config: { 
                    temperature: temp, 
                    thinkingConfig: { thinkingBudget: 12000 } 
                }
            });
            setResult(response.text || 'Sem resultado');
            addToast('Otimização do modelo concluída!', 'success');
        } catch (error: any) {
            console.error(error);
            addToast(`Falha crítica no processamento da IA: ${error.message || error}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-3 bg-brand-blue-600 rounded-2xl mr-4 shadow-lg shadow-brand-blue-200">
                        <BrainIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">IA Sandbox Laboratory</h1>
                        <p className="text-gray-500 font-medium">Calibração de Modelos Gemini 2.0 Flash Thinking para Diagnósticos de Visão</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" className="rounded-xl">Ver Logs de Erro</Button>
                    <Button onClick={runDiagnosticTest} disabled={isProcessing} className="rounded-xl px-8 shadow-xl hover:shadow-brand-blue-100">
                        <SparklesIcon className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                        Iniciar Processamento Vision
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Painel de Controle Técnico */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Parâmetros do Modelo</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-gray-700">Temperatura</label>
                                    <span className="text-brand-blue-600 font-black">{temp}</span>
                                </div>
                                <input 
                                    type="range" min="0" max="1" step="0.1" 
                                    value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-blue-600"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Thinking Budget</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-brand-blue-500">
                                    <option>4.000 tokens</option>
                                    <option selected>12.000 tokens</option>
                                    <option>24.000 tokens (Max)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Prompt de Referência</h3>
                        <textarea 
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="w-full h-48 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium text-gray-700 leading-relaxed outline-none focus:ring-2 focus:ring-brand-blue-500 resize-none"
                        />
                    </div>
                </div>

                {/* Área de Visualização e Resultados */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative group border-4 border-white">
                            <img src={testImage} alt="Input IA" className="w-full h-full object-contain" />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] text-white font-bold">
                                INPUT: NEURO_RES_001.DICOM
                            </div>
                            <div className="absolute inset-0 bg-brand-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
                                <h3 className="font-black text-gray-800 text-sm tracking-tight">OUTPUT DA IA (ANÁLISE DE CAMADA)</h3>
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
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
                                            <p className="text-[10px] text-gray-400 uppercase font-black mt-2 tracking-widest">GEMINI_MULTIMODAL_V2_FLASH</p>
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
