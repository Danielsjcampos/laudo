
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Paths to the template files
const TEMPLATES_DIR = path.resolve(__dirname, '../../../Templates');
const FILES = [
  'templates_rx.txt',
  'templates_tc_rm_mg_ot.txt',
  'templates_usg.txt'
];

interface TemplateData {
  title: string;
  modality: string;
  bodyRegion: string;
  sections: { label: string; defaultContent: string }[];
}

function parseUsingRegex(content: string, filename: string): TemplateData[] {
  const templates: TemplateData[] = [];
  
  // Split by dashboard separator
  const rawTemplates = content.split(/^---$/gm);

  for (const raw of rawTemplates) {
    if (!raw.trim()) continue;

    // Try to extract metadata from the header line (e.g., ## 2.1.1 RX – Crânio)
    // Regex explanation:
    // ## \s*              -> Matches "## "
    // ([\d\.]+)           -> Matches "2.1.1" (id) - OPTIONAL
    // \s*                 -> Matches space
    // ([A-Za-z]+)         -> Matches "RX" (modality)
    // \s*[–-]\s*          -> Matches " – " or " - "
    // (.*)                -> Matches "Crânio" (rest of line)
    
    // Note: Some files might have slightly different headers, we need to be robust.
    const headerMatch = raw.match(/##\s*([\d\.]+\s+)?([A-Za-z]+)\s*[–-]\s*(.*)/);
    
    let modality = 'OT';
    let bodyRegion = 'Geral';
    
    if (headerMatch) {
        modality = headerMatch[2].trim().toUpperCase(); // e.g., RX, TC
        const rest = headerMatch[3].trim(); 
        // Sometimes the rest contains specific side or detailed region, e.g. "Ombro – DIREITO"
        // We can capture the first part as region.
        bodyRegion = rest.split(/[–-]/)[0].trim();
    } else {
        // Fallback for file-based modality assumption
        if (filename.includes('rx')) modality = 'RX';
        else if (filename.includes('usg')) modality = 'US';
        else if (filename.includes('tc')) modality = 'TC'; // Default to TC for combo file if parsing fails
    }

    // Map common modalities to ENUM values if needed
    const modalityMap: Record<string, string> = {
        'RX': 'RX',
        'TC': 'TC',
        'RM': 'RM',
        'US': 'US',
        'USG': 'US',
        'MG': 'MG',
        'OT': 'OT'
    };
    modality = modalityMap[modality] || modality;


    // Extract Sections
    const titleMatch = raw.match(/\*\*Título\*\*\s*([\s\S]*?)(?=\*\*|$)/);
    const methodMatch = raw.match(/\*\*Método\*\*\s*([\s\S]*?)(?=\*\*|$)/);
    const findingsMatch = raw.match(/\*\*Achados\*\*\s*([\s\S]*?)(?=\*\*|$)/);
    const conclusionMatch = raw.match(/\*\*Conclusão\*\*\s*([\s\S]*?)(?=\*\*|$)/);

    const title = titleMatch ? titleMatch[1].trim() : 'Sem Título';
    const method = methodMatch ? methodMatch[1].trim() : '';
    const findings = findingsMatch ? findingsMatch[1].trim() : '';
    const conclusion = conclusionMatch ? conclusionMatch[1].trim() : '';

    if (title === 'Sem Título' && !method && !findings) {
        continue; // Skip empty/malformed blocks
    }

    const sections = [
        { label: 'Método', defaultContent: method },
        { label: 'Achados', defaultContent: findings },
        { label: 'Conclusão', defaultContent: conclusion }
    ];

    templates.push({
        title,
        modality,
        bodyRegion,
        sections
    });
  }

  return templates;
}

async function main() {
  console.log(`Searching for templates in: ${TEMPLATES_DIR}`);
  
  if (!fs.existsSync(TEMPLATES_DIR)) {
      console.error('Templates directory not found!');
      return;
  }

  let totalImported = 0;
  let totalSkipped = 0;

  for (const file of FILES) {
      const filePath = path.join(TEMPLATES_DIR, file);
      if (!fs.existsSync(filePath)) {
          console.warn(`File not found: ${file}`);
          continue;
      }

      console.log(`Processing ${file}...`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const templates = parseUsingRegex(content, file);

      for (const t of templates) {
          // Check for existing template to avoid duplicates
          const exists = await prisma.preReportTemplate.findFirst({
              where: {
                  title: t.title,
                  modality: t.modality
              }
          });

          if (exists) {
              totalSkipped++;
              // console.log(`Skipping duplicate: ${t.title}`);
          } else {
              await prisma.preReportTemplate.create({
                  data: {
                      title: t.title,
                      modality: t.modality,
                      bodyRegion: t.bodyRegion,
                      complexity: 1, // Default
                      sections: t.sections,
                      isActive: true
                  }
              });
              totalImported++;
              // console.log(`Imported: ${t.title}`);
          }
      }
  }

  console.log(`\nImport Finished!`);
  console.log(`Total Imported: ${totalImported}`);
  console.log(`Total Skipped: ${totalSkipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
