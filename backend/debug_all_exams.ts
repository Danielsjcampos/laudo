import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const exams = await prisma.exam.findMany();
  console.log('--- ALL EXAMS ---');
  exams.forEach(e => {
    console.log(`ID: ${e.id}, Type: ${e.examType}, Suggestion: ${e.externalSuggestion ? 'YES' : 'NO'}`);
    if (e.externalSuggestion) {
      console.log(`Content: ${e.externalSuggestion}`);
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
