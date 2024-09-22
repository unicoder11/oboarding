import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { nome, cpf, documentoFoto, selfie } = req.body;

      // Guarda los datos en la base de datos
      const onboarding = await prisma.onboarding.create({
        data: {
          nome,
          cpf,
          documentoFoto,
          selfie,
        },
      });

      res.status(200).json({ message: 'Dados salvos com sucesso!', onboarding });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      res.status(500).json({ error: 'Erro ao salvar dados.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
