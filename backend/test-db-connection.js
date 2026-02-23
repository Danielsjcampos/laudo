const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function test() {
    try {
        console.log('Tentando conectar ao banco de dados com node-postgres...');
        console.log('URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')); // Esconde senha
        await client.connect();
        console.log('✅ Conexão bem sucedida com node-postgres!');
        const res = await client.query('SELECT NOW()');
        console.log('⏰ Horário do servidor:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Erro ao conectar:', err);
        console.error('Código:', err.code);
        if (err.code === 'ENOTFOUND') {
            console.error('⚠️ Host não encontrado. Verifique se o endereço do banco está correto.');
        } else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') { // Use || here
            console.error('⚠️ Conexão recusada ou timeout. Verifique firewall e status do banco.');
        } else if (err.code === '28P01') {
            console.error('⚠️ Erro de autenticação (senha incorreta).');
        }
    }
}

test();
