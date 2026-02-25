
export interface ReportTheme {
  id: string;
  name: string;
  description: string;
  category: 'minimalist' | 'modern' | 'classic' | 'editorial' | 'organic';
  variants?: string[];
  design_tokens: {
    typography: {
      heading_font: string;
      body_font: string;
      heading_weight: string;
      body_weight: string;
      base_size: string;
      line_height: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      border: string;
    };
    dark_mode_colors?: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      border: string;
    };
    spacing: {
      page_margin: string;
      section_gap: string;
      content_padding: string;
      grid_gap?: string;
    };
    borders: {
      header_border: string;
      section_divider: string;
      radius: string;
      card_radius?: string;
      ornament?: string;
      soft_shadows?: boolean;
    };
    layout?: {
      type: string;
      sidebar_width: string;
      main_width: string;
    };
    special_features: Record<string, boolean | string>;
  };
  css_variables: Record<string, string>;
}

export interface ReportData {
  NOME_CLINICA?: string;
  LOGOTIPO_CLINICA?: string;
  DADOS_PACIENTE_DYNAMIC_BLOCK?: string;
  CORPO_DO_LAUDO?: string;
  ASSINATURA_DIGITAL_MEDICO?: string;
  NOME_MEDICO?: string;
  CRM_MEDICO?: string;
  CLINICA_SOLICITANTE?: string;
  DATA_HORA_PEDIDO?: string;
  DATA_HORA_LAUDO?: string;
  [key: string]: any;
}

export interface TenantConfig {
  clinicName: string;
  logoUrl: string;
  primaryColor: string;
  enabledThemes?: string[];
}
