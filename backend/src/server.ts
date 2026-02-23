import dotenv from 'dotenv';
dotenv.config();

// @ts-nocheck
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import examRoutes from './routes/exams';
import patientRoutes from './routes/patients';
import statsRoutes from './routes/stats';
import pricingRoutes from './routes/pricing';
import financeRoutes from './routes/finance';
import commonRoutes from './routes/common';
import templatesRoutes from './routes/templates';
import clinicsRoutes from './routes/clinics';
import path from 'path';

import { getDashboard, logMiddleware } from './controllers/MonitorController';
import { getPublicExam, saveExternalSuggestion } from './controllers/examController';

const app = express();
const PORT = process.env.PORT || 3001;

// Configurações de Segurança e Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "blob:", "http://localhost:3001"],
            "frame-src": ["'self'", "http://localhost:3000", "http://127.0.0.1:3000"],
            "connect-src": ["'self'", "http://localhost:3001", "http://localhost:3000"]
        },
    },
    crossOriginEmbedderPolicy: { policy: "require-corp" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3003',
        'http://127.0.0.1:3003',
        'https://laudo.2b.app.br',
        'https://viewer.laudo.2b.app.br'
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(logMiddleware);

// Servir arquivos estáticos de uploads com headers corretos para OHIF/SharedArrayBuffer
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
    setHeaders: (res, path, stat) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.set('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
    }
}));

// Painel de Monitoramento do Core Engine
app.get('/', getDashboard);

// Rota Pública para Compartilhamento de Exames
app.get('/api/public/exams/:id', getPublicExam);
app.post('/api/public/exams/:id/suggestion', saveExternalSuggestion);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/clinics', clinicsRoutes);

// Rotas Básicas para Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'LaudoDigital Backend' });
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
