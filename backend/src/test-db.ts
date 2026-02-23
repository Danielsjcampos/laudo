import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    console.log('Testando conexão com o Banco de Dados...');
    try {
        const count = await prisma.user.count();
        console.log(`✅ Sucesso! Total de usuários no banco: ${count}`);
    } catch (err) {
        console.error('❌ Erro de conexão:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
