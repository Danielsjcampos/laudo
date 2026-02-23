
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting deduplication process...');
  
  const allTemplates = await prisma.preReportTemplate.findMany({
    where: { isActive: true }
  });

  const grouped = new Map<string, any[]>();

  for (const t of allTemplates) {
    const key = `${t.title.trim().toLowerCase()}|${t.modality.trim().toLowerCase()}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(t);
  }

  let deletedCount = 0;

  for (const [key, templates] of grouped) {
    if (templates.length > 1) {
      console.log(`\nFound ${templates.length} duplicates for: ${key}`);
      
      // Sort: keep the one with most content in sections
      // @ts-ignore
      templates.sort((a, b) => {
        const contentA = JSON.stringify(a.sections).length;
        const contentB = JSON.stringify(b.sections).length;
        return contentB - contentA; // Descending
      });

      const best = templates[0];
      const others = templates.slice(1);

      for (const other of others) {
        await prisma.preReportTemplate.delete({
          where: { id: other.id }
        });
        deletedCount++;
        console.log(`  Deleted duplicate ID: ${other.id}`);
      }
    }
  }

  console.log(`\nDeduplication Finished!`);
  console.log(`Total Deleted: ${deletedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
