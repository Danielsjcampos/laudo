
// @ts-nocheck
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import examRoutes from './routes/exams';
import patientRoutes from './routes/patients';
import statsRoutes from './routes/stats';
import path from 'path';

import { getDashboard, logMiddleware } from './controllers/MonitorController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurações de Segurança e Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "blob:", "http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:3000"],
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
        },
    },
}));

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(logMiddleware);

// Servir arquivos estáticos de uploads com header CORP
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(process.cwd(), 'uploads')));

// Painel de Monitoramento do Core Engine
app.get('/', getDashboard);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/stats', statsRoutes);

// Rotas Básicas para Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'LaudoDigital Backend' });
});

// Erro Global Handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('🔥 Global Error Handler:', err);
    res.status(500).json({
        error: 'Erro interno no Core Engine',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Rota 404 Real-time Log
app.use((req, res) => {
    console.log(`❌ 404 - Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Rota ${req.originalUrl} não encontrada no Core Engine.` });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor Backend rodando na porta ${PORT}`);
    console.log(`🚀 Core Engine Dashboard: http://localhost:${PORT}`);
    console.log(`🔒 Modo de segurança: Ativo`);
});
