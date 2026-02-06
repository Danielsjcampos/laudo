
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Inspecionando Banco de Dados...');

    const clinics = await prisma.clinic.findMany();
    console.log('\n🏥 Clínicas cadastradas:', clinics.length);
    clinics.forEach(c => console.log(`- ${c.name} (ID: ${c.id}, Email: ${c.adminEmail})`));

    const patients = await prisma.patient.findMany({ include: { clinic: true } });
    console.log('\n👥 Pacientes cadastrados:', patients.length);
    patients.forEach(p => {
        console.log(`- ${p.name} (ID: ${p.id}, CPF: ${p.cpf}, Clínica: ${p.clinic?.name || 'SEM CLÍNICA!'})`);
    });

    const users = await prisma.user.findMany();
    console.log('\n🔐 Usuários cadastrados:', users.length);
    users.forEach(u => console.log(`- ${u.name} (Email: ${u.email}, Role: ${u.role})`));

    console.log('\n✅ Fim da inspeção.');
}

main()
    .catch(e => {
        console.error('❌ Erro na inspeção:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
