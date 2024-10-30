// app/api/earnings/report/[id]/route.ts
import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import prisma from '@/lib/prismadb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  try {
    const report = await prisma.earningsReport.findUnique({
      where: { id: params.id },
      include: {
        company: true
      }
    });

    if (!report) {
      return new NextResponse('Report not found', { status: 404 });
    }

    // Create a PDF document
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    // Add content to PDF
    doc
      .fontSize(20)
      .text(`${report.name} (${report.symbol})`, { align: 'center' })
      .moveDown()
      .fontSize(16)
      .text('Earnings Report', { align: 'center' })
      .moveDown()
      .fontSize(12);

    // Add report details
    const details = [
      `Report Date: ${new Date(report.reportDate).toLocaleDateString()}`,
      `Fiscal Date Ending: ${new Date(report.fiscalDateEnding).toLocaleDateString()}`,
      `EPS Estimate: $${report.estimate?.toFixed(2) ?? 'N/A'}`,
      `Last Year EPS: $${report.lastYearEPS?.toFixed(2) ?? 'N/A'}`,
      `Currency: ${report.currency}`,
      `Market Timing: ${report.marketTiming ?? 'N/A'}`
    ];

    details.forEach(detail => {
      doc.text(detail).moveDown(0.5);
    });

    doc.end();

    const pdfBuffer = await pdfPromise;

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.symbol}_earnings_report.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return new NextResponse('Error generating report', { status: 500 });
  }
}
