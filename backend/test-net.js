const net = require('net');
const url = require('url');
require('dotenv').config();

try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ DATABASE_URL não definida no .env');
        process.exit(1);
    }

    const parsed = new url.URL(dbUrl);
    const host = parsed.hostname;
    const port = parsed.port || 5432;

    console.log(`Tentando conectar via TCP em ${host}:${port}...`);

    const socket = new net.Socket();
    socket.setTimeout(10000); // 10s timeout

    socket.on('connect', () => {
        console.log('✅ Conexão TCP estabelecida com sucesso! O servidor está acessível na rede.');
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.error('❌ Timeout ao tentar conectar via TCP. O Host não respondeu em 10s.');
        console.error('Possíveis causas:');
        console.error('1. Firewall bloqueando a porta 5432.');
        console.error('2. O banco de dados (Neon) está suspenso ou desligado.');
        console.error('3. Problema de conexão com a internet.');
        socket.destroy();
    });

    socket.on('error', (err) => {
        console.error('❌ Erro de conexão TCP:', err.message);
        if (err.code === 'ENOTFOUND') {
            console.error('⚠️ DNS Error: O domínio não foi encontrado. Verifique se a URL está correta.');
        }
    });

    socket.connect(port, host);
} catch (e) {
    console.error('Erro ao processar:', e.message);
}
