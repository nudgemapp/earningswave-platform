// app/api/earnings/history/[companyId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

// app/api/earnings/history/[companyId]/route.ts
export async function GET(
    request: Request,
    { params }: { params: { companyId: string } }
  ) {
    try {
      const historicalEarnings = await prisma.earningsReport.findMany({
        where: {
          companyId: parseInt(params.companyId),
          reportDate: {
            lt: new Date()
          }
        },
        orderBy: {
          fiscalDateEnding: 'desc'
        },
        take: 12,
        include: {
          company: true
        }
      });

      const transformedData = historicalEarnings.map(report => {
        const quarterNum = Math.floor(new Date(report.fiscalDateEnding).getMonth() / 3) + 1;
        const year = new Date(report.fiscalDateEnding).getFullYear();

        return {
          quarter: `Q${quarterNum} ${year}`,
          date: new Date(report.reportDate).toLocaleDateString(),
          revenue: report.estimate || 0,
          eps: report.estimate || 0,
          revenueBeat: 0,
          epsBeat: report.lastYearEPS
            ? ((report.estimate || 0) - report.lastYearEPS) / Math.abs(report.lastYearEPS) * 100
            : 0
        };
      });

      return NextResponse.json(transformedData);
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
  }
