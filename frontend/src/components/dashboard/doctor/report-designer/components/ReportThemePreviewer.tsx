import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Monitor,
  Smartphone
} from 'lucide-react';
import { ReportTheme, ReportData } from '../../../../../types/report';
import { ReportRenderer } from '../../../../../components/reports/ReportRenderer';

interface ReportThemePreviewerProps {
  themes: ReportTheme[];
  initialData: ReportData;
  onThemeSelect: (themeId: string) => void;
  onGenerateAI: () => Promise<string>;
  tenantConfig: {
    clinicName: string;
    logoUrl: string;
    primaryColor: string;
  };
}

export const ReportThemePreviewer: React.FC<ReportThemePreviewerProps> = ({
  themes,
  initialData,
  onThemeSelect,
  onGenerateAI,
  tenantConfig
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ReportTheme>(themes[0]);
  const [previewData, setPreviewData] = useState<ReportData>(initialData);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'print'>('desktop');

  // Injeção de variáveis do tenant
  const injectTenantVariables = (data: ReportData): ReportData => ({
    ...data,
    NOME_CLINICA: tenantConfig.clinicName,
    LOGOTIPO_CLINICA: tenantConfig.logoUrl,
  });

  const handleThemeChange = (theme: ReportTheme) => {
    setSelectedTheme(theme);
    onThemeSelect(theme.id);
  };

  const handleAIGeneration = async () => {
    setIsGeneratingAI(true);
    try {
      const generatedContent = await onGenerateAI();
      setPreviewData(prev => ({
        ...prev,
        CORPO_DO_LAUDO: generatedContent
      }));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const renderReportContent = () => {
    const theme = selectedTheme;
    const data = injectTenantVariables(previewData);

    return (
        <div id="report-preview-container" className={`relative bg-white shadow-2xl transition-all duration-500 ease-out 
            ${viewMode === 'mobile' ? 'w-[375px]' : 'w-[210mm]'} 
            ${viewMode === 'print' ? 'shadow-none' : ''} 
            min-h-[297mm] mx-auto overflow-hidden`}>
            
            <ReportRenderer theme={theme} data={data} viewMode={viewMode} />
        </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar de Controles */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-hidden">
        <div className="p-6 border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Designer de Laudos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Personalize a estética do documento
          </p>
        </div>

        {/* Seletor de Temas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
            Temas Disponíveis
          </label>
          <div className="space-y-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => handleThemeChange(theme)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                  selectedTheme.id === theme.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{theme.name}</span>
                  {selectedTheme.id === theme.id && (
                    <motion.div
                      layoutId="selected-indicator"
                      className="w-2 h-2 rounded-full bg-blue-500"
                    />
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 text-ellipsis">
                  {theme.description}
                </p>
                <div className="flex gap-2 mt-3">
                  <span 
                    className="w-4 h-4 rounded-full border border-slate-200"
                    style={{ background: theme.design_tokens.colors.primary }}
                  />
                  <span 
                    className="w-4 h-4 rounded-full border border-slate-200"
                    style={{ background: theme.design_tokens.colors.accent }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </aside>

      {/* Área de Preview */}
      <main className="flex-1 overflow-hidden flex flex-col h-full">
        {/* Toolbar de Visualização */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'desktop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
              title="Visualização A4"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'mobile' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
              title="Visualização Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              Tema: <strong className="text-slate-900">{selectedTheme.name}</strong>
            </span>
            <div className="h-4 w-px bg-slate-300" />
            <span className="text-sm text-slate-500">
              Formato: <strong className="text-slate-900">{viewMode === 'mobile' ? 'Mobile' : 'A4'}</strong>
            </span>
            {isGeneratingAI && <span className="text-xs text-brand-blue-500 animate-pulse flex items-center gap-1"><Sparkles className="w-3 h-3"/> Gerando IA...</span>}
          </div>
        </div>

        {/* Canvas de Preview */}
        <div className="flex-1 overflow-auto bg-slate-100 p-8">
          <div className="min-h-full flex items-start justify-center pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderReportContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};
