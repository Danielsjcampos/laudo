
import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { BrainIcon } from '../../icons/BrainIcon';

// Inline simple icons for missing ones
const MonitorIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
);



interface OhifViewerProps {
    dicomUrl: string;
    onBack: () => void;
    isSharedView?: boolean;
}

type ViewerMode = 'viewer' | 'microscopy' | 'segmentation';

export const OhifViewer: React.FC<OhifViewerProps> = ({ dicomUrl, onBack, isSharedView }) => {
    const [mode, setMode] = useState<ViewerMode>('viewer');
    // Em produção usa viewer.laudo.2b.app.br, em localhost usa 127.0.0.1:3000
    const ohifBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:3000'
        : `https://viewer.${window.location.host}`;

    const containerRef = React.useRef<HTMLDivElement>(null);

    const getIframeSrc = () => {
        // Usa o origin atual para funcionar tanto em localhost quanto em produção
        const backendUrl = window.location.origin;
        // Em desenvolvimento, o Vite proxy não cobre /uploads, então usamos localhost:3001 diretamente
        const uploadsBackend = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3001'
            : window.location.origin;
        
        let finalUrl = '';
        if (dicomUrl.startsWith('http')) {
            finalUrl = dicomUrl;
        } else {
            // Ensure we have exactly one slash between backendUrl and relative path
            const cleanPath = dicomUrl.startsWith('/') ? dicomUrl : `/${dicomUrl}`;
            finalUrl = `${uploadsBackend}${cleanPath}`;
        }

        // Pass as URL encoded JSON
        return `${ohifBaseUrl}/localbasic?url=${encodeURIComponent(finalUrl)}`;
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement && containerRef.current) {
            containerRef.current.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const openInNewTab = () => {
        window.open(getIframeSrc(), '_blank');
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full w-full bg-black rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 ring-1 ring-gray-800">
            {/* Mode Selector Header - Compact */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#090c0f] border-b border-gray-800 shrink-0">
                <div className="flex items-center gap-3">
                    {!isSharedView && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (document.fullscreenElement) {
                                    document.exitFullscreen().catch(err => console.error(err));
                                }
                                onBack();
                            }}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-50 cursor-pointer"
                            title="Voltar"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    )}
                    <h2 className="text-gray-200 font-bold text-sm hidden sm:block">OHIF Viewer</h2>
                </div>

                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 gap-0.5 overflow-x-auto max-w-[40%] scrollbar-hide">
                    <button
                        onClick={() => setMode('viewer')}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[9px] uppercase font-black tracking-wide transition-all shrink-0 ${mode === 'viewer'
                            ? 'bg-brand-blue-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <MonitorIcon className="w-3 h-3" />
                        Padrão
                    </button>
                    <button
                        onClick={() => setMode('microscopy')}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[9px] uppercase font-black tracking-wide transition-all shrink-0 ${mode === 'microscopy'
                            ? 'bg-brand-blue-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        Microscopia
                    </button>
                    {!isSharedView && (
                        <button
                            onClick={() => setMode('segmentation')}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[9px] uppercase font-black tracking-wide transition-all shrink-0 ${mode === 'segmentation'
                                ? 'bg-brand-blue-600 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            <BrainIcon className="w-3 h-3" />
                            IA
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={openInNewTab}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="Abrir em Nova Aba"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        <span className="hidden sm:inline">Nova Janela</span>
                    </button>
                    <button
                        onClick={toggleFullScreen}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-all border border-gray-700 hover:border-gray-500"
                        title="Tela Cheia"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="hidden sm:inline">Expandir</span>
                    </button>
                </div>
            </div>

            {/* Viewer Iframe */}
            <div className="flex-1 relative bg-black w-full h-full">
                <iframe
                    src={getIframeSrc()}
                    className="absolute inset-0 w-full h-full border-0"
                    title="OHIF Medical Viewer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                />
            </div>
        </div>
    );
};
