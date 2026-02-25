import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- EXAMS WITH SUGGESTIONS ---');
  const exams = await prisma.exam.findMany();
  exams.forEach(e => {
    if (e.externalSuggestion) {
      console.log(`Exam ID: ${e.id}`);
      console.log(`Suggestions: ${e.externalSuggestion}`);
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
