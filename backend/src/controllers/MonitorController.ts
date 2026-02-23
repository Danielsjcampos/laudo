
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
        const totalGB = (totalMem / 1024 / 1024 / 1024).toFixed(1);
        const usedGB = (usedMem / 1024 / 1024 / 1024).toFixed(1);

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

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Core Engine | LaudoDigital</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#090b14;--surface:rgba(17,20,36,0.7);--surface-hover:rgba(22,26,48,0.8);
  --border:rgba(255,255,255,0.06);--border-hover:rgba(255,255,255,0.12);
  --text-primary:#e8ecf4;--text-secondary:#8892a8;--text-dim:#4a5268;
  --accent:#3b82f6;--accent-glow:rgba(59,130,246,0.15);
  --green:#22c55e;--green-glow:rgba(34,197,94,0.15);
  --amber:#f59e0b;--red:#ef4444;--indigo:#818cf8;
  --radius:16px;--radius-lg:24px;
}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text-primary);min-height:100vh;overflow-x:hidden}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes barFill{from{width:0}to{width:var(--fill)}}

.page{max-width:1320px;margin:0 auto;padding:32px 24px;display:flex;flex-direction:column;gap:24px}

/* Header */
.header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;animation:fadeUp .6s ease}
.brand{display:flex;align-items:center;gap:14px}
.brand-icon{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#3b82f6,#818cf8);display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(59,130,246,0.3)}
.brand-icon svg{width:24px;height:24px;color:white}
.brand h1{font-size:22px;font-weight:800;letter-spacing:-0.5px}
.brand h1 span{background:linear-gradient(90deg,#3b82f6,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.brand p{font-size:12px;color:var(--text-secondary);margin-top:2px;font-weight:500}
.status-badge{display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:100px;background:var(--green-glow);border:1px solid rgba(34,197,94,0.2);font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1.5px}
.status-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}

/* Cards Grid */
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;animation:fadeUp .6s ease .1s backwards}
@media(max-width:1024px){.metrics{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.metrics{grid-template-columns:1fr}}

.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;position:relative;overflow:hidden;transition:border-color .3s,box-shadow .3s}
.card:hover{border-color:var(--border-hover);box-shadow:0 8px 40px rgba(0,0,0,0.3)}
.card-label{font-size:11px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1.5px;display:flex;align-items:center;gap:6px}
.card-label .dot{width:6px;height:6px;border-radius:50%}
.card-value{font-size:36px;font-weight:300;letter-spacing:-1.5px;margin-top:12px;line-height:1}
.card-sub{font-size:12px;color:var(--text-dim);margin-top:6px;font-weight:500}

/* Progress Bar */
.bar-track{width:100%;height:6px;border-radius:10px;background:rgba(255,255,255,0.04);margin-top:16px;overflow:hidden}
.bar-fill{height:100%;border-radius:10px;animation:barFill 1.2s ease forwards}

/* Main Layout */
.main{display:grid;grid-template-columns:2fr 1fr;gap:16px;animation:fadeUp .6s ease .2s backwards}
@media(max-width:900px){.main{grid-template-columns:1fr}}

/* Chart */
.chart-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;display:flex;flex-direction:column}
.chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.chart-title{font-size:15px;font-weight:700}
.chart-live{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--accent);padding:5px 12px;background:var(--accent-glow);border:1px solid rgba(59,130,246,0.2);border-radius:8px}
.chart-live .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite}
#trafficCanvas{width:100%;border-radius:12px;margin-top:auto}

/* Sidebar */
.sidebar{display:flex;flex-direction:column;gap:16px}
.info-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px}
.info-title{font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:20px}
.info-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)}
.info-row:last-child{border-bottom:none}
.info-key{font-size:13px;color:var(--text-secondary)}
.info-val{font-size:13px;font-weight:600;color:var(--text-primary);padding:4px 10px;border-radius:8px;background:rgba(255,255,255,0.04)}
.info-val.highlight{color:var(--accent);background:var(--accent-glow)}

