
import React, { useState } from 'react';

interface DicomViewerProps {
    dicomUrl?: string;
    modality?: string;
}

const TOOLBAR_ITEMS = [
    { label: 'W/L', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { label: 'Zoom', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7' },
    { label: 'Pan', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { label: 'Invert', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { label: 'Reset', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }, 
];

// Note: Reset icon reused simple refresh style for now.

export const DicomViewer: React.FC<DicomViewerProps> = ({ dicomUrl, modality }) => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    return (
        <div className="bg-black rounded-3xl overflow-hidden shadow-sm border border-gray-800 flex flex-col h-[600px] relative group">
             {/* Toolbar Overlay */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 z-20 flex gap-1 opacity-100 transition-opacity">
                {TOOLBAR_ITEMS.map((tool) => (
                    <button
                        key={tool.label}
                        onClick={() => setActiveTool(tool.label)}
                        className={`p-2 rounded-full transition-colors flex flex-col items-center justify-center w-10 h-10 ${
                            activeTool === tool.label ? 'bg-brand-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                        title={tool.label}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                        </svg>
                    </button>
                ))}
             </div>

             {/* Info Overlays */}
             <div className="absolute top-4 left-4 text-[10px] font-mono text-cyan-500 z-10 pointer-events-none">
                 <p>ID: 849302</p>
                 <p>NAME: ANONYMIZED</p>
                 <p>MOD: {modality || 'OT'}</p>
                 <p>{new Date().toLocaleDateString()}</p>
             </div>
             <div className="absolute bottom-4 right-4 text-[10px] font-mono text-cyan-500 z-10 pointer-events-none text-right">
                 <p>KV: 120</p>
                 <p>mA: 200</p>
                 <p>W: 1500 L: 450</p>
                 <p>Z: 100%</p>
             </div>

             {/* Main View Area */}
             <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
                {/* Simulated Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-1 pointer-events-none opacity-20 border-r border-gray-800"></div>

                {dicomUrl ? (
                    // In a real app, this would be the Cornerstone/OHIF canvas
                    <div className="w-full h-full relative cursor-crosshair flex items-center justify-center bg-gray-900">
                         {/* Placeholder Graphic for Medical Image */}
                         <div className="w-3/4 h-3/4 opacity-50 relative">
                            {/* Simple simulated medical shape */}
                            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gray-700 w-full h-full animate-pulse-slow">
                                <path strokeWidth="0.5" d="M30 50 Q 50 20 70 50 T 30 50" />
                                <circle cx="50" cy="50" r="30" strokeWidth="0.5" />
                                <rect x="40" y="40" width="20" height="20" strokeWidth="0.5" />
                            </svg>
                         </div>
                         <p className="absolute bottom-10 text-gray-500 font-mono text-xs">DICOM: {dicomUrl.split('/').pop()?.slice(0, 20)}...</p>
                    </div>
                ) : (
                    <div className="text-gray-600 font-mono text-xs text-center">
                        <p>No Image Data</p>
                    </div>
                )}
             </div>

             {/* Timeline/Series Scrubber */}
             <div className="bg-gray-900 border-t border-gray-800 p-2 flex gap-1 h-16 overflow-x-auto custom-scrollbar">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className={`flex-shrink-0 w-12 bg-black border border-gray-700 rounded-md cursor-pointer hover:border-brand-blue-500 ${i===1 && 'border-brand-blue-500'}`}></div>
                ))}
             </div>
        </div>
    );
};
