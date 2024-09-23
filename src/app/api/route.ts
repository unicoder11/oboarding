import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'

// import { PrismaClient } from '@prisma/client';

// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
// import dotenv from 'dotenv';
// import ws from 'ws';

// dotenv.config();
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`

// const pool = new Pool({ connectionString });
// const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient();

export async function save(formDataToSend: FormData) {
  const save = axios.post('/api/route', formDataToSend)
  return save
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { nome, cpf, documentoFoto, selfie } = req.body;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao salvar dados.' });
  } finally {
    await prisma.$disconnect();
  }
} 

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