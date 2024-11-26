import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import prisma from "@/lib/prismadb";
import { Transcript, Company } from "@prisma/client";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Define type for transcript with company relation
type TranscriptWithCompany = Transcript & {
  company: Company;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    // First, check for existing analysis in database
    const existingTranscript = await prisma.transcript.findUnique({
      where: { id },
      select: {
        aiSummary: true,
        aiKeyPoints: true,
        aiLastUpdated: true,
        status: true,
      },
    });

    if (!existingTranscript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    // If analysis exists and is less than 24 hours old, return it
    if (
      existingTranscript.aiSummary &&
      existingTranscript.aiKeyPoints &&
      existingTranscript.aiLastUpdated
    ) {
      const analysisAge =
        Date.now() - existingTranscript.aiLastUpdated.getTime();
      if (analysisAge < 24 * 60 * 60 * 1000) {
        // 24 hours
        return NextResponse.json({
          summary: existingTranscript.aiSummary,
          keyPoints: existingTranscript.aiKeyPoints,
        });
      }
    }

    // If no valid existing analysis, fetch full transcript data for Claude
    const transcript = await prisma.transcript.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            symbol: true,
            name: true,
          },
        },
      },
    });

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    // Generate AI analysis
    // const prompt =
    //   transcript.status === "SCHEDULED"
    //     ? generateUpcomingEarningsPrompt(transcript as TranscriptWithCompany)
    //     : generateCompletedEarningsPrompt(transcript as TranscriptWithCompany);

    // const response = await anthropic.messages.create({
    //   model: "claude-3-opus-20240229",
    //   max_tokens: 1000,
    //   temperature: 0.7,
    //   messages: [{ role: "user", content: prompt }],
    // });

    // const firstContent = response.content[0];
    // if (!("text" in firstContent)) {
    //   throw new Error("Unexpected response format from Claude API");
    // }

    // const analysis = JSON.parse(firstContent.text);

    const analysis = {
      summary: "Example summary",
      keyPoints: "Example key points",
    };

    // Update transcript with new analysis
    await prisma.transcript.update({
      where: { id },
      data: {
        aiSummary: analysis.summary,
        aiKeyPoints: analysis,
        aiLastUpdated: new Date(),
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}

function generateUpcomingEarningsPrompt(
  transcript: TranscriptWithCompany
): string {
  return `Analyze the upcoming earnings report for ${
    transcript.company.symbol
  } (${transcript.company.name}).
    Current EPS estimate: ${transcript.epsEstimate || "N/A"}
    Last year EPS actual: ${transcript.epsActual || "N/A"}
    Report Date: ${transcript.scheduledAt.toISOString()}
    Quarter: Q${transcript.quarter || "N/A"} ${transcript.year || "N/A"}

    Provide a brief analysis with key positives and potential risks. Format the response as JSON with the following structure:
    {
      "summary": "Brief overall summary",
      "positives": [
        { "title": "string", "description": "string" }
      ],
      "risks": [
        { "title": "string", "description": "string" }
      ],
      "sentiment": {
        "score": number, // 0 to 1
        "label": "bullish" | "neutral" | "bearish"
      }
    }`;
}
