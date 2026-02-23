
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PricingController {
  static async getPrices(req: Request, res: Response) {
    try {
      const prices = await prisma.pricingTable.findMany();
      res.json(prices);
    } catch (error) {
      console.error('Error fetching prices:', error);
      res.status(500).json({ error: 'Erro ao buscar tabela de preços' });
    }
  }

  static async updatePrice(req: Request, res: Response) {
    const { modality, urgency, price } = req.body;

    if (!modality || !urgency || typeof price !== 'number') {
      return res.status(400).json({ error: 'Dados inválidos para atualização de preço' });
    }

    try {
      const updatedPrice = await prisma.pricingTable.upsert({
        where: {
          modality_urgency: {
            modality,
            urgency
          }
        },
        update: { price },
        create: { modality, urgency, price }
      });
      res.json(updatedPrice);
    } catch (error) {
      console.error('Error updating price:', error);
      res.status(500).json({ error: 'Erro ao atualizar preço' });
    }
  }

  static async getPriceByModality(req: Request, res: Response) {
    const { modality, urgency } = req.query;

    if (!modality || !urgency) {
      return res.status(400).json({ error: 'Modalidade e urgência são obrigatórias' });
    }

    try {
      const pricing = await prisma.pricingTable.findUnique({
        where: {
          modality_urgency: {
            modality: modality as string,
            urgency: urgency as string
          }
        }
      });

      if (!pricing) {
        return res.status(404).json({ error: 'Preço não configurado para esta modalidade/urgência' });
      }

      res.json(pricing);
    } catch (error) {
      console.error('Error fetching specific price:', error);
      res.status(500).json({ error: 'Erro ao buscar preço' });
    }
  }
  static async deleteModality(req: Request, res: Response) {
    const { modality } = req.params;

    if (!modality) {
      return res.status(400).json({ error: 'Modalidade é obrigatória' });
    }

    try {
      await prisma.pricingTable.deleteMany({
        where: { modality }
      });
      res.json({ message: `Modalidade ${modality} removida com sucesso` });
    } catch (error) {
      console.error('Error deleting modality:', error);
      res.status(500).json({ error: 'Erro ao remover modalidade' });
    }
  }
}
