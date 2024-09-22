import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { nome, cpf, documentoFoto, selfie } = req.body;

    // Validate input
    if (!nome || !cpf) {
      return res.status(400).json({ error: 'Nome e CPF são obrigatórios.' });
    }

    // Save data to the database
    const onboarding = await prisma.onboarding.create({
      data: {
        nome,
        cpf,
        documentoFoto: documentoFoto || null,
        selfie: selfie || null,
      },
    });

    return res.status(201).json({ message: 'Dados salvos com sucesso!', onboarding });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao salvar dados.' });
  } finally {
    await prisma.$disconnect();
  }
}