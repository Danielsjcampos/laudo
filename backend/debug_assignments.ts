import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const exams = await prisma.exam.findMany();
  console.log('--- EXAMS STATUS AND DOCTOR ---');
  exams.forEach(e => {
    if (e.externalSuggestion) {
      console.log(`ID: ${e.id}, Type: ${e.examType}, Status: ${e.status}, AssignedID: ${e.doctorAssignedId}`);
      console.log(`Suggestions: ${e.externalSuggestion}`);
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
