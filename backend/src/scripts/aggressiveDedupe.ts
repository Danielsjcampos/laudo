
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/tomografia computadorizada de/g, 'tc')
    .replace(/ressonância magnética de/g, 'rm')
    .replace(/radiografia de/g, 'rx')
    .replace(/ultrassonografia de/g, 'usg')
    .replace(/–/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log('Starting Aggressive Deduplication...');
  
  const allTemplates = await prisma.preReportTemplate.findMany({
    where: { isActive: true }
  });

  const seen = new Map<string, any>();
  const toDelete: string[] = [];

  // Sort by content length (descending) so we keep the most detailed ones
  allTemplates.sort((a, b) => {
    const lenA = JSON.stringify(a.sections).length + a.title.length;
    const lenB = JSON.stringify(b.sections).length + b.title.length;
    return lenB - lenA;
  });

  for (const t of allTemplates) {
    // Normalize both modality and title
    let modality = t.modality.toUpperCase();
    if (modality === 'US') modality = 'USG'; // Normalize US to USG
    
    const normTitle = normalizeTitle(t.title);
    
    // Core comparison key (Modality + Normalized Title)
    // We try to match things like "TC CRÂNIO" and "TOMOGRAFIA COMPUTADORIZADA DE CRÂNIO"
    const key = `${modality}|${normTitle}`;

    // Also check for sub-strings to catch "TC Tórax" vs "TC Tórax - Sem Contraste"
    // Actually, usually "Sem Contraste" is a variant.
    // If we have two very similar ones, we pick the first one (which is the longest due to sort).
    
    let foundDuplicate = false;
    for (const [existingKey, existingTemplate] of seen.entries()) {
        const [existingMod, existingNorm] = existingKey.split('|');
        
        if (modality === existingMod) {
            // Fuzzy match: if one normalized title starts with the other or vice versa
            if (normTitle.includes(existingNorm) || existingNorm.includes(normTitle)) {
                foundDuplicate = true;
                toDelete.push(t.id);
                console.log(`Found duplicate: "${t.title}" matched existing "${existingTemplate.title}"`);
                break;
            }
        }
    }

    if (!foundDuplicate) {
        seen.set(key, t);
    }
  }

  console.log(`\nItems to delete: ${toDelete.length}`);
  
  for (const id of toDelete) {
    await prisma.preReportTemplate.delete({ where: { id } });
  }

  console.log('Deduplication Complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
