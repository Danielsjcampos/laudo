
import { Request, Response } from 'express';
import { CRMService } from '../services/crmService';

export const verifyCRM = async (req: Request, res: Response) => {
  const { crm, uf } = req.query;

  if (!crm || !uf) {
    return res.status(400).json({ error: 'CRM e UF são obrigatórios' });
  }

  try {
    const result = await CRMService.verify(crm as string, uf as string);
    return res.json(result);
  } catch (error) {
    console.error('Error in verifyCRM controller:', error);
    return res.status(500).json({ error: 'Erro ao verificar CRM' });
  }
};
