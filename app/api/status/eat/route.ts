// src/app/api/status/eat/route.ts

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { hasEaten } = await request.json();
  if (typeof hasEaten !== 'boolean') {
    return NextResponse.json({ error: 'Entrada inválida' }, { status: 400 });
  }

  const latest = await prisma.status.findFirst({ orderBy: { createdAt: 'desc' } });

  if (!latest) {
    // Se não existe status, cria um com todos os campos
    const created = await prisma.status.create({
      data: {
        hasEaten,
        isAwake: false,
        hasDrunk: false, // <<< AJUSTE AQUI
      },
    });
    return NextResponse.json(created);
  }

  // Atualiza apenas hasEaten
  const updated = await prisma.status.update({
    where: { id: latest.id },
    data: { hasEaten },
  });
  return NextResponse.json(updated);
}