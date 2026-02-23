
import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import api from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';

interface DashboardData {
    kpi: {
        totalTransacted: number;
        platformNetRevenue: number;
        platformGrossRevenue: number;
        devRevenue: number;
        doctorPayouts: number;
    };
    charts: {
        monthlyData: any[];
        clinicPerformance: any[];
        doctorPerformance: any[];
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SystemFinancialPage: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const response = await api.get('/finance/dashboard');
                setData(response.data);
            } catch (error) {
                console.error(error);
                addToast('Erro ao carregar dados financeiros', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center animate-pulse text-gray-400 font-mono uppercase tracking-widest">Carregando Financial Core...</div>;
    }

    if (!data) return null;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-xl">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">{label}</p>
              {payload.map((entry: any, index: number) => (
                  <p key={index} className="text-sm font-bold text-white">
                    {entry.name}: <span className="font-mono text-brand-blue-400">R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </p>
              ))}
            </div>
          );
        }
        return null;
      };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h1 className="page-header">Financial Intelligence</h1>
                    <div className="page-header-line" />
                    <p className="text-sm mt-3 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Real-time Marketplace Analytics & Yield Engine
                    </p>
                </div>
                <div className="flex space-x-3">
                     <Button className="bg-gray-900 text-white rounded-none px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                        Export_Report.csv
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Transacted */}
                <div className="panel-card p-6 group hover:-translate-y-1 transition-transform duration-300">
                    <p className="kpi-label mb-2 group-hover:text-brand-blue-600 transition-colors">Total Transacionado</p>
                    <p className="kpi-value">
                        R$ {data.kpi.totalTransacted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="w-12 h-1 mt-4 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--surface-bg)' }}>
                        <div className="h-full w-full animate-progress" style={{ backgroundColor: 'var(--blue-500)' }}></div>
                    </div>
                </div>

                {/* Platform Revenue */}
                <div className="panel-dark p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white pointer-events-none italic">NET</div>
                    <p className="kpi-label mb-2" style={{ color: 'var(--blue-400)' }}>Receita Plataforma (Net)</p>
                    <p className="text-3xl font-black text-white tracking-tight">
                        R$ {data.kpi.platformNetRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] mt-2 font-mono" style={{ color: 'var(--text-on-dark-muted)' }}>
                        Gross: R$ {data.kpi.platformGrossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                 {/* Doctor Payouts */}
                 <div className="panel-card p-6 border-t-4 group hover:-translate-y-1 transition-transform duration-300" style={{ borderTopColor: 'var(--teal-500)' }}>
                    <p className="kpi-label mb-2 group-hover:text-teal-600 transition-colors">Repasse Médicos</p>
                    <p className="kpi-value text-gray-900">
                        R$ {data.kpi.doctorPayouts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="kpi-label mt-2" style={{ color: 'var(--status-warning)' }}>
                        PENDENTE PROCESSAMENTO
                    </p>
                </div>

                 {/* Dev Commission */}
                 <div className="panel-card p-6 border-t-4 group hover:-translate-y-1 transition-transform duration-300" style={{ borderTopColor: 'var(--blue-400)' }}>
                    <p className="kpi-label mb-2 group-hover:text-blue-600 transition-colors">Comissão Devs</p>
                    <p className="kpi-value">
                        R$ {data.kpi.devRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                         <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-success)' }}></div>
                         <p className="kpi-label">WALLET CONNECTED</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Trend */}
                <div className="panel-card p-8 relative">
                     <h3 className="section-title mb-8">Fluxo de Receita Global</h3>
                     <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts.monthlyData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--navy-800)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--navy-800)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPlat" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--blue-500)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--blue-500)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-muted)'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-muted)'}} tickFormatter={(value) => `R$${value/1000}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="total" name="Total Transacionado" stroke="var(--navy-800)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                <Area type="monotone" dataKey="platform" name="Receita Plataforma" stroke="var(--blue-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorPlat)" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                </div>

                {/* Distribution Pie */}
                <div className="panel-dark p-8 shadow-lg relative overflow-hidden">
                     <h3 className="text-white section-title mb-8 border-b border-white/10 pb-4">
                        Distribuição do Valor 
                     </h3>
                     <div className="h-[250px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Médicos', value: data.kpi.doctorPayouts },
                                        { name: 'Plataforma', value: data.kpi.platformNetRevenue },
                                        { name: 'Devs', value: data.kpi.devRevenue },
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell key="cell-0" fill="var(--teal-500)" /> 
                                    <Cell key="cell-1" fill="var(--blue-500)" />
                                    <Cell key="cell-2" fill="var(--blue-400)" />
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-3 mt-4 text-xs">
                        <div className="flex justify-between font-bold uppercase" style={{ color: 'var(--text-on-dark-muted)' }}>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--teal-500)' }}></div> Médicos</span>
                            <span>{((data.kpi.doctorPayouts / data.kpi.totalTransacted) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between font-bold uppercase" style={{ color: 'var(--text-on-dark-muted)' }}>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--blue-500)' }}></div> Plataforma</span>
                            <span>{((data.kpi.platformNetRevenue / data.kpi.totalTransacted) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between font-bold uppercase" style={{ color: 'var(--text-on-dark-muted)' }}>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--blue-400)' }}></div> Devs</span>
                            <span>{((data.kpi.devRevenue / data.kpi.totalTransacted) * 100).toFixed(1)}%</span>
                        </div>
                     </div>
                </div>
            </div>

            {/* Performance Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Top Clinics */}
                <div>
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-gray-900 font-black text-xl uppercase tracking-tighter">Top Clínicas (Volume)</h3>
                        <div className="bg-gray-100 px-3 py-1 rounded text-[10px] font-bold text-gray-500 uppercase">This Month</div>
                     </div>
                     <div className="space-y-4">
                        {data.charts.clinicPerformance.map((clinic, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm hover:border-gray-300 transition-all cursor-default group">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-gray-300 font-black text-lg group-hover:text-brand-blue-500 transition-colors">#{i+1}</span>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{clinic.name}</p>
                                        <div className="w-24 h-1 bg-gray-100 mt-1 rounded-full overflow-hidden">
                                            <div style={{ width: `${(clinic.value / data.charts.clinicPerformance[0].value) * 100}%`}} className="h-full bg-gray-900 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-black text-gray-900 font-mono">R$ {clinic.value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Top Doctors */}
                <div>
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-gray-900 font-black text-xl uppercase tracking-tighter">Top Médicos (Payout)</h3>
                        <div className="bg-gray-100 px-3 py-1 rounded text-[10px] font-bold text-gray-500 uppercase">This Month</div>
                     </div>
                     <div className="space-y-4">
                        {data.charts.doctorPerformance.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm hover:border-teal-200 transition-all cursor-default group">
                                <div className="flex items-center gap-4">
                                     <div className="w-8 h-8 rounded-none rotate-45 bg-teal-50 flex items-center justify-center -ml-2 group-hover:bg-teal-500 transition-colors">
                                        <span className="font-black text-xs text-teal-700 -rotate-45 group-hover:text-white">{doc.name.charAt(0)}</span>
                                     </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{doc.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">PENDING: R$ {doc.pending.toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>
                                <p className="font-black text-teal-600 font-mono">R$ {doc.total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SystemFinancialPage;
