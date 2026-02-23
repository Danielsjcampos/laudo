import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FinancialController {
  static async getDashboardStats(req: Request, res: Response) {
    try {
      // 1. Get System Fee Settings
      let settings = await prisma.systemSettings.findFirst({
        where: { id: 'global-settings' }
      });

      if (!settings) {
         settings = { id: 'global-settings', feeGlobal: 15, feeDev: 5, updatedAt: new Date() };
      }

      const marketplaceFee = settings.feeGlobal / 100;
      const devCommissionRate = settings.feeDev / 100;

      // 2. Aggregate Exam Data (Completed Exams only for revenue)
      // For a real dashboard, we might want all exams or just paid ones. 
      // Assuming 'Concluído' or 'Pago' implies revenue realization.
      // Let's verify statuses: 'Disponível' | 'Aguardando Laudo' | 'Laudando' | 'Em Análise' | 'Concluído' | 'Recusado'
      // And paymentStatus: 'Pendente' | 'Pago' | 'Processando'
      
      const exams = await prisma.exam.findMany({
        where: {
          // status: 'Concluído' // Or logic related to paymentStatus
        },
        select: {
          id: true,
          price: true,
          paymentStatus: true,
          status: true,
          dateRequested: true,
          clinicName: true,
          clinicId: true,
          doctorAssignedName: true,
          doctorAssignedId: true,
        }
      });

      // 3. KPI Calculations
      let totalTransacted = 0;
      let platformNetRevenue = 0; // Marketplace Fee Revenue
      let devRevenue = 0; // Dev Commission Portion
      let doctorPayouts = 0; // Total to be paid to doctors (Net)

      // Breakdowns
      const revenueByClinic: Record<string, number> = {};
      const payoutsByDoctor: Record<string, { name: string, total: number, pending: number }> = {};
      const statsByMonth: Record<string, { total: number, platform: number }> = {};

      exams.forEach(exam => {
        const price = exam.price || 0;
        
        // Calculate breakdown for this exam
        const marketplaceShare = price * marketplaceFee;
        const devShare = marketplaceShare * devCommissionRate; // Dev gets % of the fee, or % of total?
        // Re-reading SettingsController logic:
        // "Comissão de Devs (%) ... Royalties calculados sobre a Taxa do Marketplace" -> So Fee * Dev%
        // "Total Platform Retention ... Marketplace: X% | Dev Comm: Y% (of fee)"
        
        // So:
        // Client pays: Price
        // Platform keeps: Price * FeeGlobal
        //    -> Of which Dev gets: (Price * FeeGlobal) * FeeDev
        //    -> Platform keeps net: (Price * FeeGlobal) * (1 - FeeDev)
        // Doctor gets: Price - (Price * FeeGlobal)

        const platformGross = price * marketplaceFee;
        const devAmount = platformGross * devCommissionRate;
        const platformNet = platformGross - devAmount;
        const doctorAmount = price - platformGross;

        totalTransacted += price;
        platformNetRevenue += platformNet; // Or maybe display Gross IDK? Usually "Lucro da Plataforma" implies what stays.
        devRevenue += devAmount;
        doctorPayouts += doctorAmount;

        // Group by Clinic
        if (!revenueByClinic[exam.clinicName]) revenueByClinic[exam.clinicName] = 0;
        revenueByClinic[exam.clinicName] += price;

        // Group by Doctor (if assigned)
        if (exam.doctorAssignedId && exam.doctorAssignedName) {
            if (!payoutsByDoctor[exam.doctorAssignedId]) {
                payoutsByDoctor[exam.doctorAssignedId] = { 
                    name: exam.doctorAssignedName, 
                    total: 0, 
                    pending: 0 
                };
            }
            payoutsByDoctor[exam.doctorAssignedId].total += doctorAmount;
            if (exam.paymentStatus !== 'Pago') {
                payoutsByDoctor[exam.doctorAssignedId].pending += doctorAmount;
            }
        }

        // Group by Month (YYYY-MM)
        const month = new Date(exam.dateRequested).toISOString().slice(0, 7);
        if (!statsByMonth[month]) statsByMonth[month] = { total: 0, platform: 0 };
        statsByMonth[month].total += price;
        statsByMonth[month].platform += platformGross; 
      });

      // Format for Charts
      const monthlyData = Object.entries(statsByMonth)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, data]) => ({ name, ...data }));

      const clinicPerformance = Object.entries(revenueByClinic)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

        const doctorPerformance = Object.values(payoutsByDoctor)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      const dashboardData = {
        kpi: {
          totalTransacted,
          platformNetRevenue, // Show Gross or Net? Let's show Gross as "Receita Plataforma" and maybe a sub metric for "Lucro Líquido"
          platformGrossRevenue: platformNetRevenue + devRevenue,
          devRevenue,
          doctorPayouts,
        },
        charts: {
            monthlyData,
            clinicPerformance,
            doctorPerformance,
        }
      };

      res.json(dashboardData);

    } catch (error) {
      console.error('Error in financial dashboard:', error);
      res.status(500).json({ error: 'Erro ao carregar dados financeiros' });
    }
  }
}
