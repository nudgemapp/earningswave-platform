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

    console.log(id);
    console.log(body);

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

    console.log(existingTranscript);

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

    console.log(transcript);

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    // Generate AI analysis
    const prompt =
      transcript.status === "SCHEDULED"
        ? generateUpcomingEarningsPrompt(transcript as TranscriptWithCompany)
        : generateCompletedEarningsPrompt(transcript as TranscriptWithCompany);

    console.log(prompt);

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    console.log(response);

    const firstContent = response.content[0];
    if (!("text" in firstContent)) {
      throw new Error("Unexpected response format from Claude API");
    }

    console.log(firstContent);

    let analysis;
    try {
      // Remove any potential whitespace or newlines before/after the JSON
      const jsonText = firstContent.text.trim();
      analysis = JSON.parse(jsonText);
    } catch (error) {
      console.error("JSON parsing error:", error);
      console.error("Raw response:", firstContent.text);
      throw new Error("Failed to parse Claude API response as JSON");
    }

    console.log(analysis);

    // Update transcript with new analysis
    await prisma.transcript.update({
      where: { id },
      data: {
        aiSummary: analysis.summary.overview,
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

    Provide a comprehensive analysis focusing on highlights and lowlights, particularly noting new deals, product launches, business lines, and upcoming challenges. Format the response as JSON with the following structure:
    {
      "summary": "Brief introduction analyzing the overall context",
      "highlights": [
        {
          "title": "string",
          "description": "One sentence highlighting a positive development, deal, or metric"
        }
      ],
      "lowlights": [
        {
          "title": "string",
          "description": "One sentence describing a challenge, risk, or concern"
        }
      ],
      "conclusion": "Brief conclusion synthesizing the key takeaways",
      "sentiment": {
        "score": number, // 0 to 1
        "label": "bullish" | "neutral" | "bearish"
      }
    }

    Ensure both highlights and lowlights sections contain exactly 5 items each, with special attention to new business developments and future outlook.`;
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
