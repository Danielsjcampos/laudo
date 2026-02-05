
import { Request, Response } from 'express';
import os from 'os';
import prisma from '../lib/prisma';

// Memory for recent logs
const recentLogs: any[] = [];

export const logMiddleware = (req: Request, res: Response, next: any) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        recentLogs.unshift({
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        });
        if (recentLogs.length > 50) recentLogs.pop();
    });
    next();
};

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memPercentage = ((usedMem / totalMem) * 100).toFixed(1);

        const uptime = process.uptime();
        const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

        // Check DB
        let dbStatus = 'ONLINE';
        try {
            await prisma.$queryRaw`SELECT 1`;
        } catch (e) {
            dbStatus = 'OFFLINE';
        }

        const cpuCount = os.cpus().length;
        const loadAvg = os.loadavg()[0];

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Core Engine | LaudoDigital</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0c0e12; color: #e2e8f0; }
                .glass { background: rgba(23, 25, 35, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
                .status-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            </style>
        </head>
        <body class="p-4 md:p-8">
            <div class="max-w-7xl mx-auto space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center space-x-3">
                            <div class="h-3 w-3 bg-emerald-500 rounded-full status-pulse"></div>
                            <h1 class="text-2xl font-extrabold tracking-tight">Core Engine <span class="text-emerald-500">v1.2</span></h1>
                        </div>
                        <p class="text-slate-500 text-sm mt-1">Monitoramento de infraestrutura e tráfego em tempo real.</p>
                    </div>
                    <div class="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-xs font-bold">
                        <span>SYSTEM STATUS: OPERATIONAL</span>
                    </div>
                </div>

                <!-- Metrics Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="glass p-6 rounded-3xl">
                        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">CPU LOAD (1m)</p>
                        <div class="flex items-end justify-between">
                            <span class="text-3xl font-black">${loadAvg.toFixed(2)}</span>
                            <span class="text-emerald-500 text-xs font-bold mb-1">${cpuCount} Cores</span>
                        </div>
                    </div>
                    <div class="glass p-6 rounded-3xl">
                        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">RAM USAGE</p>
                        <div class="flex flex-col">
                            <div class="flex items-end justify-between mb-2">
                                <span class="text-3xl font-black">${memPercentage}%</span>
                                <span class="text-slate-400 text-xs">${(usedMem / 1024 / 1024 / 1024).toFixed(1)}GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(1)}GB</span>
                            </div>
                            <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div class="bg-indigo-500 h-full transition-all duration-1000" style="width: ${memPercentage}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="glass p-6 rounded-3xl">
                        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">DB CONNECTION</p>
                        <div class="flex items-center space-x-3">
                            <span class="text-2xl font-black ${dbStatus === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'}">${dbStatus}</span>
                            <span class="bg-white/5 px-2 py-1 rounded text-[10px] font-mono text-slate-400">Postgres@Neon</span>
                        </div>
                    </div>
                    <div class="glass p-6 rounded-3xl">
                        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">UPTIME</p>
                        <span class="text-2xl font-black">${uptimeStr}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Traffic Monitoring -->
                    <div class="lg:col-span-2 glass rounded-[2rem] overflow-hidden flex flex-col">
                        <div class="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                            <h2 class="font-extrabold text-lg">Traffic Monitor</h2>
                            <span class="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">LIVE TRAFFIC</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead class="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/[0.02]">
                                    <tr>
                                        <th class="px-8 py-4">Status</th>
                                        <th class="px-8 py-4">Method</th>
                                        <th class="px-8 py-4">Path</th>
                                        <th class="px-8 py-4">Latency</th>
                                        <th class="px-8 py-4">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/5 font-mono text-xs">
                                    ${recentLogs.map(log => `
                                        <tr class="hover:bg-white/[0.02] transition-all">
                                            <td class="px-8 py-4">
                                                <span class="${log.status >= 400 ? 'text-red-400' : 'text-emerald-400'}">${log.status}</span>
                                            </td>
                                            <td class="px-8 py-4 font-black">${log.method}</td>
                                            <td class="px-8 py-4 text-slate-400">${log.path}</td>
                                            <td class="px-8 py-4 font-bold text-indigo-400">${log.duration}</td>
                                            <td class="px-8 py-4 text-slate-500">${log.timestamp.split('T')[1].split('.')[0]}</td>
                                        </tr>
                                    `).join('')}
                                    ${recentLogs.length === 0 ? '<tr><td colspan="5" class="px-8 py-20 text-center text-slate-600 font-bold uppercase tracking-widest">Aguardando tráfego...</td></tr>' : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- System Info -->
                    <div class="glass rounded-[2rem] p-8 space-y-6">
                        <h2 class="font-extrabold text-lg mb-4">Infrastructure Details</h2>
                        
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-slate-500 font-bold uppercase">Host Platform</span>
                                <span class="text-xs font-mono">${os.platform()} (${os.release()})</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-slate-500 font-bold uppercase">Architecture</span>
                                <span class="text-xs font-mono">${os.arch()}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-slate-500 font-bold uppercase">Node Version</span>
                                <span class="text-xs font-mono">${process.version}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-slate-500 font-bold uppercase">Process ID</span>
                                <span class="text-xs font-mono">${process.pid}</span>
                            </div>
                        </div>

                        <div class="pt-6 border-t border-white/5">
                            <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Quick Actions</h3>
                            <div class="grid grid-cols-2 gap-3">
                                <button class="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black py-3 rounded-xl transition-all uppercase" onclick="location.reload()">Refresh</button>
                                <button class="bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black py-3 rounded-xl transition-all uppercase">Clear Logs</button>
                            </div>
                        </div>

                        <div class="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                            <p class="text-[10px] font-black text-indigo-400 uppercase mb-1">Engenheiro Responsável</p>
                            <p class="text-xs font-medium">Antigravity AI Assistant</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                // Auto refresh every 5s
                setTimeout(() => location.reload(), 5000);
            </script>
        </body>
        </html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send('Erro ao carregar o monitor do Core Engine.');
    }
};
