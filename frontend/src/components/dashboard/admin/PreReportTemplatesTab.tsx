import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';
import { Button } from '../../ui/Button';

interface TemplateSection {
  label: string;
  defaultContent: string;
}

interface PreReportTemplate {
  id: string;
  title: string;
  modality: string;
  bodyRegion: string;
  complexity: number;
  sections: TemplateSection[];
  isActive: boolean;
  variants?: string[];
  targetSex?: string; // 'M' | 'F' | null
}

type ModalityFilter = 'TODOS' | 'RM' | 'TC' | 'USG' | 'RX' | 'MMG' | 'ANGIO';

const MODALITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  RM: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  TC: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  USG: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  RX: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  MMG: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  ANGIO: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const COMPLEXITY_LABELS = ['', 'Simples', 'Bilateral', 'Campos Extras', 'Oncológico'];

const DEFAULT_TEMPLATES: PreReportTemplate[] = [
  // ===== USG =====
  { id: 't001', title: 'USG Abdome Superior', modality: 'USG', bodyRegion: 'Abdome', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Estudo ultrassonográfico realizado em equipamento digital com sondas multifrequenciais.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't002', title: 'USG Abdome Total', modality: 'USG', bodyRegion: 'Abdome', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Estudo ultrassonográfico realizado em equipamento digital com sondas multifrequenciais.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't003', title: 'USG Aparelho Urinário', modality: 'USG', bodyRegion: 'Urinário', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't004', title: 'USG Articulação Coxofemoral Infantil', modality: 'USG', bodyRegion: 'Quadril', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't005', title: 'USG Bolsa Escrotal', modality: 'USG', bodyRegion: 'Genital', complexity: 1, isActive: true, targetSex: 'M', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't006', title: 'USG Bolsa Escrotal com Doppler', modality: 'USG', bodyRegion: 'Genital', complexity: 3, isActive: true, targetSex: 'M', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't007', title: 'USG Cotovelo Direito', modality: 'USG', bodyRegion: 'Cotovelo', complexity: 2, isActive: true, variants: ['USG Cotovelo Esquerdo'], sections: [{ label: 'Procedimento', defaultContent: 'Estudo ultrassonográfico realizado em equipamento digital com o uso de sondas multifrequenciais.' }, { label: 'Achados', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't008', title: 'USG Joelho Direito', modality: 'USG', bodyRegion: 'Joelho', complexity: 2, isActive: true, variants: ['USG Joelho Esquerdo'], sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't009', title: 'USG Mamas', modality: 'USG', bodyRegion: 'Mamas', complexity: 3, isActive: true, sections: [{ label: 'Informações Clínicas', defaultContent: '' }, { label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't010', title: 'USG Mão Direita', modality: 'USG', bodyRegion: 'Mão', complexity: 2, isActive: true, variants: ['USG Mão Esquerda'], sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Achados', defaultContent: '' }, { label: 'Conclusão', defaultContent: '' }] },
  { id: 't011', title: 'USG Ombro Direito', modality: 'USG', bodyRegion: 'Ombro', complexity: 2, isActive: true, variants: ['USG Ombro Esquerdo'], sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't012', title: 'USG Parede Abdominal', modality: 'USG', bodyRegion: 'Abdome', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't013', title: 'USG Partes Moles', modality: 'USG', bodyRegion: 'Partes Moles', complexity: 1, isActive: true, sections: [{ label: 'Indicação', defaultContent: '' }, { label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't014', title: 'USG Pelve Suprapúbica', modality: 'USG', bodyRegion: 'Pelve', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't015', title: 'USG Pelve Suprapúbica com Doppler', modality: 'USG', bodyRegion: 'Pelve', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't016', title: 'USG Pelve Transvaginal', modality: 'USG', bodyRegion: 'Pelve', complexity: 3, isActive: true, targetSex: 'F', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't017', title: 'USG Pelve Transvaginal com Doppler', modality: 'USG', bodyRegion: 'Pelve', complexity: 3, isActive: true, targetSex: 'F', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't018', title: 'USG Próstata Suprapúbica', modality: 'USG', bodyRegion: 'Próstata', complexity: 1, isActive: true, targetSex: 'M', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't019', title: 'USG Punho Direito', modality: 'USG', bodyRegion: 'Punho', complexity: 2, isActive: true, variants: ['USG Punho Esquerdo'], sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't020', title: 'USG Quadril', modality: 'USG', bodyRegion: 'Quadril', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't021', title: 'USG Região Inguinal Direita', modality: 'USG', bodyRegion: 'Inguinal', complexity: 2, isActive: true, variants: ['USG Região Inguinal Esquerda', 'USG Região Inguinal Bilateral'], sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't022', title: 'USG Rins e Vias Urinárias', modality: 'USG', bodyRegion: 'Renal', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't023', title: 'USG Rins/Vias Urinárias e Próstata', modality: 'USG', bodyRegion: 'Renal', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't024', title: 'USG Tireóide', modality: 'USG', bodyRegion: 'Tireóide', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't025', title: 'USG Tireóide com Doppler', modality: 'USG', bodyRegion: 'Tireóide', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't026', title: 'USG Tornozelo Direito', modality: 'USG', bodyRegion: 'Tornozelo', complexity: 2, isActive: true, variants: ['USG Tornozelo Esquerdo'], sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't027', title: 'USG Cervical', modality: 'USG', bodyRegion: 'Cervical', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },

  // ===== TC =====
  { id: 't030', title: 'TC Abdome Total', modality: 'TC', bodyRegion: 'Abdome', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Imagens obtidas em aquisição tomográficas com multidetectores.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't031', title: 'TC Abdome Total — Avaliação Oncológica (Pâncreas)', modality: 'TC', bodyRegion: 'Abdome', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Imagens obtidas em aquisição tomográficas com multidetectores antes e após uso do meio de contraste iodado endovenoso.' }, { label: 'Informações clínicas', defaultContent: 'Estadiamento de neoplasia pancreática.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't032', title: 'TC Abdome Total — Protocolo Hepatopatia Crônica', modality: 'TC', bodyRegion: 'Abdome', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Informações Clínicas', defaultContent: '' }, { label: 'Achados', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't033', title: 'TC Coluna Cervical', modality: 'TC', bodyRegion: 'Coluna', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't034', title: 'TC Coluna Lombo-Sacra', modality: 'TC', bodyRegion: 'Coluna', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't035', title: 'TC Coluna Lombar', modality: 'TC', bodyRegion: 'Coluna', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Imagens obtidas em aquisição tomográficas com multidetectores.' }, { label: 'Análise', defaultContent: '' }, { label: 'Conclusão', defaultContent: '' }] },
  { id: 't036', title: 'TC Cotovelo', modality: 'TC', bodyRegion: 'Cotovelo', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't037', title: 'TC Crânio', modality: 'TC', bodyRegion: 'Crânio', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Imagens obtidas em aquisição multidetectores sem o uso do meio de contraste iodado endovenoso.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't038', title: 'TC Crânio — Idoso', modality: 'TC', bodyRegion: 'Crânio', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't039', title: 'TC Crânio — Protocolo AVC', modality: 'TC', bodyRegion: 'Crânio', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Imagens obtidas em aquisição multidetectores.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't040', title: 'TC Joelho', modality: 'TC', bodyRegion: 'Joelho', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't041', title: 'TC Mastoides', modality: 'TC', bodyRegion: 'Mastoides', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't042', title: 'TC Ombro', modality: 'TC', bodyRegion: 'Ombro', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't043', title: 'TC Pelve Feminina', modality: 'TC', bodyRegion: 'Pelve', complexity: 3, isActive: true, targetSex: 'F', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Indicação Clínica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't044', title: 'TC Pelve Masculina (Próstata)', modality: 'TC', bodyRegion: 'Pelve', complexity: 3, isActive: true, targetSex: 'M', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't045', title: 'TC Pescoço', modality: 'TC', bodyRegion: 'Pescoço', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't046', title: 'TC Punho', modality: 'TC', bodyRegion: 'Punho', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't047', title: 'TC Bacia', modality: 'TC', bodyRegion: 'Bacia', complexity: 1, isActive: true, sections: [{ label: 'Indicação', defaultContent: '' }, { label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't048', title: 'TC Seios da Face', modality: 'TC', bodyRegion: 'Face', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't049', title: 'TC Região Sacro-Coccígea', modality: 'TC', bodyRegion: 'Sacro', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't050', title: 'TC Tórax', modality: 'TC', bodyRegion: 'Tórax', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't051', title: 'TC Tórax — Avaliação Oncológica', modality: 'TC', bodyRegion: 'Tórax', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },

  // ===== RM =====
  { id: 't060', title: 'RM Abdome Total', modality: 'RM', bodyRegion: 'Abdome', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't061', title: 'RM Antepé', modality: 'RM', bodyRegion: 'Pé', complexity: 1, isActive: true, sections: [{ label: 'Método', defaultContent: 'Estudo realizado com a técnica FE e FSE, com cortes multiplanares.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't062', title: 'RM ATM', modality: 'RM', bodyRegion: 'ATM', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't063', title: 'RM Coluna Cervical', modality: 'RM', bodyRegion: 'Coluna', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't064', title: 'RM Coluna Dorsal', modality: 'RM', bodyRegion: 'Coluna', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't065', title: 'RM Coluna Lombar', modality: 'RM', bodyRegion: 'Coluna', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Exame realizado pela técnica spin-eco com aquisições multiplanares.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't066', title: 'RM Coluna Lombar — Degenerativo (Idoso)', modality: 'RM', bodyRegion: 'Coluna', complexity: 3, isActive: true, sections: [{ label: 'Método', defaultContent: 'Exame realizado pela técnica spin-eco com aquisições multiplanares.' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't067', title: 'RM Cotovelo', modality: 'RM', bodyRegion: 'Cotovelo', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't068', title: 'RM Crânio', modality: 'RM', bodyRegion: 'Crânio', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: 'Estudo realizado com várias técnicas de modificação da magnetização...' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't069', title: 'RM Crânio — Esclerose Múltipla', modality: 'RM', bodyRegion: 'Crânio', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't070', title: 'RM Joelho', modality: 'RM', bodyRegion: 'Joelho', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't071', title: 'RM Mão/Dedos', modality: 'RM', bodyRegion: 'Mão', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't072', title: 'RM Ombro', modality: 'RM', bodyRegion: 'Ombro', complexity: 1, isActive: true, sections: [{ label: 'Indicação', defaultContent: '' }, { label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't073', title: 'RM Órbitas', modality: 'RM', bodyRegion: 'Órbitas', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't074', title: 'RM Ouvido', modality: 'RM', bodyRegion: 'Ouvido', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't075', title: 'RM Pé e Tornozelo', modality: 'RM', bodyRegion: 'Pé', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't076', title: 'RM Pelve — Avaliação Oncológica Reto', modality: 'RM', bodyRegion: 'Pelve', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Informações Clínicas', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't077', title: 'RM Pelve Oncológica (Colo Uterino/Endométrio)', modality: 'RM', bodyRegion: 'Pelve', complexity: 4, isActive: true, targetSex: 'F', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't078', title: 'RM Pelve (Endometriose)', modality: 'RM', bodyRegion: 'Pelve', complexity: 4, isActive: true, targetSex: 'F', sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't079', title: 'RM Pelve Fístula Perianal', modality: 'RM', bodyRegion: 'Pelve', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't080', title: 'RM Perna Direita', modality: 'RM', bodyRegion: 'Perna', complexity: 1, isActive: true, sections: [{ label: 'Procedimento', defaultContent: '' }, { label: 'Achados', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't081', title: 'RM Multiparamétrica Próstata', modality: 'RM', bodyRegion: 'Próstata', complexity: 4, isActive: true, targetSex: 'M', sections: [{ label: 'Informações Clínicas', defaultContent: '' }, { label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't082', title: 'RM Punho', modality: 'RM', bodyRegion: 'Punho', complexity: 1, isActive: true, sections: [{ label: 'Procedimento', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't083', title: 'RM Quadril', modality: 'RM', bodyRegion: 'Quadril', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't084', title: 'RM Sacro Ilíacas', modality: 'RM', bodyRegion: 'Sacro', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't085', title: 'RM Tórax', modality: 'RM', bodyRegion: 'Tórax', complexity: 1, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },

  // ===== RX =====
  { id: 't090', title: 'RX Coluna Lombar', modality: 'RX', bodyRegion: 'Coluna', complexity: 1, isActive: true, sections: [{ label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't091', title: 'RX Tórax', modality: 'RX', bodyRegion: 'Tórax', complexity: 1, isActive: true, sections: [{ label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },

  // ===== MMG =====
  { id: 't095', title: 'Mamografia', modality: 'MMG', bodyRegion: 'Mamas', complexity: 3, isActive: true, sections: [{ label: 'Procedimento', defaultContent: '' }, { label: 'Informações Clínicas', defaultContent: '' }, { label: 'Achados', defaultContent: '' }, { label: 'Comparação', defaultContent: '' }, { label: 'Conclusão', defaultContent: '' }] },

  // ===== ANGIO =====
  { id: 't100', title: 'Angiorressonância Arterial Cervical', modality: 'ANGIO', bodyRegion: 'Cervical', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't101', title: 'Angiorressonância Arterial do Crânio', modality: 'ANGIO', bodyRegion: 'Crânio', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't102', title: 'Angiorressonância Venosa do Crânio', modality: 'ANGIO', bodyRegion: 'Crânio', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't103', title: 'Angiotomografia das Artérias Coronárias', modality: 'ANGIO', bodyRegion: 'Coração', complexity: 4, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
  { id: 't104', title: 'Angiotomografia Computadorizada do Tórax', modality: 'ANGIO', bodyRegion: 'Tórax', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão diagnóstica', defaultContent: '' }] },
  { id: 't105', title: 'Angiotomografia Torácica e Abdominal', modality: 'ANGIO', bodyRegion: 'Tórax/Abdome', complexity: 3, isActive: true, sections: [{ label: 'Técnica', defaultContent: '' }, { label: 'Análise', defaultContent: '' }, { label: 'Impressão Diagnóstica', defaultContent: '' }] },
];

const MODALITY_FILTERS: ModalityFilter[] = ['TODOS', 'RM', 'TC', 'USG', 'RX', 'MMG', 'ANGIO'];

export const PreReportTemplatesTab: React.FC = () => {
  const [templates, setTemplates] = useState<PreReportTemplate[]>([]);
  const [filter, setFilter] = useState<ModalityFilter>('TODOS');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      addToast('Erro ao carregar templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await api.post('/templates/seed', { templates: DEFAULT_TEMPLATES });
      addToast('Templates padrões restaurados com sucesso!', 'success');
      fetchTemplates();
    } catch (error) {
      console.error('Erro ao restaurar templates:', error);
      addToast('Erro ao restaurar templates', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const filtered = useMemo(() => {
    return templates.filter(t => {
      const matchMod = filter === 'TODOS' || t.modality === filter;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.bodyRegion.toLowerCase().includes(search.toLowerCase());
      return matchMod && matchSearch;
    });
  }, [filter, search, templates]);

  const groupedByModality = useMemo(() => {
    const groups: Record<string, PreReportTemplate[]> = {};
    filtered.forEach(t => {
      if (!groups[t.modality]) groups[t.modality] = [];
      groups[t.modality].push(t);
    });
    return groups;
  }, [filtered]);

  if (loading && templates.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome ou região anatômica..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-400 focus:ring-2 focus:ring-brand-blue-100 transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {MODALITY_FILTERS.map(mod => {
            const colors = MODALITY_COLORS[mod] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
            const isActive = filter === mod;
            return (
              <button
                key={mod}
                onClick={() => setFilter(mod)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? `${colors.bg} ${colors.text} border ${colors.border} shadow-sm`
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {mod}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
        <span>{filtered.length} templates encontrados</span>
        <span>•</span>
        <span>{Object.keys(groupedByModality).length} modalidades</span>
      </div>

      {/* Template Groups */}
      {Object.entries(groupedByModality).map(([modality, templates]: [string, PreReportTemplate[]]) => {
        const colors = MODALITY_COLORS[modality] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
        return (
          <section key={modality}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-lg text-xs font-black ${colors.bg} ${colors.text}`}>
                {modality}
              </span>
              <span className="text-sm text-gray-400 font-medium">{templates.length} templates</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="space-y-2">
              {templates.map(template => {
                const isExpanded = expandedId === template.id;
                return (
                  <div
                    key={template.id}
                    className={`border rounded-xl transition-all ${
                      isExpanded ? `${colors.border} shadow-sm` : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : template.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${template.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                        <span className="font-bold text-gray-800 text-sm truncate">{template.title}</span>
                        {template.targetSex && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            template.targetSex === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                          }`}>
                            {template.targetSex === 'M' ? '♂ Masc' : '♀ Fem'}
                          </span>
                        )}
                        {template.variants && template.variants.length > 0 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full flex-shrink-0">
                            +{template.variants.length} variante{template.variants.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hidden sm:block">{template.bodyRegion}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          template.complexity <= 1 ? 'bg-gray-100 text-gray-500' :
                          template.complexity <= 2 ? 'bg-blue-50 text-blue-600' :
                          template.complexity <= 3 ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {COMPLEXITY_LABELS[template.complexity]}
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {template.sections.map((section, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1">{section.label}</p>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {section.defaultContent || <span className="italic text-gray-400">Campo editável pelo médico</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                        {template.variants && template.variants.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50/50 rounded-lg">
                            <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-1">Variantes (mesmo conteúdo, lateralidade diferente)</p>
                            <div className="flex gap-2 flex-wrap">
                              {template.variants.map((v, i) => (
                                <span key={i} className="px-2 py-1 bg-white border border-blue-200 rounded text-xs text-blue-700 font-medium">{v}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold mb-2">Nenhum template encontrado.</p>
          {templates.length === 0 ? (
            <div className="space-y-4">
              <p className="text-gray-500 text-xs">O banco de dados parece vazio.</p>
              <Button 
                onClick={handleSeed} 
                isLoading={seeding}
                className="bg-brand-blue-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg hover:bg-brand-blue-700 transition-all"
              >
                Restaurar Padrões ({DEFAULT_TEMPLATES.length})
              </Button>
            </div>
          ) : (
            <p className="text-gray-300 text-sm">Tente ajustar os filtros ou termos de busca.</p>
          )}
        </div>
      )}
    </div>
  );
};
