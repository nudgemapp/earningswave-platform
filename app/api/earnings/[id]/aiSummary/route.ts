import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import prisma from "@/lib/prismadb";
import { Transcript, Company } from "@prisma/client";
import { AISummary } from "@/app/(auth)/(platform)/(calendar)/earnings/types";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Define type for transcript with company relation
type TranscriptWithCompany = Transcript & {
  company: Company;
};

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const existingTranscript = await prisma.transcript.findUnique({
      where: { id },
      select: {
        aiSummary: true,
        aiKeyPoints: true,
        aiSentimentAnalysis: true,
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

    // If analysis exists, return formatted response
    if (
      existingTranscript.aiSummary &&
      existingTranscript.aiKeyPoints &&
      existingTranscript.aiSentimentAnalysis
    ) {
      const aiKeyPoints = existingTranscript.aiKeyPoints as {
        summary: {
          quarterHighlights: string;
          challenges: string;
        };
        keyHighlights: Array<{
          category: string;
          title: string;
          description: string;
          impact: string;
        }>;
        performanceAnalysis: Array<{
          metric: string;
          value: string;
          analysis: string;
          trend: "positive" | "neutral" | "negative";
        }>;
        forwardGuidance: {
          outlook: string;
          keyInitiatives: string[];
          risks: string[];
        };
      };
      const aiSentimentAnalysis =
        existingTranscript.aiSentimentAnalysis as AISummary["sentiment"];

      const formattedResponse: AISummary = {
        summary: {
          overview: existingTranscript.aiSummary,
          quarterHighlights: aiKeyPoints?.summary?.quarterHighlights || "",
          challenges: aiKeyPoints?.summary?.challenges || "",
        },
        keyHighlights: aiKeyPoints?.keyHighlights || [],
        performanceAnalysis: aiKeyPoints?.performanceAnalysis || [],
        forwardGuidance: {
          outlook: aiKeyPoints?.forwardGuidance?.outlook || "",
          keyInitiatives: aiKeyPoints?.forwardGuidance?.keyInitiatives || [],
          risks: aiKeyPoints?.forwardGuidance?.risks || [],
        },
        sentiment: aiSentimentAnalysis || {
          score: 0,
          label: "neutral",
          rationale: "",
        },
      };

      console.log(formattedResponse);

      return NextResponse.json(formattedResponse);
    }

    // Generate new analysis only if needed
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

    console.log(transcript);

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    console.log(transcript.status);

    // Generate AI analysis
    const prompt = generateCompletedEarningsPrompt(
      transcript as TranscriptWithCompany
    );

    console.log(prompt);

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    console.log(response);

    const firstContent = response.content[0];
    if (!("text" in firstContent)) {
      throw new Error("Unexpected response format from Claude API");
    }

    // Parse and validate the response
    const analysis = JSON.parse(firstContent.text.trim()) as AISummary;

    console.log(analysis);

    // Store analysis in database with consistent structure
    const updatedTranscript = await prisma.transcript.update({
      where: { id },
      data: {
        aiSummary: analysis.summary.overview,
        aiKeyPoints: {
          summary: {
            quarterHighlights: analysis.summary.quarterHighlights,
            challenges: analysis.summary.challenges,
          },
          keyHighlights: analysis.keyHighlights,
          performanceAnalysis: analysis.performanceAnalysis,
          forwardGuidance: analysis.forwardGuidance,
        },
        aiSentimentAnalysis: analysis.sentiment,
        aiLastUpdated: new Date(),
      },
    });

    console.log(updatedTranscript);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}

function generateCompletedEarningsPrompt(
  transcript: TranscriptWithCompany
): string {
  return `Analyze the earnings report for ${transcript.company.symbol} (${
    transcript.company.name
  }).

Financial Performance:
- EPS Actual: ${transcript.epsActual || "N/A"} vs Estimate: ${
    transcript.epsEstimate || "N/A"
  }
- Revenue Actual: ${transcript.revenueActual || "N/A"} vs Estimate: ${
    transcript.revenueEstimate || "N/A"
  }
- Quarter: Q${transcript.quarter || "N/A"} ${transcript.year || "N/A"}

${
  transcript.fullText
    ? "Transcript content:\n" + transcript.fullText + "\n\n"
    : ""
}

IMPORTANT: Respond with ONLY a valid JSON object using the following structure, with no additional text before or after:

{
  "summary": {
    "overview": "2-3 sentence executive summary of the earnings report",
    "quarterHighlights": "Key achievements and milestones this quarter",
    "challenges": "Main challenges or concerns discussed"
  },
  "keyHighlights": [
    {
      "category": "string",
      "title": "string",
      "description": "string",
      "impact": "string"
    }
  ],
  "performanceAnalysis": [
    {
      "metric": "string",
      "value": "string",
      "analysis": "string",
      "trend": "positive" | "neutral" | "negative"
    }
  ],
  "forwardGuidance": {
    "outlook": "string",
    "keyInitiatives": ["string"],
    "risks": ["string"]
  },
  "sentiment": {
    "score": number,
    "label": "bullish" | "neutral" | "bearish",
    "rationale": "string"
  }
}

Focus on:
1. Financial performance vs expectations
2. Key business developments and strategic initiatives
3. Market conditions and competitive position
4. Forward-looking guidance
5. Management's tone and confidence level

Ensure all JSON fields are properly formatted and the response contains only the JSON object.`;
}
