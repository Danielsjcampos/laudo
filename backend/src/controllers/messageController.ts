import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const saveMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId, content, examId, examName } = req.body;

    if (!senderId || !recipientId || !content) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    // Remova do arquivo caso exista, de ambos os lados (para "ressuscitar" a conversa)
    await prisma.conversationArchive.deleteMany({
      where: {
        OR: [
          { userId: senderId, peerId: recipientId },
          { userId: recipientId, peerId: senderId }
        ]
      }
    });

    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
        examId: examId || null,
        examName: examName || null,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Erro ao salvar mensagem' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({ error: 'Participantes não especificados' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: String(user1), recipientId: String(user2) },
          { senderId: String(user2), recipientId: String(user1) },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId } = req.body;
    if (!senderId || !recipientId) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

    // Check if recipient (me) wants to send read receipts
    let sendReceipts = true;

    const clinic = await prisma.clinic.findUnique({ where: { id: recipientId } });
    if (clinic) {
      sendReceipts = clinic.sendReadReceipts;
    } else {
      const doctor = await prisma.doctor.findUnique({ where: { id: recipientId } });
      if (doctor) {
        sendReceipts = doctor.sendReadReceipts;
      }
    }

    if (!sendReceipts) {
       // Silently succeed
       return res.status(200).json({ success: true, receiptsDisabled: true });
    }

    await prisma.message.updateMany({
      where: {
        senderId: senderId,
        recipientId: recipientId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Erro ao marcar as mensagens como lidas' });
  }
};

export const getUnreadCounts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Falta userId' });

    const unreadMessages = await prisma.message.groupBy({
      by: ['senderId'],
      where: {
        recipientId: String(userId),
        isRead: false,
      },
      _count: {
        id: true,
      },
    });

    const counts = unreadMessages.reduce((acc: any, curr) => {
      acc[curr.senderId] = curr._count.id;
      return acc;
    }, {});

    res.json(counts);
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    res.status(500).json({ error: 'Erro ao buscar contagens de não-lidas' });
  }
};

export const archiveConversation = async (req: Request, res: Response) => {
  try {
    const { userId, peerId } = req.body;
    if (!userId || !peerId) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    
    await prisma.conversationArchive.upsert({
      where: {
        userId_peerId: { userId, peerId }
      },
      update: { archivedAt: new Date() },
      create: { userId, peerId }
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error archiving conversation:', error);
    res.status(500).json({ error: 'Erro ao arquivar conversa' });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinic.findMany({
      where: { chatSearchable: true }
    });
    const doctors = await prisma.doctor.findMany({
      where: { chatSearchable: true }
    });
    res.json({ clinics, doctors });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Erro ao buscar contatos' });
  }
};

export const getArchivedConversations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Falta userId' });

    const archives = await prisma.conversationArchive.findMany({
      where: { userId: String(userId) }
    });
    
    res.json(archives.map(a => a.peerId));
  } catch (err) {
    console.error('Error fetching archives:', err);
    res.status(500).json({ error: 'Erro ao buscar arquivos' });
  }
};
