import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const tickers = await prisma.company.findMany({
      where: {
        OR: [
          { symbol: { contains: query.toUpperCase(), mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        symbol: true,
        name: true,
        logo: true
      },
      take: 10
    });

    return NextResponse.json(tickers);
  } catch (error) {
    console.error('Error searching tickers:', error);
    return NextResponse.json({ error: 'Failed to search tickers' }, { status: 500 });
  }
}
