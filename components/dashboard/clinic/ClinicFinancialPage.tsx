
import React from 'react';
import type { Exam } from '../../../data/mockData';
import { mockClinicPerformance } from '../../../data/mockData';
import { Card } from '../../ui/Card';
import { WalletIcon } from '../../icons/WalletIcon';
import { Button } from '../../ui/Button';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';

interface ClinicFinancialPageProps {
  exams: Exam[];
}

const ClinicFinancialPage: React.FC<ClinicFinancialPageProps> = ({ exams }) => {
  const pendingRepasse = exams.filter(e => e.paymentStatus === 'Pendente' && e.status === 'Concluído').reduce((acc, curr) => acc + curr.price, 0);
  const paidRepasse = exams.filter(e => e.paymentStatus === 'Pago').reduce((acc, curr) => acc + curr.price, 0);
  
  // Receita clínica simulada (faturamento bruto total dos exames baseado nos custos do mock)
  const totalGrossRevenue = mockClinicPerformance.rentabilityByExam.reduce((acc, curr) => acc + curr.revenue, 0);
  const netMarginTotal = totalGrossRevenue - (pendingRepasse + paidRepasse);
  const marginPercentage = (netMarginTotal / totalGrossRevenue) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Centro de Receita</h1>
          <p className="text-gray-500 font-medium mt-1">Gestão de repasses médicos, margens e fluxo financeiro global.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
            <Button variant="outline" className="rounded-2xl px-8 py-3 font-black uppercase text-[10px] flex-1 md:flex-none">Exportar DRE</Button>
            <Button className="bg-brand-blue-700 rounded-2xl px-8 py-3 font-black uppercase text-[10px] shadow-xl shadow-brand-blue-100 flex-1 md:flex-none">
                Lote de Repasse (Pendentes)
            </Button>
        </div>
      </div>
      
      {/* Bloco de Saldo e Lucro Estilo FinTech */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-brand-blue-900 via-brand-blue-800 to-brand-blue-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <span className="text-brand-blue-300 font-black uppercase tracking-[0.2em] text-[10px]">Lucro Operacional Líquido</span>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-2xl font-bold text-brand-blue-300 mr-2">R$</span>
                        <span className="text-6xl font-black tabular-nums tracking-tighter">
                            {netMarginTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <div className="mt-12 flex items-center space-x-4">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                        <p className="text-[9px] font-black uppercase text-brand-blue-100 mb-1">Margem Líquida</p>
                        <p className="text-xl font-black text-white">{marginPercentage.toFixed(1)}%</p>
                    </div>
                    <div className="bg-teal-500 px-4 py-2 rounded-2xl shadow-lg">
                        <p className="text-[9px] font-black uppercase text-white/90 mb-1">Status do Mês</p>
                        <p className="text-xl font-black text-white">SAUDÁVEL</p>
                    </div>
                </div>
            </div>
            <WalletIcon className="absolute -right-12 -bottom-12 h-72 w-72 opacity-5 rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Faturamento Bruto</h3>
                <p className="text-4xl font-black text-gray-900">R$ {totalGrossRevenue.toLocaleString()}</p>
            </div>
            <div className="mt-10 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Progresso da Meta</span>
                    <span className="text-[10px] font-black text-brand-blue-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-blue-600 h-full w-[85%]"></div>
                </div>
            </div>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">A Pagar (Médicos)</h3>
                <p className="text-4xl font-black text-yellow-600">R$ {pendingRepasse.toLocaleString()}</p>
            </div>
            <button className="mt-8 w-full bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase py-4 rounded-2xl hover:bg-yellow-100 transition-colors border border-yellow-100">
                Agendar Pagamentos
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gráfico de Rentabilidade por Categoria */}
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-10">Rentabilidade por Modalidade</h2>
            <div className="space-y-8">
                {mockClinicPerformance.rentabilityByExam.map((item, i) => (
                    <div key={i} className="group">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <p className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-brand-blue-600 transition-colors">{item.type}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Faturamento: R$ {item.revenue.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-gray-900">{item.margin}%</span>
                                <p className="text-[9px] font-bold text-brand-teal-500 uppercase">Margem</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                            <div 
                                className={`bg-brand-blue-600 h-full transition-all duration-1000 delay-${i*100} opacity-80 group-hover:opacity-100`} 
                                style={{ width: `${item.margin}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Insights e Conciliação */}
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-brand-teal-500 to-brand-teal-700 p-12 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-6">
                        <SparklesIcon className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">IA Financial Optimization</span>
                    </div>
                    <p className="text-xl font-bold leading-relaxed mb-10">
                        Otimize seu fluxo: Exames de <span className="underline decoration-2 underline-offset-4">Ressonância Magnética</span> estão gerando 65% de margem com o marketplace, superando o custo de médicos internos em <span className="font-black text-white italic">22.4%</span>.
                    </p>
                    <Button className="bg-white text-brand-teal-700 font-black rounded-2xl px-10 py-4 text-[10px] uppercase tracking-widest hover:bg-brand-teal-50">
                        Ver Relatório de Eficiência
                    </Button>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-black text-gray-900 text-base">Status do Fechamento Mensal</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">98.2% dos laudos já foram conciliados</p>
                </div>
                <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center font-black text-xs">
                            {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 text-gray-400 flex items-center justify-center font-black text-xs">
                        +4
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Extrato Detalhado de Transações */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Extrato Consolidado</h2>
          <Button variant="outline" className="text-[9px] font-black uppercase tracking-widest rounded-xl">Filtrar por Período</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
              <tr>
                <th className="px-10 py-6">Data de Conclusão</th>
                <th className="px-10 py-6">Modalidade / Especialista</th>
                <th className="px-10 py-6">Valor Repasse</th>
                <th className="px-10 py-6">Status Repasse</th>
                <th className="px-10 py-6 text-right">Ação Financeira</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exams.map(exam => (
                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6 text-gray-500 font-medium">{new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</td>
                  <td className="px-10 py-6">
                    <div className="font-bold text-gray-900 group-hover:text-brand-blue-600 transition-colors">{exam.examType}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{exam.doctorAssignedName || 'MÉDICO NÃO ALOCADO'}</div>
                  </td>
                  <td className="px-10 py-6 font-black text-gray-900">
                    R$ {exam.price.toFixed(2)}
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] ${
                      exam.paymentStatus === 'Pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {exam.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    {exam.paymentStatus === 'Pendente' && exam.status === 'Concluído' ? (
                      <button className="bg-brand-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-brand-blue-700 transition-all shadow-lg shadow-brand-blue-100">
                        Liberar Pagamento
                      </button>
                    ) : (
                        <div className="flex items-center justify-end text-green-600 font-bold text-[10px] uppercase tracking-widest">
                            <CheckCircleIcon className="h-4 w-4 mr-1.5" /> Conciliado
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicFinancialPage;
