import { ReportTheme } from '../../../../../types/report';

export const reportThemes: ReportTheme[] = [
  {
    id: "swiss-clinic",
    name: "The Swiss Clinic",
    description: "Minimalismo suíço com grids matemáticos e tipografia precisa",
    category: "minimalist",
    design_tokens: {
      typography: {
        heading_font: "Inter",
        body_font: "Inter",
        heading_weight: "300",
        body_weight: "400",
        base_size: "16px",
        line_height: "1.6"
      },
      colors: {
        primary: "#1a1a1a",
        secondary: "#666666",
        accent: "#0066cc",
        background: "#ffffff",
        surface: "#fafafa",
        border: "#e5e5e5"
      },
      spacing: {
        page_margin: "40px",
        section_gap: "32px",
        content_padding: "24px"
      },
      borders: {
        header_border: "1px solid #e5e5e5",
        section_divider: "1px solid #f0f0f0",
        radius: "0px"
      },
      special_features: {
        grid_system: "12-column",
        whitespace_ratio: "high",
        header_style: "clean_centered"
      }
    },
    css_variables: {
      "--report-font-heading": "'Inter', -apple-system, sans-serif",
      "--report-font-body": "'Inter', -apple-system, sans-serif",
      "--report-color-primary": "#1a1a1a",
      "--report-color-secondary": "#666666",
      "--report-spacing-section": "2rem",
      "--report-border-subtle": "1px solid rgba(0,0,0,0.08)"
    }
  },
  {
    id: "premium-medical",
    name: "Premium Medical",
    description: "Design clássico premium com serifas elegantes e tons sóbrios",
    category: "classic",
    design_tokens: {
      typography: {
        heading_font: "Playfair Display",
        body_font: "Source Serif Pro",
        heading_weight: "600",
        body_weight: "400",
        base_size: "17px",
        line_height: "1.7"
      },
      colors: {
        primary: "#1e3a5f",
        secondary: "#546e7a",
        accent: "#c5a059",
        background: "#fdfdfd",
        surface: "#f8f9fa",
        border: "#cfd8dc"
      },
      spacing: {
        page_margin: "48px",
        section_gap: "36px",
        content_padding: "32px"
      },
      borders: {
        header_border: "2px solid #1e3a5f",
        section_divider: "1px solid #e0e0e0",
        radius: "4px"
      },
      special_features: {
        watermark_style: "institution",
        footer_divider: true
      }
    },
    css_variables: {
      "--report-font-heading": "'Playfair Display', Georgia, serif",
      "--report-font-body": "'Source Serif Pro', Georgia, serif",
      "--report-color-brand": "#1e3a5f"
    }
  },
  {
    id: "echo-classic",
    name: "Echo Classic",
    description: "Layout institucional rígido com duas colunas e máxima legibilidade",
    category: "classic",
    design_tokens: {
      typography: {
        heading_font: "Roboto",
        body_font: "Roboto",
        heading_weight: "700",
        body_weight: "400",
        base_size: "15px",
        line_height: "1.5"
      },
      colors: {
        primary: "#2d3436",
        secondary: "#636e72",
        accent: "#0984e3",
        background: "#ffffff",
        surface: "#f1f2f6",
        border: "#dfe6e9"
      },
      spacing: {
        page_margin: "45px",
        section_gap: "35px",
        content_padding: "20px",
        grid_gap: "30px"
      },
      borders: {
        header_border: "none",
        section_divider: "1px solid #dfe6e9",
        radius: "4px"
      },
      layout: {
        type: "two_column",
        sidebar_width: "30%",
        main_width: "70%"
      },
      special_features: {
        institutional_lines: true,
        header_centered: true
      }
    },
    css_variables: {
      "--report-font-heading": "'Roboto', sans-serif",
      "--report-font-body": "'Roboto', sans-serif",
      "--report-color-main": "#2d3436"
    }
  }
];
