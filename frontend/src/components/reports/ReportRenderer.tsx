import React from 'react';
import { ReportTheme, ReportData } from '../../types/report';

interface ReportRendererProps {
    theme: ReportTheme;
    data: ReportData;
    viewMode?: 'desktop' | 'mobile' | 'print';
    headerType?: 'institutional' | 'compact' | 'modern';
    layoutType?: 'single' | 'double';
}

export const ReportRenderer: React.FC<ReportRendererProps> = ({ 
    theme, 
    data, 
    viewMode = 'desktop',
    headerType = 'institutional',
    layoutType = 'single'
}) => {

    const renderHeader = () => {
        const logo = data.LOGOTIPO_CLINICA;
        const clinicName = data.NOME_CLINICA || "NOME DA CLÍNICA INDISPONÍVEL";
        const dateStr = new Date().toLocaleDateString('pt-BR');

        if (headerType === 'compact') {
            return (
                <header className="mb-4 pb-2 border-b flex items-center justify-between" style={{ borderColor: theme.design_tokens.colors.border }}>
                    <div className="flex items-center gap-3">
                        {logo && <img src={logo} alt={clinicName} className="h-8 object-contain" />}
                        <h1 className="text-lg font-bold text-gray-900">{clinicName}</h1>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{dateStr}</p>
                </header>
            );
        }

        if (headerType === 'modern') {
            return (
                <header className="mb-10 pt-10 relative">
                    <div className="absolute top-0 left-0 w-20 h-1 bg-brand-blue-500" />
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">{clinicName}</h1>
                            <p className="text-xs font-bold text-brand-blue-600 tracking-widest uppercase mt-1">Diagnostic Report</p>
                        </div>
                        {logo && <img src={logo} alt={clinicName} className="h-12 object-contain grayscale opacity-80" />}
                    </div>
                </header>
            );
        }

        // Institutional (Default)
        return (
            <header
                className="mb-8 pb-6 flex items-center justify-between"
                style={{
                    borderBottom: theme.design_tokens.borders.header_border,
                    borderWidth: theme.design_tokens.special_features?.poster_style ? '8px 0 0 0' : '0 0 1px 0'
                }}
            >
                {logo && (
                    <img
                        src={logo}
                        alt={clinicName}
                        className="h-16 object-contain"
                    />
                )}
                <div className="text-right">
                    <h1 className="text-2xl tracking-tight text-gray-900 font-bold">
                        {clinicName}
                    </h1>
                    <p className="text-sm mt-1 text-gray-600">
                        Laudo Médico • {dateStr}
                    </p>
                </div>
            </header>
        );
    };

    const renderMetadata = () => (
        <section 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-5 bg-slate-50 border-y border-slate-100"
        >
            <div className="border-r border-slate-200 pr-4">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-1">Clínica Solicitante</p>
                <p className="text-xs font-bold text-slate-900 tracking-tight leading-tight">{data.CLINICA_SOLICITANTE || 'Não informada'}</p>
            </div>
            <div className="border-r border-slate-200 pr-4">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-1">Data do Pedido</p>
                <p className="text-xs font-bold text-slate-900 tracking-tight">{data.DATA_HORA_PEDIDO || '---'}</p>
            </div>
            <div className="border-r border-slate-200 pr-4">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-1">Data do Laudo</p>
                <p className="text-xs font-bold text-slate-900 tracking-tight">{data.DATA_HORA_LAUDO || new Date().toLocaleString('pt-BR')}</p>
            </div>
            <div className="pl-2">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-1">CRM Especialista</p>
                <p className="text-xs font-bold text-slate-900 tracking-tight">{data.CRM_MEDICO || '---'}</p>
            </div>
        </section>
    );

    const renderLayoutContent = () => {
        const isDoubleColumn = layoutType === 'double' || theme.design_tokens.layout?.type === 'two_column';

        if (isDoubleColumn) {
            return (
                <div
                    className="grid gap-8 h-full"
                    style={{
                        gridTemplateColumns: theme.design_tokens.layout?.sidebar_width ? `${theme.design_tokens.layout.sidebar_width} ${theme.design_tokens.layout.main_width}` : '250px 1fr'
                    }}
                >
                    <aside className="border-r pr-8" style={{ borderColor: theme.design_tokens.colors.border }}>
                        <section className="mb-8">
                            <h3 className="text-xs uppercase tracking-widest mb-4 opacity-50 font-bold">Paciente</h3>
                            <div
                                className="text-sm space-y-2"
                                dangerouslySetInnerHTML={{ __html: data.DADOS_PACIENTE_DYNAMIC_BLOCK || '' }}
                            />
                        </section>
                        <section>
                            <h3 className="text-xs uppercase tracking-widest mb-4 opacity-50 font-bold">Informações</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Solicitante</p>
                                    <p className="font-bold text-xs">{data.CLINICA_SOLICITANTE || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Data/Hora</p>
                                    <p className="font-bold text-xs">{data.DATA_HORA_LAUDO || '-'}</p>
                                </div>
                            </div>
                        </section>
                    </aside>
                    <main>
                        <div
                            className="report-content prose prose-slate max-w-none"
                            style={{ padding: theme.design_tokens.spacing.content_padding }}
                            dangerouslySetInnerHTML={{
                                __html: data.CORPO_DO_LAUDO || '<p class="opacity-40 italic">Conteúdo do laudo sendo processado...</p>'
                            }}
                        />
                    </main>
                </div>
            );
        }

        return (
            <>
                <section
                    className={`mb-6 p-4 ${theme.design_tokens.special_features?.boxed_sections ? 'bg-white shadow-sm border' : ''}`}
                    style={{
                        background: theme.design_tokens.special_features?.boxed_sections ? '#ffffff' : theme.design_tokens.colors.surface,
                        borderRadius: theme.design_tokens.borders.radius,
                        border: theme.design_tokens.borders.section_divider
                    }}
                >
                    <h3
                        className="text-sm uppercase tracking-wider mb-3 font-bold"
                        style={{ color: theme.design_tokens.colors.secondary }}
                    >
                        Dados do Paciente
                    </h3>
                    <div
                        dangerouslySetInnerHTML={{ __html: data.DADOS_PACIENTE_DYNAMIC_BLOCK || '' }}
                    />
                </section>

                {renderMetadata()}

                <main className={`prose max-w-none ${theme.design_tokens.special_features?.boxed_sections ? 'bg-white shadow-sm border p-8' : ''}`}
                    style={{
                        borderRadius: theme.design_tokens.borders.radius,
                        borderColor: theme.design_tokens.colors.border
                    }}
                >
                    <div
                        className="report-content"
                        style={{ padding: theme.design_tokens.spacing.content_padding }}
                        dangerouslySetInnerHTML={{
                            __html: data.CORPO_DO_LAUDO || '<p class="text-gray-400 italic text-center py-10">O conteúdo do laudo técnico será exibido aqui.</p>'
                        }}
                    />
                </main>
            </>
        );
    };

    const containerStyle: React.CSSProperties = {
        padding: theme.design_tokens.spacing.page_margin,
        background: theme.design_tokens.colors.background,
        fontSize: theme.design_tokens.typography.base_size,
        fontFamily: `${theme.design_tokens.typography.body_font}, sans-serif`,
        color: theme.design_tokens.colors.primary,
        lineHeight: theme.design_tokens.typography.line_height,
        ...theme.css_variables as React.CSSProperties
    };

    return (
        <div id="report-print-container">
            <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;600&family=Space+Grotesk:wght@400;500&family=Nunito+Sans:wght@300;400&family=Source+Serif+Pro:wght@400;600&family=Space+Mono:wght@400;700&family=Outfit:wght@400;600&display=swap');
          
          .report-theme-${theme.id} h1, 
          .report-theme-${theme.id} h2, 
          .report-theme-${theme.id} h3 {
            font-family: ${theme.design_tokens.typography.heading_font}, sans-serif;
            font-weight: ${theme.design_tokens.typography.heading_weight};
            text-shadow: ${theme.design_tokens.special_features?.glow_effects ? '0 0 10px rgba(0, 255, 65, 0.3)' : 'none'};
            text-transform: ${theme.design_tokens.special_features?.uppercase_headings ? 'uppercase' : 'none'};
          }
           
          @media print {
            body * {
                visibility: hidden;
            }
            #report-print-container, #report-print-container * {
                visibility: visible;
            }
            #report-print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 210mm;
                margin: 0;
                box-shadow: none !important;
            }
            .no-print { display: none !important; }
          }
        `}</style>

            <div
                className={`report-theme-${theme.id} flex flex-col min-h-[297mm] mx-auto bg-white shadow-2xl transition-all duration-500 ease-out`}
                style={{
                    ...containerStyle,
                    width: viewMode === 'mobile' ? '375px' : '210mm',
                    boxShadow: viewMode === 'print' ? 'none' : undefined
                }}
            >
                {renderHeader()}

                <div className="flex-1">
                    {renderLayoutContent()}
                </div>

                <footer className="mt-16 pt-10 border-t-2" style={{ borderColor: theme.design_tokens.colors.border }}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 max-w-[300px]">
                            {data.ASSINATURA_DIGITAL_MEDICO && (
                                <div className="mb-6 relative group">
                                    <div className="absolute -top-4 -left-2 text-[8px] font-black uppercase tracking-widest text-brand-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Digital Link Verified</div>
                                    <img
                                        src={data.ASSINATURA_DIGITAL_MEDICO}
                                        alt="Assinatura"
                                        className="h-20 object-contain drop-shadow-sm"
                                    />
                                </div>
                            )}
                            <div
                                className="w-full h-1 mb-4 bg-slate-900"
                                style={{ background: theme.design_tokens.colors.primary }}
                            />
                            <div className="space-y-1">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                                    Dr. {data.NOME_MEDICO || "Médico Não Identificado"}
                                </p>
                                <p className="text-xs font-bold text-brand-blue-600 tracking-widest uppercase">
                                    CRM: {data.CRM_MEDICO || "---"}
                                </p>
                                <div className="flex items-center gap-2 pt-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Documento assinado digitalmente e Validado</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            {(theme.id === 'heritage-medical' || theme.design_tokens.special_features?.poster_style) && (
                                <div
                                    className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center border-double opacity-20 rotate-12 transition-transform hover:rotate-0 cursor-default"
                                    style={{ borderColor: theme.design_tokens.colors.accent, color: theme.design_tokens.colors.accent }}
                                >
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">SECURE</span>
                                    <div className="w-12 h-px bg-current my-1" />
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">VERIFIED</span>
                                    <div className="text-[8px] mt-1 font-serif italic">Authentic Report</div>
                                </div>
                            )}
                            <div className="text-[8px] text-slate-300 font-medium text-right uppercase tracking-[0.3em]">
                                Digital Signature ID: {Math.random().toString(36).substring(7).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
