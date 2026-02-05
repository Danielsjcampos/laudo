// @ts-nocheck

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dev-key-change-in-prod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Em dev, se a senha for "admin" ou "password" e no banco não estiver hash, permitir (para migração suave)
    // MAS o ideal é forçar hash. Vamos assumir que o seed já vai colocar hash.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
       return res.status(401).json({ error: 'Credenciais inválidas (senha)' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Set cookie httpOnly para segurança extra
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000 // 8 horas
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token // Retorna token também caso o front prefira usar Headers Bearer
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logout realizado com sucesso' });
};

export const getMe = async (req: any, res: Response) => {
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({error: 'Não autenticado'});

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true }
    });

    res.json({ user });
}
