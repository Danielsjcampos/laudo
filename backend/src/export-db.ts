
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const data = {
        clinics: await prisma.clinic.findMany(),
        patients: await prisma.patient.findMany({ include: { clinic: true } }),
        users: await prisma.user.findMany(),
        exams: await prisma.exam.findMany(),
    };
    fs.writeFileSync('db-state.json', JSON.stringify(data, null, 2));
    console.log('✅ db-state.json written');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
