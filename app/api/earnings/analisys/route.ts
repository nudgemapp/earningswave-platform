// app/api/earnings/analysis/route.ts
import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Remove the dynamic export if it's causing issues
// export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Make sure to export POST as a named export
export async function POST(
  request: Request
) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const { symbol, estimate, lastYearEPS, reportDate, fiscalDateEnding } = body;

    const prompt = `Analyze the upcoming earnings report for ${symbol}.
    Current EPS estimate: ${estimate}
    Last year EPS: ${lastYearEPS}
    Report Date: ${reportDate}
    Fiscal Date Ending: ${fiscalDateEnding}

    Provide a brief analysis with key positives and potential risks. Format the response as JSON with the following structure:
    {
      "positives": [
        { "title": "string", "description": "string" }
      ],
      "risks": [
        { "title": "string", "description": "string" }
      ]
    }`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const firstContent = response.content[0];
    if (!('text' in firstContent)) {
      throw new Error('Unexpected response format from Claude API');
    }

    const analysisText = firstContent.text;
    const analysis = JSON.parse(analysisText);

    return NextResponse.json(analysis, { headers });

  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500, headers }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
