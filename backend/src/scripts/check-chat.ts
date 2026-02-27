import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
    const messages = await p.message.findMany();
    const doctors = await p.doctor.findMany();
    const clinics = await p.clinic.findMany();
    console.log('MESSAGES:', JSON.stringify(messages, null, 2));
    console.log('DOCTORS:', JSON.stringify(doctors.map(d => ({id: d.id, name: d.name})), null, 2));
    console.log('CLINICS:', JSON.stringify(clinics.map(c => ({id: c.id, name: c.name, email: c.adminEmail})), null, 2));
}
main().catch(console.error).finally(() => p.$disconnect());
