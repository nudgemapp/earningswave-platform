import { NextResponse } from "next/server";
import { PrismaClient, MarketTime } from "@prisma/client";

interface TranscriptSpeech {
  name: string;
  speech: string[];
  session?: string;
}

export async function GET() {
  const prisma = new PrismaClient();
  const symbol = "KULR";

  try {
    // Get company from database
    const company = await prisma.company.findFirst({
      where: { symbol },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Fetch transcript list
    const transcriptListResponse = await fetch(
      `https://finnhub.io/api/v1/stock/transcripts/list?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const transcriptListData = await transcriptListResponse.json();

    // Process each transcript
    for (const transcriptInfo of transcriptListData.transcripts || []) {
      try {
        // Fetch full transcript details
        const transcriptResponse = await fetch(
          `https://finnhub.io/api/v1/stock/transcripts?id=${transcriptInfo.id}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
        );
        const transcriptData = await transcriptResponse.json();

        console.log(transcriptData);

        // Determine market time
        const date = new Date(transcriptInfo.time);
        const timeInET = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).format(date);

        const [hours, minutes] = timeInET.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const marketTime = timeInMinutes < 570 ? "BMO" : "AMC";

        // Create date without time component
        const scheduledDate = new Date(transcriptInfo.time);
        scheduledDate.setHours(0, 0, 0, 0);

        // Use a transaction to ensure data consistency
        await prisma.$transaction(async (tx) => {
          // First, create or update the transcript
          const transcript = await tx.transcript.upsert({
            where: {
              id: transcriptInfo.id,
            },
            update: {
              title: transcriptInfo.title,
              quarter: transcriptInfo.quarter || null,
              year: transcriptInfo.year || null,
              audioUrl: transcriptData.audio || null,
              MarketTime: marketTime as MarketTime,
              status: "COMPLETED",
              fullText: transcriptData.transcript
                ?.map(
                  (t: TranscriptSpeech) => `${t.name}: ${t.speech.join(" ")}`
                )
                .join("\n"),
              speakers: transcriptData.participant,
            },
            create: {
              id: transcriptInfo.id,
              companyId: company.id,
              scheduledAt: scheduledDate,
              title: transcriptInfo.title,
              quarter: transcriptInfo.quarter || null,
              year: transcriptInfo.year || null,
              audioUrl: transcriptData.audio || null,
              MarketTime: marketTime as MarketTime,
              status: "COMPLETED",
              fullText: transcriptData.transcript
                ?.map(
                  (t: TranscriptSpeech) => `${t.name}: ${t.speech.join(" ")}`
                )
                .join("\n"),
              speakers: transcriptData.participant,
            },
          });

          // Delete existing participants and their speeches
          await tx.participant.deleteMany({
            where: { transcriptId: transcript.id },
          });

          // Create participants and their speeches
          for (const p of transcriptData.participant) {
            const participant = await tx.participant.create({
              data: {
                transcriptId: transcript.id,
                name: p.name,
                role: p.role || null,
                description: p.description || null,
              },
            });

            // Find all speeches for this participant
            const participantSpeeches = transcriptData.transcript
              .filter((t: TranscriptSpeech) => t.name === p.name)
              .map((t: TranscriptSpeech, idx: number) => ({
                content: t.speech.join("\n"),
                sequence: idx,
                sessionType: t.session || null,
                participantId: participant.id,
              }));

            // Create speeches for this participant
            if (participantSpeeches.length > 0) {
              await tx.speech.createMany({
                data: participantSpeeches,
              });
            }
          }
        });

        console.log(`Successfully processed transcript ${transcriptInfo.id}`);
      } catch (error) {
        console.error(
          `Error processing transcript ${transcriptInfo.id}:`,
          error
        );
      }
    }

    return NextResponse.json({
      message: "Successfully processed transcripts",
      transcriptsProcessed: transcriptListData.transcripts?.length || 0,
    });
  } catch (error) {
    console.error("Error processing transcripts:", error);
    return NextResponse.json(
      { error: "Failed to process transcripts", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
