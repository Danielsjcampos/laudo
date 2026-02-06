
import React, { useEffect, useRef, useState } from 'react';
import { initCornerstone, getCornerstone, getCornerstoneTools } from '../../../utils/cornerstoneService';

interface DicomViewerProps {
    dicomUrl?: string;
    examImageUrl?: string; // Fallback or extracted image
    modality?: string;
}

const TOOLBAR_ITEMS = [
    { label: 'Wwwc', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', name: 'Nível' },
    { label: 'Zoom', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7', name: 'Zoom' },
    { label: 'Pan', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', name: 'Mover' },
    { label: 'Invert', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', name: 'Inverter' },
    { label: 'Reset', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', name: 'Resetar' },
];

const API_BASE = 'http://localhost:3001';

export const DicomViewer: React.FC<DicomViewerProps> = ({ dicomUrl, examImageUrl, modality }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [activeTool, setActiveTool] = useState<string>('Wwwc');
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize Cornerstone once
    useEffect(() => {
        initCornerstone();
    }, []);

    // Load Image
    useEffect(() => {
        const loadDicom = async () => {
            if (!dicomUrl || !elementRef.current) return;

            try {
                const cornerstone = getCornerstone();
                const cornerstoneTools = getCornerstoneTools();

                cornerstone.enable(elementRef.current);

                // Construct WADO URL
                // Verify if it is a full URL or relative
                const fullUrl = dicomUrl.startsWith('http')
                    ? `wadouri:${dicomUrl}`
                    : `wadouri:${API_BASE}${dicomUrl}`;

                console.log('Loading DICOM:', fullUrl);

                const image = await cornerstone.loadImage(fullUrl);
                cornerstone.displayImage(elementRef.current, image);
                setIsLoaded(true);

                // Initialize basic tools
                const WwwcTool = cornerstoneTools.WwwcTool;
                const PanTool = cornerstoneTools.PanTool;
                const ZoomTool = cornerstoneTools.ZoomTool;

                cornerstoneTools.addTool(WwwcTool);
                cornerstoneTools.addTool(PanTool);
                cornerstoneTools.addTool(ZoomTool);

                // Set default tool
                cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
                setActiveTool('Wwwc');

            } catch (err: any) {
                console.error('Cornerstone Load Error:', err);
                setError(`Erro ao carregar DICOM: ${err.message || err}`);
            }
        };

        if (dicomUrl) {
            loadDicom();
        }

        return () => {
            if (elementRef.current) {
                const cornerstone = getCornerstone();
                if (cornerstone) cornerstone.disable(elementRef.current);
            }
        };
    }, [dicomUrl]);

    // Handle Tool Change
    const handleToolClick = (toolName: string) => {
        const cornerstone = getCornerstone();
        const cornerstoneTools = getCornerstoneTools();
        const element = elementRef.current;

        if (!element || !cornerstone) return;

        if (toolName === 'Reset') {
            cornerstone.reset(element);
            return;
        }

        if (toolName === 'Invert') {
            const viewport = cornerstone.getViewport(element);
            if (viewport) {
                viewport.invert = !viewport.invert;
                cornerstone.setViewport(element, viewport);
            }
            return;
        }

        // Switch active tool
        // Deactivate all first (simplified approach)
        cornerstoneTools.setToolEnabled('Wwwc');
        cornerstoneTools.setToolEnabled('Pan');
        cornerstoneTools.setToolEnabled('Zoom');

        cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
        setActiveTool(toolName);
    };

    return (
        <div className="bg-black rounded-3xl overflow-hidden shadow-sm border border-gray-800 flex flex-col h-[600px] relative group">
            {/* Toolbar Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 z-20 flex gap-1 opacity-100 transition-opacity">
                {TOOLBAR_ITEMS.map((tool) => (
                    <button
                        key={tool.label}
                        onClick={() => handleToolClick(tool.label)}
                        className={`p-2 rounded-full transition-colors flex flex-col items-center justify-center w-10 h-10 ${activeTool === tool.label ? 'bg-brand-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        title={tool.name}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                        </svg>
                    </button>
                ))}
            </div>

            {/* Info Overlays */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-cyan-500 z-10 pointer-events-none">
                <p>ID: {dicomUrl?.split('-').pop()?.slice(0, 8) || 'Unknown'}</p>
                <p>MOD: {modality || 'OT'}</p>
                <p>{new Date().toLocaleDateString()}</p>
            </div>

            {/* Main View Area */}
            <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
                {/* Simulated Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-1 pointer-events-none opacity-20 border-r border-gray-800"></div>

                {error ? (
                    <div className="text-red-500 font-mono text-xs">{error}</div>
                ) : (
                    <div
                        ref={elementRef}
                        className="w-full h-full relative"
                        // Disable browser context menu
                        onContextMenu={(e) => e.preventDefault()}
                    />
                )}

                {!isLoaded && !error && !dicomUrl && (
                    <div className="text-gray-500 font-mono text-xs">Selecione um exame</div>
                )}
            </div>

            {/* Timeline/Series Scrubber */}
            <div className="bg-gray-900 border-t border-gray-800 p-2 flex gap-1 h-16 overflow-x-auto custom-scrollbar">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className={`flex-shrink-0 w-12 bg-black border border-gray-700 rounded-md cursor-pointer hover:border-brand-blue-500 ${i === 1 && 'border-brand-blue-500'}`}></div>
                ))}
            </div>
        </div>
    );
};
