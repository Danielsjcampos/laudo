import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ReportRenderer } from './ReportRenderer';
import { ReportData, ReportTheme } from '../../types/report';
import { reportThemes } from '../dashboard/doctor/report-designer/themes';
import { Button } from '../ui/Button';
import { DownloadIcon } from '../icons/DownloadIcon';

interface PrintableReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReportData;
    initialThemeId?: string;
    allowThemeSelection?: boolean;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({ 
    isOpen, 
    onClose, 
    data, 
    initialThemeId = 'swiss-clinic',
    allowThemeSelection = false
}) => {
    const [selectedThemeId, setSelectedThemeId] = useState(initialThemeId);
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Laudo-${data.NOME_PACIENTE || 'Paciente'}-${new Date().toISOString().split('T')[0]}`,
    });

    const selectedTheme = reportThemes.find(t => t.id === selectedThemeId) || reportThemes[0];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white print:static">
            
            {/* Modal Container - Hidden on Print */}
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl print:hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Visualização do Laudo</h2>
                        <p className="text-sm text-gray-500">Verifique o documento antes de imprimir ou salvar.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose}>Fechar</Button>
                        <Button onClick={handlePrint} className="bg-brand-blue-600 hover:bg-brand-blue-700">
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Imprimir / Salvar PDF
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 overflow-hidden bg-gray-100">
                    
                    {/* Theme Sidebar (Optional) */}
                    {allowThemeSelection && (
                        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto p-4 hidden md:block">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Estilo do Laudo</h3>
                            <div className="space-y-2">
                                {reportThemes.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedThemeId(theme.id)}
                                        className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                                            selectedThemeId === theme.id 
                                            ? 'bg-brand-blue-50 text-brand-blue-700 font-bold ring-2 ring-brand-blue-500 ring-inset' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        </aside>
                    )}

                    {/* Report Preview */}
                    <div className="flex-1 overflow-auto p-8 flex justify-center">
                        <div className="scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-top transition-transform duration-300">
                            <ReportRenderer theme={selectedTheme} data={data} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Content - Visible ONLY during print */}
            <div className="hidden print:block print:absolute print:inset-0 print:bg-white">
                <div ref={componentRef}>
                    <ReportRenderer theme={selectedTheme} data={data} viewMode="print" />
                </div>
            </div>
        </div>
    );
};