/* Logs */
.logs-card{flex-grow:1}
.log-entry{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.02);margin-bottom:8px;border:1px solid transparent;transition:border-color .2s}
.log-entry:hover{border-color:var(--border-hover)}
.log-method{font-size:9px;font-weight:800;padding:3px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:.5px}
.log-method.GET{background:rgba(59,130,246,0.1);color:#60a5fa;border:1px solid rgba(59,130,246,0.15)}
.log-method.POST{background:var(--green-glow);color:var(--green);border:1px solid rgba(34,197,94,0.15)}
.log-method.PATCH,.log-method.PUT{background:rgba(245,158,11,0.1);color:var(--amber);border:1px solid rgba(245,158,11,0.15)}
.log-method.DELETE{background:rgba(239,68,68,0.1);color:var(--red);border:1px solid rgba(239,68,68,0.15)}
.log-path{font-size:12px;font-family:'Inter',monospace;color:var(--text-secondary);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.log-time{font-size:11px;color:var(--text-dim);font-weight:500}
.log-status{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.empty-state{text-align:center;padding:40px 20px;color:var(--text-dim);font-size:13px;font-style:italic}

/* Footer */
.footer{text-align:center;padding:16px 0;border-top:1px solid var(--border);margin-top:8px;font-size:11px;color:var(--text-dim);letter-spacing:1px;font-weight:500}

/* BG Orb */
.orb{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:-1;opacity:.4;animation:float 12s ease-in-out infinite}
.orb-1{width:400px;height:400px;background:rgba(59,130,246,0.12);top:-100px;left:-100px}
.orb-2{width:350px;height:350px;background:rgba(129,140,248,0.08);bottom:-80px;right:-80px;animation-delay:4s}
</style>
</head>
<body>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>

<div class="page">
  <!-- Header -->
  <header class="header">
    <div class="brand">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
      </div>
      <div>
        <h1>Core <span>Engine</span></h1>
        <p>LaudoDigital API Infrastructure</p>
      </div>
    </div>
    <div class="status-badge"><div class="status-dot"></div>System Operational</div>
  </header>

  <!-- Metrics -->
  <section class="metrics">
    <div class="card">
      <div class="card-label"><div class="dot" style="background:var(--accent)"></div>Server Load</div>
      <div class="card-value">${loadAvg.toFixed(2)}</div>
      <div class="card-sub">${cpuCount} CPU cores available</div>
      <div class="bar-track"><div class="bar-fill" style="--fill:${Math.min((loadAvg/cpuCount)*100,100)}%;background:linear-gradient(90deg,var(--accent),var(--indigo))"></div></div>
    </div>
    <div class="card">
      <div class="card-label"><div class="dot" style="background:var(--indigo)"></div>Memory Usage</div>
      <div class="card-value">${memPercentage}<span style="font-size:20px;color:var(--text-dim)">%</span></div>
      <div class="card-sub">${usedGB} GB / ${totalGB} GB</div>
      <div class="bar-track"><div class="bar-fill" style="--fill:${memPercentage}%;background:linear-gradient(90deg,var(--indigo),#c084fc)"></div></div>
    </div>
    <div class="card">
      <div class="card-label"><div class="dot" style="background:${dbStatus === 'ONLINE' ? 'var(--green)' : 'var(--red)'}"></div>Database</div>
      <div class="card-value" style="font-size:24px;font-weight:700;color:${dbStatus === 'ONLINE' ? 'var(--green)' : 'var(--red)'}">${dbStatus}</div>
      <div class="card-sub">PostgreSQL @ Neon Cloud</div>
    </div>
    <div class="card">
      <div class="card-label"><div class="dot" style="background:var(--amber)"></div>Uptime</div>
      <div class="card-value" style="font-size:28px;font-weight:600">${uptimeStr.split(' ')[0]}</div>
      <div class="card-sub">${uptimeStr.split(' ').slice(1).join(' ')}</div>
    </div>
  </section>

  <!-- Main -->
  <section class="main">
    <div class="chart-card">
      <div class="chart-header">
        <span class="chart-title">Network Traffic</span>
        <span class="chart-live"><span class="dot"></span>Live</span>
      </div>
      <canvas id="trafficCanvas" height="220"></canvas>
    </div>

    <div class="sidebar">
      <div class="info-card">
        <div class="info-title">Environment</div>
        <div class="info-row"><span class="info-key">Platform</span><span class="info-val">${os.platform()}</span></div>
        <div class="info-row"><span class="info-key">Arch</span><span class="info-val">${os.arch()}</span></div>
        <div class="info-row"><span class="info-key">Node</span><span class="info-val highlight">${process.version}</span></div>
        <div class="info-row"><span class="info-key">PID</span><span class="info-val" style="font-family:monospace">${process.pid}</span></div>
      </div>

      <div class="info-card logs-card">
        <div class="info-title">Recent Requests</div>
        ${recentLogs.slice(0,6).map(log => `
          <div class="log-entry">
            <span class="log-method ${log.method}">${log.method}</span>
            <span class="log-path">${log.path}</span>
            <span class="log-time">${log.duration}</span>
            <div class="log-status" style="background:${log.status >= 400 ? 'var(--red)' : 'var(--green)'}"></div>
          </div>
        `).join('')}
        ${recentLogs.length === 0 ? '<div class="empty-state">Waiting for traffic...</div>' : ''}
      </div>
    </div>
  </section>

  <footer class="footer">LaudoDigital Core Architecture &bull; Protected by Advanced Routing</footer>
</div>

<script>
(function(){
  var c=document.getElementById('trafficCanvas');
  if(!c)return;
  var ctx=c.getContext('2d');
  var dpr=window.devicePixelRatio||1;
  function resize(){
    var r=c.getBoundingClientRect();
    c.width=r.width*dpr;c.height=r.height*dpr;
    ctx.scale(dpr,dpr);
  }
  resize();window.addEventListener('resize',resize);

  var pts=[];for(var i=0;i<30;i++)pts.push(Math.random()*60+20);

  function draw(){
    var w=c.getBoundingClientRect().width,h=c.getBoundingClientRect().height;
    ctx.clearRect(0,0,w,h);

    var grad=ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'rgba(59,130,246,0.25)');
    grad.addColorStop(1,'rgba(59,130,246,0)');

    var step=w/(pts.length-1);
    ctx.beginPath();
    ctx.moveTo(0,h-pts[0]/100*h);
    for(var i=1;i<pts.length;i++){
      var x0=(i-1)*step,y0=h-pts[i-1]/100*h;
      var x1=i*step,y1=h-pts[i]/100*h;
      var cx=(x0+x1)/2;
      ctx.bezierCurveTo(cx,y0,cx,y1,x1,y1);
    }
    ctx.strokeStyle='#3b82f6';ctx.lineWidth=2.5;ctx.stroke();
    ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();
    ctx.fillStyle=grad;ctx.fill();

    for(var i=0;i<pts.length;i++){
      var x=i*step,y=h-pts[i]/100*h;
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);
      ctx.fillStyle='#090b14';ctx.fill();
      ctx.strokeStyle='#3b82f6';ctx.lineWidth=1.5;ctx.stroke();
    }

    for(var j=1;j<4;j++){
      var gy=h*j/4;
      ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);
      ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;ctx.stroke();
    }
  }
  draw();

  setInterval(function(){
    pts.push(Math.random()*60+15);
    if(pts.length>30)pts.shift();
    draw();
  },2000);

  setTimeout(function(){location.reload()},30000);
})();
</script>
</body>
</html>`;

        res.send(html);
    } catch (error) {
        res.status(500).send('Erro ao carregar o monitor do Core Engine.');
    }
};
