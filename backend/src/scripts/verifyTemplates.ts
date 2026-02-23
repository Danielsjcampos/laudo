
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.preReportTemplate.count();
  console.log(`Total templates in DB: ${count}`);

  const templates = await prisma.preReportTemplate.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  console.log('Last 5 imported templates:');
  for (const t of templates) {
    console.log(`- [${t.modality}] ${t.title} (${t.bodyRegion})`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log(`  Sections: ${(t.sections as any[]).map((s: any) => s.label).join(', ')}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
