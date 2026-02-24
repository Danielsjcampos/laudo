
import React, { useState } from 'react';
import { BrainIcon } from '../../icons/BrainIcon';

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
    const [isMobileBannerDismissed, setIsMobileBannerDismissed] = useState(false);

    // Detecta dispositivo mobile via user agent + viewport
    const isMobileDevice = typeof window !== 'undefined' &&
        (window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

    // --- URL DINÂMICA: funciona tanto em localhost quanto no VPS ---
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const ohifBaseUrl = isProduction
        ? `https://viewer.${window.location.hostname}` 
        : `http://${window.location.hostname}:3000`; 

    const backendBaseUrl = isProduction
        ? `https://${window.location.hostname}`         
        : `http://${window.location.hostname}:3001`;                      

    const containerRef = React.useRef<HTMLDivElement>(null);

    const getIframeSrc = () => {
        let finalUrl = '';
        if (dicomUrl.startsWith('http')) {
            if (isProduction && dicomUrl.startsWith('http://')) {
                finalUrl = dicomUrl.replace('http://', 'https://');
            } else {
                finalUrl = dicomUrl;
            }
        } else {
            const cleanPath = dicomUrl.startsWith('/') ? dicomUrl : `/${dicomUrl}`;
            finalUrl = `${backendBaseUrl}${cleanPath}`;
        }
        return `${ohifBaseUrl}/localbasic?url=${encodeURIComponent(finalUrl)}`;
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement && containerRef.current) {
            containerRef.current.requestFullscreen().catch((e) => {
                console.error(`Error attempting fullscreen: ${e.message}`);
            });
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const openInNewTab = () => window.open(getIframeSrc(), '_blank');

    return (
        <div ref={containerRef} className="flex flex-col h-full w-full bg-black rounded-xl overflow-hidden shadow-2xl animate-in fade-in duration-300 ring-1 ring-gray-800">

            {/* Header de controles */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#090c0f] border-b border-gray-800 shrink-0 gap-2">
                {/* Back + Title */}
                <div className="flex items-center gap-2 min-w-0">
                    {!isSharedView && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (document.fullscreenElement) document.exitFullscreen().catch(console.error);
                                onBack();
                            }}
                            className="btn-touch p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0"
                            title="Voltar"
                            aria-label="Voltar"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    )}
                    <h2 className="text-gray-200 font-bold text-sm hidden sm:block truncate">OHIF Viewer</h2>
                </div>

                {/* Mode selector — scroll horizontal em mobile */}
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 gap-0.5 overflow-x-auto scrollbar-hide flex-shrink min-w-0">
                    {[
                        { id: 'viewer' as ViewerMode, label: 'Padrão', icon: <MonitorIcon className="w-3 h-3" /> },
                        { id: 'microscopy' as ViewerMode, label: 'Micro', icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg> },
                        ...(!isSharedView ? [{ id: 'segmentation' as ViewerMode, label: 'IA', icon: <BrainIcon className="w-3 h-3" /> }] : []),
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] uppercase font-black tracking-wide transition-all shrink-0 ${
                                mode === m.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            {m.icon}
                            <span className="hidden xs:inline">{m.label}</span>
                        </button>
                    ))}
                </div>

                {/* Ações — "Nova Aba" é primário em mobile */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={openInNewTab}
                        className="btn-touch flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
                        title="Abrir em Nova Aba"
                        aria-label="Abrir viewer em nova aba"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="hidden sm:inline">Nova Janela</span>
                    </button>
                    <button
                        onClick={toggleFullScreen}
                        className="btn-touch p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-gray-700"
                        title="Tela Cheia"
                        aria-label="Expandir tela cheia"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Banner Mobile — sugere abrir em nova aba */}
            {isMobileDevice && !isMobileBannerDismissed && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-900/60 border-b border-blue-800/50 text-xs text-blue-200 shrink-0">
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1">Para melhor experiência em mobile, use <strong>Nova Janela</strong></span>
                    <button
                        onClick={() => setIsMobileBannerDismissed(true)}
                        className="btn-touch p-1 text-blue-400 hover:text-white rounded"
                        aria-label="Fechar aviso"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Viewer Iframe com touch-action para pinch-zoom */}
            <div className="flex-1 w-full flex flex-col min-h-[400px] bg-black">
                <iframe
                    src={getIframeSrc()}
                    className="flex-1 w-full min-h-[400px] border-none block"
                    title="OHIF Medical Viewer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    style={{ touchAction: 'manipulation' }}
                />
            </div>
        </div>
    );
};
