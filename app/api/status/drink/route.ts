// src/app/api/status/drunk/route.ts

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 1. Verifica se o usuário é o admin (segurança)
  const session = await getServerSession();
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // 2. Pega e valida o novo valor 'hasDrunk'
  const { hasDrunk } = await request.json();
  if (typeof hasDrunk !== 'boolean') {
    return NextResponse.json({ error: 'Entrada inválida' }, { status: 400 });
  }

  // 3. Encontra o registro de status mais recente
  const latest = await prisma.status.findFirst({ orderBy: { createdAt: 'desc' } });

  // 4. Se nenhum registro existir, cria o primeiro
  if (!latest) {
    const created = await prisma.status.create({
      data: {
        hasDrunk,       // O valor que recebemos
        isAwake: false, // Valor padrão
        hasEaten: false,  // Valor padrão
      },
    });
    return NextResponse.json(created);
  }

  // 5. Se já existe, atualiza apenas o campo 'hasDrunk'
  const updated = await prisma.status.update({
    where: { id: latest.id },
    data: { hasDrunk }, // Atualiza somente este campo
  });
  return NextResponse.json(updated);
}