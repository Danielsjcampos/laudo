import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- MESSAGES ---');
  const messages = await prisma.message.findMany();
  console.log(JSON.stringify(messages, null, 2));

  console.log('--- EXAMS WITH SUGGESTIONS ---');
  const exams = await prisma.exam.findMany({
    where: {
      externalSuggestion: { not: null }
    }
  });
  console.log(JSON.stringify(exams.map(e => ({ id: e.id, suggestions: e.externalSuggestion })), null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
