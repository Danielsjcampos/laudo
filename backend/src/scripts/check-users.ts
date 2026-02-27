import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
    const users = await p.user.findMany();
    console.log('USERS:', JSON.stringify(users, null, 2));
}
main().catch(console.error).finally(() => p.$disconnect());
