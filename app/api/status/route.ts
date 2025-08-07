import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const latestStatus = await prisma.status.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    isAwake: latestStatus?.isAwake ?? false,
    hasEaten: latestStatus?.hasEaten ?? false,
  });
}
