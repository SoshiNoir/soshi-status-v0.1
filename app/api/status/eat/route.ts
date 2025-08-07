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

  // Find the latest status
  const latest = await prisma.status.findFirst({ orderBy: { createdAt: 'desc' } });
  if (!latest) {
    // If no status exists, create one with both fields
    const created = await prisma.status.create({ data: { hasEaten, isAwake: false } });
    return NextResponse.json(created);
  }
  // Update only hasEaten, keep isAwake as is
  const updated = await prisma.status.update({
    where: { id: latest.id },
    data: { hasEaten },
  });
  return NextResponse.json(updated);
}
