import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const doctors = await prisma.doctor.findMany();
  
  console.log('--- USERS ---');
  console.log(users.map(u => ({ email: u.email, name: u.name })));
  
  console.log('--- DOCTORS ---');
  console.log(doctors.map(d => ({ id: d.id, name: d.name })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
