import React from 'react';
import { ReportTheme, ReportData } from '../../../types/report';

interface ReportRendererProps {
    theme: ReportTheme;
    data: ReportData;
    viewMode?: 'desktop' | 'mobile' | 'print';
}

export const ReportRenderer: React.FC<ReportRendererProps> = ({ theme, data, viewMode = 'desktop' }) => {

    const renderLayoutContent = () => {
        if (theme.design_tokens.layout?.type === 'two_column') {
            return (
                <div
                    className="grid gap-8 h-full"
                    style={{
                        gridTemplateColumns: `${theme.design_tokens.layout.sidebar_width} ${theme.design_tokens.layout.main_width}`
                    }}
                >
                    <aside className="border-r pr-8" style={{ borderColor: theme.design_tokens.colors.border }}>
                        <section className="mb-8">
                            <h3 className="text-xs uppercase tracking-widest mb-4 opacity-50">Paciente</h3>
                            <div
                                className="text-sm space-y-2"
                                dangerouslySetInnerHTML={{ __html: data.DADOS_PACIENTE_DYNAMIC_BLOCK || '' }}
                            />
                        </section>
                        <section>
                            <h3 className="text-xs uppercase tracking-widest mb-4 opacity-50">Clínica</h3>
                            <p className="font-bold text-sm">{data.NOME_CLINICA}</p>
                        </section>
                    </aside>
                    <main>
                        <div
                            className="report-content"
                            style={{ padding: theme.design_tokens.spacing.content_padding }}
                            dangerouslySetInnerHTML={{
                                __html: data.CORPO_DO_LAUDO || '<p class="opacity-40 italic">Conteúdo do laudo em layout institucional de duas colunas...</p>'
                            }}
                        />
                    </main>
                </div>
            );
        }

        return (
            <>
                {/* Bloco Dinâmico de Dados do Paciente */}
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

                {/* Corpo do Laudo */}
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
                            __html: data.CORPO_DO_LAUDO || '<p class="text-gray-400 italic text-center py-10">Este é um exemplo de visualização do laudo técnico com o tema selecionado.</p>'
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
                {/* Header Dinâmico */}
                <header
                    className="mb-8 pb-6 flex items-center justify-between"
                    style={{
                        borderBottom: theme.design_tokens.borders.header_border,
                        borderWidth: theme.design_tokens.special_features?.poster_style ? '8px 0 0 0' : '0 0 1px 0'
                    }}
                >
                    {data.LOGOTIPO_CLINICA && (
                        <img
                            src={data.LOGOTIPO_CLINICA}
                            alt={data.NOME_CLINICA}
                            className="h-16 object-contain"
                        />
                    )}
                    <div className="text-right">
                        <h1
                            className="text-2xl tracking-tight"
                            style={{ color: theme.design_tokens.colors.primary }}
                        >
                            {data.NOME_CLINICA}
                        </h1>
                        <p
                            className="text-sm mt-1"
                            style={{ color: theme.design_tokens.colors.secondary }}
                        >
                            Laudo Médico • {new Date().toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                </header>

                <div className="flex-1">
                    {renderLayoutContent()}
                </div>

                {/* Assinatura Digital */}
                <footer className="mt-12 pt-8 border-t" style={{ borderColor: theme.design_tokens.colors.border }}>
                    <div className="flex items-end justify-between">
                        <div className="flex-1">
                            {data.ASSINATURA_DIGITAL_MEDICO && (
                                <img
                                    src={data.ASSINATURA_DIGITAL_MEDICO}
                                    alt="Assinatura"
                                    className="h-20 object-contain mb-2"
                                />
                            )}
                            <div
                                className="w-48 h-px mb-2"
                                style={{ background: theme.design_tokens.colors.primary }}
                            />
                            <p className="text-sm font-medium">Dr. {data.NOME_MEDICO}</p>
                            <p className="text-xs" style={{ color: theme.design_tokens.colors.secondary }}>
                                CRM: {data.CRM_MEDICO}
                            </p>
                        </div>

                        {(theme.id === 'heritage-medical' || theme.design_tokens.special_features?.poster_style) && (
                            <div
                                className="w-24 h-24 rounded-full border-2 flex items-center justify-center opacity-20"
                                style={{ borderColor: theme.design_tokens.colors.accent }}
                            >
                                <span className="text-xs font-serif italic text-center text-slate-800">AUTHENTIC<br />REPORT</span>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};
