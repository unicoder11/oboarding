import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nome, cpf, documentoFoto, selfie } = await req.json();

    // Guarda los datos en la base de datos
    const onboarding = await prisma.onboarding.create({
      data: {
        nome,
        cpf,
        documentoFoto,
        selfie,
      },
    });

    return NextResponse.json({ message: 'Dados salvos com sucesso!', onboarding });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return NextResponse.json({ error: 'Erro ao salvar dados.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Método GET no es soportado en esta ruta.' }, { status: 405 });
}
