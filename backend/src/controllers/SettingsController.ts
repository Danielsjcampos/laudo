
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsController {
  static async getSettings(req: Request, res: Response) {
    try {
      let settings = await prisma.systemSettings.findFirst();
      
      if (!settings) {
        // Initialize if not exists
        settings = await prisma.systemSettings.create({
          data: { id: 'global-settings', feeGlobal: 15, feeDev: 10 }
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Erro ao buscar configurações do sistema' });
    }
  }

  static async updateSettings(req: Request, res: Response) {
    const { feeGlobal, feeDev } = req.body;

    if (typeof feeGlobal !== 'number' || typeof feeDev !== 'number') {
      return res.status(400).json({ error: 'Valores inválidos para as taxas' });
    }

    try {
      const updatedSettings = await prisma.systemSettings.upsert({
        where: { id: 'global-settings' },
        update: { feeGlobal, feeDev },
        create: { id: 'global-settings', feeGlobal, feeDev }
      });
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
  }
}
