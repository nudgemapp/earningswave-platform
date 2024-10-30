// app/api/earnings/history/[companyId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    // Get all historical earnings reports for this company
    const historicalEarnings = await prisma.earningsReport.findMany({
      where: {
        companyId: parseInt(params.companyId),
        reportDate: {
          lt: new Date(), // Only get past earnings
        }
      },
      orderBy: {
        fiscalDateEnding: 'desc'
      },
      take: 12, // Last 12 quarters
      include: {
        company: true
      }
    });

    // Transform the data for the frontend
    const transformedData = historicalEarnings.map(report => {
      const quarterNum = Math.floor(new Date(report.fiscalDateEnding).getMonth() / 3) + 1;
      const year = new Date(report.fiscalDateEnding).getFullYear();

      // Calculate actual revenue and EPS data
      const epsBeat = report.lastYearEPS
        ? ((report.estimate || 0) - report.lastYearEPS) / Math.abs(report.lastYearEPS) * 100
        : 0;

      return {
        quarter: `Q${quarterNum} ${year}`,
        date: new Date(report.reportDate).toLocaleDateString(),
        revenue: report.estimate || 0,
        eps: report.estimate || 0,
        revenueBeat: 0, // This will be calculated once you add lastYearRevenue to schema
        epsBeat: epsBeat,
        marketTiming: report.marketTiming
      };
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching historical earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical earnings' },
      { status: 500 }
    );
  }
}
