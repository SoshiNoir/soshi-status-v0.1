// src/app/api/status/route.ts (AJUSTADO)

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const latestStatus = await prisma.status.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Se não houver status, retorne valores padrão para todos os campos
    if (!latestStatus) {
      return NextResponse.json({
        isAwake: false,
        hasEaten: false,
        hasDrunk: false, // Incluir valor padrão aqui
      });
    }

    // Retorne o objeto completo, incluindo o novo campo
    return NextResponse.json({
      isAwake: latestStatus.isAwake,
      hasEaten: latestStatus.hasEaten,
      hasDrunk: latestStatus.hasDrunk, // <<< LINHA ADICIONADA
    });
  } catch (error) {
    console.error("Error fetching status:", error);
    return new NextResponse('Error fetching status', { status: 500 });
  }
}