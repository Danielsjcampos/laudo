
export type ModalityType = 'RX' | 'TC' | 'RM' | 'USG' | 'MG' | 'OT';

export interface ExamDefinition {
  name: string;
  hasLaterality?: boolean; // Se precisa de Direita/Esquerda/Bilateral
  synonyms?: string[]; // Para busca flexível futura
}

export interface BodyRegion {
  name: string;
  exams: ExamDefinition[];
}

export type ExamCatalog = Record<ModalityType, BodyRegion[]>;

export const EXAM_CATALOG: ExamCatalog = {
  'USG': [
    {
      name: 'Abdome e Pelve',
      exams: [
        { name: 'USG Abdome Total', hasLaterality: false },
        { name: 'USG Abdome Superior', hasLaterality: false },
        { name: 'USG Parede Abdominal', hasLaterality: false },
        { name: 'USG Região Inguinal', hasLaterality: true },
        { name: 'USG Pelve Transvaginal', hasLaterality: false },
        { name: 'USG Pelve Suprapúbica', hasLaterality: false },
        { name: 'USG Rins e Vias Urinárias', hasLaterality: false },
        { name: 'USG Próstata Suprapúbica', hasLaterality: false },
        { name: 'USG Próstata Transretal', hasLaterality: false },
      ]
    },
    {
      name: 'Músculo-Esquelético',
      exams: [
        { name: 'USG Ombro', hasLaterality: true },
        { name: 'USG Cotovelo', hasLaterality: true },
        { name: 'USG Punho', hasLaterality: true },
        { name: 'USG Mão', hasLaterality: true },
        { name: 'USG Quadril', hasLaterality: true },
        { name: 'USG Joelho', hasLaterality: true },
        { name: 'USG Tornozelo', hasLaterality: true },
        { name: 'USG Pé', hasLaterality: true },
        { name: 'USG Articulação Escaleno-Clavicular', hasLaterality: true },
        { name: 'USG Esternoclavicular', hasLaterality: true },
        { name: 'USG Tendão de Aquiles', hasLaterality: true },
        { name: 'USG Músculo Adutor', hasLaterality: true },
        { name: 'USG Coxa', hasLaterality: true },
        { name: 'USG Perna', hasLaterality: true },
      ]
    },
    {
      name: 'Pequenas Partes',
      exams: [
        { name: 'USG Tireóide', hasLaterality: false },
        { name: 'USG Cervical', hasLaterality: false },
        { name: 'USG Glândulas Salivares', hasLaterality: false },
        { name: 'USG Bolsa Escrotal', hasLaterality: false },
        { name: 'USG Mamas', hasLaterality: false },
        { name: 'USG Axilas', hasLaterality: true },
        { name: 'USG Partes Moles', hasLaterality: false },
        { name: 'USG Olho / Órbita', hasLaterality: true },
        { name: 'USG Escrotal com Doppler', hasLaterality: false },
      ]
    },
    {
      name: 'Vascular (Doppler)',
      exams: [
        { name: 'Doppler Carótidas e Vertebrais', hasLaterality: false },
        { name: 'Doppler Venoso de Membro Inferior', hasLaterality: true },
        { name: 'Doppler Arterial de Membro Inferior', hasLaterality: true },
        { name: 'Doppler Venoso de Membro Superior', hasLaterality: true },
        { name: 'Doppler Arterial de Membro Superior', hasLaterality: true },
        { name: 'Doppler de Aorta e Ilíacas', hasLaterality: false },
        { name: 'Doppler de Artérias Renais', hasLaterality: false },
        { name: 'Doppler Transcraniano', hasLaterality: false },
        { name: 'Doppler Hepático', hasLaterality: false },
      ]
    },
    {
        name: 'Obstétrico',
        exams: [
            { name: 'USG Obstétrico Inicial', hasLaterality: false },
            { name: 'USG Obstétrico Morfológico 1º Trimestre', hasLaterality: false },
            { name: 'USG Obstétrico Morfológico 2º Trimestre', hasLaterality: false },
            { name: 'USG Obstétrico com Doppler', hasLaterality: false },
            { name: 'USG Perfil Biofísico Fetal', hasLaterality: false },
        ]
    }
  ],
  'RX': [
    {
      name: 'Crânio e Face',
      exams: [
        { name: 'RX Crânio (PA/Lateral)', hasLaterality: false },
        { name: 'RX Seios da Face', hasLaterality: false },
        { name: 'RX Cavum', hasLaterality: false },
        { name: 'RX Ossos Nasais', hasLaterality: false },
        { name: 'RX Órbitas', hasLaterality: false },
        { name: 'RX Mandíbula', hasLaterality: false },
        { name: 'RX Articulação Temporomandibular (ATM)', hasLaterality: false },
      ]
    },
    {
      name: 'Coluna',
      exams: [
        { name: 'RX Coluna Cervical', hasLaterality: false },
        { name: 'RX Coluna Dorsal', hasLaterality: false },
        { name: 'RX Coluna Lombar', hasLaterality: false },
        { name: 'RX Sacro-Coccígea', hasLaterality: false },
        { name: 'RX Coluna Provas Dinâmicas', hasLaterality: false },
        { name: 'RX Panorâmica de Coluna (Espinografia)', hasLaterality: false },
      ]
    },
    {
      name: 'Membros Superiores',
      exams: [
        { name: 'RX Ombro', hasLaterality: true },
        { name: 'RX Clavícula', hasLaterality: true },
        { name: 'RX Escápula', hasLaterality: true },
        { name: 'RX Braço', hasLaterality: true },
        { name: 'RX Cotovelo', hasLaterality: true },
        { name: 'RX Antebraço', hasLaterality: true },
        { name: 'RX Punho', hasLaterality: true },
        { name: 'RX Mão', hasLaterality: true },
        { name: 'RX Dedos da Mão', hasLaterality: true },
        { name: 'RX Escafóide', hasLaterality: true },
        { name: 'RX Idade Óssea (Mão e Punho)', hasLaterality: false },
      ]
    },
    {
      name: 'Membros Inferiores',
      exams: [
        { name: 'RX Bacia', hasLaterality: false },
        { name: 'RX Quadril', hasLaterality: true },
        { name: 'RX Coxa (Fêmur)', hasLaterality: true },
        { name: 'RX Joelho', hasLaterality: true },
        { name: 'RX Perna (Tíbia/Fíbula)', hasLaterality: true },
        { name: 'RX Tornozelo', hasLaterality: true },
        { name: 'RX Pé', hasLaterality: true },
        { name: 'RX Calcanêo', hasLaterality: true },
        { name: 'RX Dedos do Pé', hasLaterality: true },
        { name: 'RX Escanometria de Membros Inferiores', hasLaterality: false },
      ]
    },
    {
      name: 'Tórax',
      exams: [
        { name: 'RX Tórax (PA/Lateral)', hasLaterality: false },
        { name: 'RX Arcos Costais', hasLaterality: true },
        { name: 'RX Esterno', hasLaterality: false },
        { name: 'RX Coração e Vasos da Base', hasLaterality: false },
      ]
    }
  ],
  'TC': [
    {
      name: 'Crânio e Pescoço',
      exams: [
        { name: 'TC Crânio', hasLaterality: false },
        { name: 'TC Mastoides / Ouvidos', hasLaterality: false },
        { name: 'TC Orbitas', hasLaterality: false },
        { name: 'TC Seios da Face / Face', hasLaterality: false },
        { name: 'TC Pescoço / Cervical', hasLaterality: false },
        { name: 'Angio-TC de Crânio', hasLaterality: false },
        { name: 'Angio-TC de Pescoço', hasLaterality: false },
      ]
    },
    {
      name: 'Coluna',
      exams: [
        { name: 'TC Coluna Cervical', hasLaterality: false },
        { name: 'TC Coluna Dorsal', hasLaterality: false },
        { name: 'TC Coluna Lombar', hasLaterality: false },
        { name: 'TC Sacro-Ilíacas', hasLaterality: false },
      ]
    },
    {
      name: 'Tórax e Abdome',
      exams: [
        { name: 'TC Tórax', hasLaterality: false },
        { name: 'TC Tórax de Alta Resolução', hasLaterality: false },
        { name: 'TC Abdome Total', hasLaterality: false },
        { name: 'TC Abdome Superior', hasLaterality: false },
        { name: 'TC Pelve', hasLaterality: false },
        { name: 'TC Vias Urinárias (Urotomografia)', hasLaterality: false },
        { name: 'Angio-TC de Aorta Torácica', hasLaterality: false },
        { name: 'Angio-TC de Aorta Abdominal', hasLaterality: false },
      ]
    },
    {
      name: 'Músculo-Esquelético',
      exams: [
        { name: 'TC Ombro', hasLaterality: true },
        { name: 'TC Braço', hasLaterality: true },
        { name: 'TC Cotovelo', hasLaterality: true },
        { name: 'TC Punho', hasLaterality: true },
        { name: 'TC Mão', hasLaterality: true },
        { name: 'TC Bacia', hasLaterality: false },
        { name: 'TC Quadril', hasLaterality: true },
        { name: 'TC Coxa', hasLaterality: true },
        { name: 'TC Joelho', hasLaterality: true },
        { name: 'TC Perna', hasLaterality: true },
        { name: 'TC Tornozelo', hasLaterality: true },
        { name: 'TC Pé', hasLaterality: true },
      ]
    }
  ],
  'RM': [
     {
      name: 'Crânio e Neuro',
      exams: [
        { name: 'RM Crânio / Encéfalo', hasLaterality: false },
        { name: 'RM Sela Turcica / Hipófise', hasLaterality: false },
        { name: 'RM Orbitas', hasLaterality: false },
        { name: 'RM Ouvidos / Mastoides / Condutos', hasLaterality: false },
        { name: 'RM Pescoço / Cervical', hasLaterality: false },
        { name: 'RM Base do Crânio', hasLaterality: false },
        { name: 'Angio-RM Arterial Crânio', hasLaterality: false },
        { name: 'Angio-RM Venosa Crânio', hasLaterality: false },
        { name: 'RM Plexo Braquial', hasLaterality: true },
      ]
    },
    {
      name: 'Coluna',
      exams: [
        { name: 'RM Coluna Cervical', hasLaterality: false },
        { name: 'RM Coluna Dorsal', hasLaterality: false },
        { name: 'RM Coluna Lombar', hasLaterality: false },
        { name: 'RM Sacro-Ilíacas', hasLaterality: false },
        { name: 'RM Sacro-Coccígea', hasLaterality: false },
      ]
    },
    {
        name: 'Abdome e Pelve',
        exams: [
            { name: 'RM Abdome Superior', hasLaterality: false },
            { name: 'RM Pelve', hasLaterality: false },
            { name: 'RM Multiparamétrica de Próstata', hasLaterality: false },
            { name: 'Colangio-Ressonância', hasLaterality: false },
            { name: 'RM Fetal', hasLaterality: false },
            { name: 'RM Pelve Feminina (Endometriose)', hasLaterality: false },
        ]
    },
    {
      name: 'Músculo-Esquelético',
      exams: [
        { name: 'RM Ombro', hasLaterality: true },
        { name: 'RM Cotovelo', hasLaterality: true },
        { name: 'RM Punho', hasLaterality: true },
        { name: 'RM Mão', hasLaterality: true },
        { name: 'RM Quadril', hasLaterality: true },
        { name: 'RM Coxa', hasLaterality: true },
        { name: 'RM Joelho', hasLaterality: true },
        { name: 'RM Perna', hasLaterality: true },
        { name: 'RM Tornozelo', hasLaterality: true },
        { name: 'RM Pé / Antepé', hasLaterality: true },
        { name: 'RM Esternoclavicular', hasLaterality: true },
      ]
    }
  ],
  'MG': [
      {
          name: 'Mama',
          exams: [
              { name: 'Mamografia Digital', hasLaterality: true },
              { name: 'Mamografia com Tomossíntese', hasLaterality: true },
          ]
      }
  ],
  'OT': [
      {
          name: 'Outros',
          exams: [
              { name: 'Densitometria Óssea (Fêmur e Coluna)', hasLaterality: false },
              { name: 'Densitometria Óssea (Corpo Inteiro)', hasLaterality: false },
              { name: 'Medicina Nuclear (Cintilografia)', hasLaterality: false },
              { name: 'PET-CT', hasLaterality: false },
          ]
      }
  ]
};
