
import prisma from './lib/prisma';

async function check() {
  const exams = await prisma.exam.findMany({
    where: {
      patientName: 'Carla Ferreira'
    },
    select: {
      id: true,
      patientName: true,
      examType: true,
      accessionNumber: true,
      externalSuggestion: true
    }
  });
  console.log(JSON.stringify(exams, null, 2));
}

check().catch(console.error);
