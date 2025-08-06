import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Garante que a rota seja sempre dinâmica

// Handler para requisições GET: busca o status mais recente
export async function GET() {
  try {
    const latestStatus = await prisma.status.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Se nenhum status for encontrado, retorna 'false'
    const isAwake = latestStatus ? latestStatus.isAwake : false;

    return NextResponse.json({ isAwake });
  } catch (error) {
    console.error("Erro ao buscar o status:", error);
    return NextResponse.json({ error: 'Erro ao buscar o status' }, { status: 500 });
  }
}

// Handler para requisições POST: atualiza o status (protegido)
export async function POST(request: Request) {
  // Verifica a sessão do usuário
  const session = await getServerSession();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { isAwake } = await request.json();

    // Valida a entrada
    if (typeof isAwake !== 'boolean') {
      return NextResponse.json({ error: 'Entrada inválida' }, { status: 400 });
    }

    // Cria uma nova entrada de status no banco de dados
    const newStatus = await prisma.status.create({
      data: {
        isAwake,
      },
    });

    return NextResponse.json(newStatus);
  } catch (error) {
    console.error("Erro ao atualizar o status:", error);
    return NextResponse.json({ error: 'Erro ao atualizar o status' }, { status: 500 });
  }
}
