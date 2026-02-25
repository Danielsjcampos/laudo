import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Monitor,
  Smartphone,
  Columns,
  Type,
  Layout,
  PlusCircle,
  FolderOpen
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
  const [headerType, setHeaderType] = useState<'institutional' | 'compact' | 'modern'>('institutional');
  const [layoutType, setLayoutType] = useState<'single' | 'double'>('single');

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

  const handleShowExample = () => {
    setPreviewData(prev => ({
      ...prev,
      CORPO_DO_LAUDO: `
        <h2 style="font-size: 1.2rem; margin-bottom: 1rem; color: #1e293b;">LAUDO DE RESSONÂNCIA MAGNÉTICA DO CRÂNIO</h2>
        
        <h3 style="font-size: 1rem; margin-top: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Indicação Clínica</h3>
        <p>Paciente com quadro de cefaleia holocraniana de caráter pulsátil, associada a náuseas e fotofobia.</p>
        
        <h3 style="font-size: 1rem; margin-top: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Técnica</h3>
        <p>Exame realizado em aparelho de alto campo (1.5 Tesla), com sequências multiplanares ponderadas em T1, T2, FLAIR e Difusão (DWI).</p>
        
        <h3 style="font-size: 1rem; margin-top: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Análise</h3>
        <p>Parênquima encefálico com intensidade de sinal conservada. Não há evidência de coleções extra-axiais ou áreas de restrição à difusão que sugiram isquemia aguda. Sistema ventricular com dimensões e configuração anatômica preservada. Estruturas da linha média centradas.</p>
        
        <h3 style="font-size: 1rem; margin-top: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Conclusão</h3>
        <p>1. Estudo de Ressonância Magnética do Crânio dentro dos padrões de normalidade para a faixa etária.</p>
        <p>2. Ausência de sinais sugestivos de hipertensão intracraniana ou processos expansivos.</p>
      `
    }));
  };

  const handleSaveTemplate = () => {
    const templateConfig = {
      themeId: selectedTheme.id,
      headerType,
      layoutType
    };
    const savedTemplates = JSON.parse(localStorage.getItem('my_report_templates') || '[]');
    savedTemplates.push({
      id: Date.now().toString(),
      name: `Template ${savedTemplates.length + 1}`,
      config: templateConfig
    });
    localStorage.setItem('my_report_templates', JSON.stringify(savedTemplates));
    alert('Configuração de Template salva com sucesso!');
  };

  const handleLoadTemplates = () => {
    const savedTemplates = JSON.parse(localStorage.getItem('my_report_templates') || '[]');
    if (savedTemplates.length === 0) {
      alert('Nenhum template salvo encontrado.');
      return;
    }
    const latest = savedTemplates[savedTemplates.length - 1];
    setSelectedTheme(themes.find(t => t.id === latest.config.themeId) || themes[0]);
    setHeaderType(latest.config.headerType);
    setLayoutType(latest.config.layoutType);
    alert(`Carregado: ${latest.name}`);
  };

  const renderReportContent = () => {
    const theme = selectedTheme;
    const data = injectTenantVariables(previewData);

    return (
      <ReportRenderer 
        theme={theme} 
        data={data} 
        viewMode={viewMode} 
        headerType={headerType}
        layoutType={layoutType}
      />
    );
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
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

        {/* Área de Scroll Única para todos os controles */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Seletor de Temas */}
          <div className="p-6 space-y-4">
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

          {/* Configurações Adicionais */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/30 space-y-6">
            <section>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                Estilo de Cabeçalho
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'institutional', label: 'Institucional', desc: 'Clássico e equilibrado' },
                  { id: 'compact', label: 'Compacto', desc: 'Minimalismo funcional' },
                  { id: 'modern', label: 'Moderno', desc: 'Ousado e contemporâneo' }
                ].map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHeaderType(h.id as any)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      headerType === h.id 
                        ? 'border-brand-blue-500 bg-white shadow-sm ring-2 ring-brand-blue-500/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className={`text-xs font-bold ${headerType === h.id ? 'text-brand-blue-600' : 'text-slate-700'}`}>{h.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{h.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                Estrutura de Colunas
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLayoutType('single')}
                  className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    layoutType === 'single' ? 'border-brand-blue-500 bg-white text-brand-blue-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  <div className="w-6 h-4 bg-current opacity-20 rounded-sm" />
                  <span className="text-[10px] font-bold">Única</span>
                </button>
                <button
                  onClick={() => setLayoutType('double')}
                  className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    layoutType === 'double' ? 'border-brand-blue-500 bg-white text-brand-blue-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  <div className="flex gap-1 w-6 h-4 opacity-20">
                      <div className="flex-1 bg-current rounded-sm" />
                      <div className="flex-1 bg-current rounded-sm" />
                  </div>
                  <span className="text-[10px] font-bold">Duas</span>
                </button>
              </div>
            </section>

            <div className="pt-4 space-y-2">
              <button 
                  onClick={handleShowExample}
                  className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors mb-2"
              >
                <Sparkles className="w-4 h-4 text-brand-blue-500" />
                Ver Laudo de Exemplo
              </button>
              <button 
                  onClick={handleSaveTemplate}
                  className="w-full py-3 px-4 bg-brand-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-blue-700 transition-colors shadow-lg shadow-brand-blue-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                Criar Meu Template
              </button>
              <button 
                  onClick={handleLoadTemplates}
                  className="w-full py-3 px-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                Carregar Meus Templates
              </button>
            </div>
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
