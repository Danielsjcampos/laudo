
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
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
            <!-- Chart.js -->
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <!-- Heroicons -->
            <script src="https://unpkg.com/feather-icons"></script>
            
            <script>
                tailwind.config = {
                    theme: {
                        extend: {
                            fontFamily: {
                                sans: ['Outfit', 'sans-serif'],
                            },
                            colors: {
                                dark: {
                                    900: '#0B0D17',
                                    800: '#15192B',
                                    700: '#1F243A',
                                },
                                brand: {
                                    400: '#38BDF8',
                                    500: '#0EA5E9',
                                    600: '#0284C7',
                                    accent: '#818CF8'
                                }
                            },
                            animation: {
                                'blob': 'blob 7s infinite',
                                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            },
                            keyframes: {
                                blob: {
                                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                                }
                            }
                        }
                    }
                }
            </script>
            <style>
                body { 
                    background-color: #0B0D17; 
                    color: #F8FAFC; 
                    overflow-x: hidden;
                }
                .glass-panel { 
                    background: rgba(21, 25, 43, 0.4); 
                    backdrop-filter: blur(20px); 
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05); 
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                .text-gradient {
                    background: linear-gradient(to right, #38BDF8, #818CF8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                /* Custom Scrollbar */
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                ::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.3); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.6); }
            </style>
        </head>
        <body class="min-h-screen relative antialiased selection:bg-brand-500/30">
            
            <!-- Animated Background Blobs -->
            <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
                <div class="absolute top-[20%] right-[-5%] w-96 h-96 bg-brand-accent/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob" style="animation-delay: 2s;"></div>
                <div class="absolute bottom-[-20%] left-[20%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob" style="animation-delay: 4s;"></div>
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
            </div>

            <div class="relative z-10 max-w-[1400px] mx-auto px-6 py-10 flex flex-col gap-8 h-full">
                
                <!-- Navbar / Header -->
                <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel px-8 py-5 rounded-[2rem]">
                    <div class="flex items-center gap-4">
                        <div class="relative flex items-center justify-center w-12 h-12 bg-dark-900 rounded-xl border border-white/10 shadow-lg">
                            <i data-feather="cpu" class="text-brand-400"></i>
                            <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-dark-900"></div>
                        </div>
                        <div>
                            <h1 class="text-2xl font-extrabold tracking-tight">Core <span class="text-gradient">Engine</span></h1>
                            <p class="text-sm text-slate-400 font-light mt-0.5">LaudoDigital API Infrastructure</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <div class="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Operational</span>
                        </div>
                        <button onclick="location.reload()" class="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors duration-200 group">
                            <i data-feather="refresh-cw" class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors"></i>
                        </button>
                    </div>
                </header>

                <!-- Core Metrics Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- CPU -->
                    <div class="glass-panel p-6 rounded-[2rem] relative overflow-hidden group">
                        <div class="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity"><i data-feather="activity" class="w-16 h-16 text-brand-400"></i></div>
                        <div class="relative z-10">
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <i data-feather="aperture" class="w-3 h-3 text-brand-400"></i> Server Load
                            </p>
                            <div class="mt-4 flex items-end gap-3">
                                <span class="text-4xl font-light tracking-tighter">${loadAvg.toFixed(2)}</span>
                                <span class="text-sm text-slate-500 mb-1 font-medium bg-dark-900/50 px-2 py-1 rounded-md">/${cpuCount} cores</span>
                            </div>
                            <div class="mt-5 h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-brand-400 to-brand-accent rounded-full" style="width: ${Math.min((loadAvg/cpuCount)*100, 100)}%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- RAM -->
                    <div class="glass-panel p-6 rounded-[2rem] relative overflow-hidden group">
                        <div class="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity"><i data-feather="hard-drive" class="w-16 h-16 text-brand-accent"></i></div>
                        <div class="relative z-10">
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <i data-feather="server" class="w-3 h-3 text-brand-accent"></i> Memory Usage
                            </p>
                            <div class="mt-4 flex items-end gap-3">
                                <span class="text-4xl font-light tracking-tighter">${memPercentage}<span class="text-2xl text-slate-500">%</span></span>
                                <span class="text-sm text-slate-500 mb-1 font-medium bg-dark-900/50 px-2 py-1 rounded-md">${(usedMem/1024/1024/1024).toFixed(1)}GB</span>
                            </div>
                            <div class="mt-5 h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-brand-accent to-pink-500 rounded-full" style="width: ${memPercentage}%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Database -->
                    <div class="glass-panel p-6 rounded-[2rem] relative overflow-hidden">
                        <div class="relative z-10 h-full flex flex-col justify-between">
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <i data-feather="database" class="w-3 h-3 text-emerald-400"></i> Database
                            </p>
                            <div class="flex items-center gap-4 mt-4">
                                <div class="relative w-14 h-14 bg-dark-900 rounded-2xl border border-white/5 flex items-center justify-center">
                                    <svg class="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5a2 2 0 0 1 0-4h14v-4H5a2 2 0 0 0-2 2Z"/></svg>
                                    <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-800 ${dbStatus === 'ONLINE' ? 'bg-emerald-400' : 'bg-red-500'}"></div>
                                </div>
                                <div>
                                    <p class="text-xl font-bold ${dbStatus === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'}">${dbStatus}</p>
                                    <p class="text-xs font-medium text-slate-500">PostgreSQL @ Neon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Uptime -->
                    <div class="glass-panel p-6 rounded-[2rem] relative overflow-hidden">
                        <div class="relative z-10 h-full flex flex-col justify-between">
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <i data-feather="clock" class="w-3 h-3 text-orange-400"></i> Uptime
                            </p>
                            <div class="mt-4 flex flex-col">
                                <span class="text-3xl font-light tracking-tight text-white/90">${uptimeStr.split(' ')[0]}</span>
                                <span class="text-sm font-medium text-slate-500">${uptimeStr.split(' ').slice(1).join(' ')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Dashboard Area -->
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    <!-- Analytics & Charts -->
                    <div class="xl:col-span-2 flex flex-col gap-6">
                        <!-- Chart Card -->
                        <div class="glass-panel p-6 md:p-8 rounded-[2rem] flex-grow flex flex-col">
                            <div class="flex justify-between items-center mb-6">
                                <div>
                                    <h2 class="text-lg font-bold">Network Traffic Real-time</h2>
                                    <p class="text-xs text-slate-400">Requests per minute (Simulated live data for visualization)</p>
                                </div>
                                <div class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium flex items-center gap-2">
                                    <span class="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow"></span> Live Sync
                                </div>
                            </div>
                            <div class="relative flex-grow w-full h-[250px]">
                                <canvas id="trafficChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- System Info & Live Logs -->
                    <div class="flex flex-col gap-6">
                        <!-- Server Info -->
                        <div class="glass-panel p-6 rounded-[2rem]">
                            <h3 class="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                <i data-feather="info" class="w-4 h-4"></i> Environment
                            </h3>
                            <ul class="space-y-4">
                                <li class="flex justify-between items-center pb-4 border-b border-white/5">
                                    <span class="text-sm text-slate-400">Platform</span>
                                    <span class="text-sm font-medium bg-dark-900 px-3 py-1 rounded-lg border border-white/5">${os.platform()}</span>
                                </li>
                                <li class="flex justify-between items-center pb-4 border-b border-white/5">
                                    <span class="text-sm text-slate-400">Architecture</span>
                                    <span class="text-sm font-medium bg-dark-900 px-3 py-1 rounded-lg border border-white/5">${os.arch()}</span>
                                </li>
                                <li class="flex justify-between items-center pb-4 border-b border-white/5">
                                    <span class="text-sm text-slate-400">Node JS</span>
                                    <span class="text-sm font-medium text-brand-400 bg-brand-400/10 px-3 py-1 rounded-lg border border-brand-400/20">${process.version}</span>
                                </li>
                                <li class="flex justify-between items-center">
                                    <span class="text-sm text-slate-400">Process ID</span>
                                    <span class="text-sm font-mono text-slate-300">${process.pid}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Mini Logs -->
                        <div class="glass-panel p-6 rounded-[2rem] flex-grow flex flex-col">
                            <h3 class="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                <i data-feather="terminal" class="w-4 h-4"></i> Recent Requests
                            </h3>
                            <div class="flex-grow overflow-hidden flex flex-col gap-3">
                                ${recentLogs.slice(0, 5).map(log => `
                                    <div class="flex items-center justify-between p-3 bg-dark-900/60 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div class="flex items-center gap-3 overflow-hidden">
                                            <span class="text-[10px] font-black px-2 py-1 rounded-md 
                                                ${log.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                                  log.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                                  'bg-orange-500/10 text-orange-400 border border-orange-500/20'}">
                                                ${log.method}
                                            </span>
                                            <span class="text-xs font-mono text-slate-300 truncate" title="${log.path}">${log.path}</span>
                                        </div>
                                        <div class="flex items-center gap-3 shrink-0">
                                            <span class="text-xs font-medium text-slate-500">${log.duration}</span>
                                            <div class="w-2 h-2 rounded-full ${log.status >= 400 ? 'bg-red-500' : 'bg-emerald-500'}"></div>
                                        </div>
                                    </div>
                                `).join('')}
                                ${recentLogs.length === 0 ? '<div class="h-full flex items-center justify-center text-sm text-slate-500 font-light italic">Waiting for traffic...</div>' : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <footer class="mt-auto pt-6 text-center pb-2 border-t border-white/5">
                    <p class="text-xs text-slate-500 font-medium">
                        LaudoDigital Core Architecture • Protected by Advanced Routing
                    </p>
                </footer>
            </div>

            <script>
                // Initialize Feather Icons
                feather.replace();

                // Initialize Chart.js
                const ctx = document.getElementById('trafficChart').getContext('2d');
                
                // Set Chart.js defaults for Dark Theme
                Chart.defaults.color = '#64748b';
                Chart.defaults.font.family = "'Outfit', sans-serif";
                
                // Generate some realistic looking initial data
                const labels = Array.from({length: 20}, (_, i) => {
                    const d = new Date();
                    d.setMinutes(d.getMinutes() - (19 - i));
                    return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                });
                
                const data = Array.from({length: 20}, () => Math.floor(Math.random() * 50) + 10);

                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');   
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

                const trafficChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Requests / min',
                            data: data,
                            borderColor: '#38BDF8',
                            backgroundColor: gradient,
                            borderWidth: 2,
                            pointBackgroundColor: '#0B0D17',
                            pointBorderColor: '#38BDF8',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: '#15192B',
                                titleColor: '#F8FAFC',
                                bodyColor: '#cbd5e1',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderWidth: 1,
                                padding: 12,
                                displayColors: false,
                                callbacks: {
                                    label: function(context) {
                                        return context.parsed.y + ' requests';
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false, drawBorder: false },
                                ticks: { maxTicksLimit: 8 }
                            },
                            y: {
                                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                                beginAtZero: true,
                                suggestedMax: 100
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                    }
                });

                // Simulate Live Data Updates
                setInterval(() => {
                    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    const newVal = Math.floor(Math.random() * 60) + 15;
                    
                    trafficChart.data.labels.push(time);
                    trafficChart.data.datasets[0].data.push(newVal);
                    
                    if (trafficChart.data.labels.length > 20) {
                        trafficChart.data.labels.shift();
                        trafficChart.data.datasets[0].data.shift();
                    }
                    
                    trafficChart.update('none'); // Update without animation for smoother flow
                }, 5000);

                // Reload page data every 30s silently (using fetch to avoid full page reload if desired, but for now simple reload)
                setTimeout(() => {
                    // Optional: fetch recent logs API route if it existed, otherwise standard reload
                    location.reload();
                }, 30000);
            </script>
        </body>
        </html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send('Erro ao carregar o monitor do Core Engine.');
    }
};
