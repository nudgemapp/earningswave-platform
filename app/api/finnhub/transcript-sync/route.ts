import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import pLimit from "p-limit";

interface FinnhubTranscript {
  id: string;
  quarter: number;
  symbol: string;
  time: string;
  title: string;
  year: number;
}

interface TranscriptWithCompanyId extends FinnhubTranscript {
  companyId: string;
}

interface TranscriptResults {
  totalCompaniesChecked: number;
  upcomingTranscripts: TranscriptWithCompanyId[];
  transcriptDetails: TranscriptDetail[];
  errors: string[];
  apiResponses: number;
}

interface TranscriptParticipant {
  name: string;
  role?: string | null;
  description?: string | null;
}

interface TranscriptSpeech {
  name: string;
  speech: string[];
  session?: string | null;
}

interface TranscriptDetail extends TranscriptWithCompanyId {
  fullTranscript: {
    audio?: string;
    transcript: TranscriptSpeech[];
    participant: TranscriptParticipant[];
  };
}

const prisma = new PrismaClient();
const limit = pLimit(20); // Reduced to 20 concurrent requests (safe margin below 30/sec)
const RETRY_DELAY = 100; // 100ms delay between retries

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to fetch with retry
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        console.log(
          `Rate limited, attempt ${
            i + 1
          }/${retries}, waiting ${RETRY_DELAY}ms...`
        );
        await delay(RETRY_DELAY);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(RETRY_DELAY);
    }
  }
}

export async function GET() {
  try {
    // Get all companies
    const companies = await prisma.company.findMany({
      select: {
        symbol: true,
        id: true,
        mic: true,
      },
    });

    console.log(`Found ${companies.length} companies to check`);
    console.log("Sample companies:", companies.slice(0, 5));

    // Get dates for the past week
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Format dates for logging
    console.log("Checking transcripts between:", {
      lastWeek: lastWeek.toISOString(),
      today: today.toISOString(),
    });

    const results: TranscriptResults = {
      totalCompaniesChecked: 0,
      upcomingTranscripts: [],
      transcriptDetails: [],
      errors: [],
      apiResponses: 0,
    };

    console.log(results);

    // Process companies in parallel
    const fetchPromises = companies.map((company) =>
      limit(async () => {
        try {
          // Format symbol based on exchange (handle .TO, .L etc)
          const symbol = company.symbol;

          const response = await fetch(
            `https://finnhub.io/api/v1/stock/transcripts/list?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`,
            { next: { revalidate: 3600 } }
          );

          results.apiResponses++;

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Log every 100th response to avoid console spam
          if (results.apiResponses % 100 === 0) {
            console.log(`Processed ${results.apiResponses} companies`);
            console.log("Sample response:", { symbol, data });
          }

          const recentTranscripts = data.transcripts?.filter(
            (t: FinnhubTranscript) => {
              const transcriptDate = new Date(t.time);
              transcriptDate.setHours(0, 0, 0, 0);
              return transcriptDate >= lastWeek && transcriptDate <= today;
            }
          );

          if (recentTranscripts?.length > 0) {
            console.log(
              `\n=== Found ${recentTranscripts.length} transcripts for ${company.symbol} ===`
            );
            recentTranscripts.forEach((t: FinnhubTranscript) => {
              console.log(
                `${company.symbol}: ${t.title} scheduled for ${t.time}`
              );
            });
            console.log("=====================================\n");

            results.upcomingTranscripts.push(
              ...recentTranscripts.map(
                (t: FinnhubTranscript): TranscriptWithCompanyId => ({
                  ...t,
                  companyId: company.id,
                })
              )
            );
          }

          results.totalCompaniesChecked++;
        } catch (error) {
          const errorMsg = `Error processing ${company.symbol}: ${error}`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      })
    );

    await Promise.all(fetchPromises);

    // After collecting all upcoming transcripts, fetch their details
    console.log("Fetching details for found transcripts...");

    // Add daily summary logging
    const dailyTranscripts = results.upcomingTranscripts.reduce(
      (acc: Record<string, string[]>, transcript) => {
        const date = new Date(transcript.time).toISOString().split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(`${transcript.symbol}: ${transcript.title}`);
        return acc;
      },
      {}
    );

    console.log("\n=== DAILY TRANSCRIPT SUMMARY ===");
    Object.entries(dailyTranscripts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, transcripts]) => {
        console.log(`\n${date} (${transcripts.length} transcripts):`);
        transcripts.forEach((t) => console.log(`- ${t}`));
      });
    console.log("\n===============================\n");

    // Process in smaller batches
    const BATCH_SIZE = 20;
    for (let i = 0; i < results.upcomingTranscripts.length; i += BATCH_SIZE) {
      const batch = results.upcomingTranscripts.slice(i, i + BATCH_SIZE);

      console.log(
        `Processing batch ${i / BATCH_SIZE + 1}, transcripts ${i + 1} to ${
          i + batch.length
        }`
      );

      const batchPromises = batch.map((transcript) =>
        limit(async () => {
          try {
            // Add small delay before each request
            await delay(50); // 50ms delay between individual requests

            const transcriptData = await fetchWithRetry(
              `https://finnhub.io/api/v1/stock/transcripts?id=${transcript.id}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
            );

            console.log(`Transcript details for ${transcript.symbol}:`, {
              id: transcript.id,
              symbol: transcript.symbol,
              time: transcript.time,
              data: transcriptData,
            });

            results.transcriptDetails.push({
              ...transcript,
              fullTranscript: transcriptData,
            });
          } catch (error) {
            console.error(`Error fetching transcript ${transcript.id}:`, error);
            results.errors.push(
              `Failed to fetch transcript ${transcript.id}: ${error}`
            );
          }
        })
      );

      await Promise.all(batchPromises);

      // Add delay between batches
      if (i + BATCH_SIZE < results.upcomingTranscripts.length) {
        console.log("Waiting between batches...");
        await delay(200); // 200ms delay between batches
      }
    }

    // After collecting transcript details, save them to the database
    console.log("Saving transcript details to database...");
    const savedTranscripts = [];

    for (const transcript of results.transcriptDetails) {
      try {
        const marketTime = (() => {
          const hour = new Date(transcript.time).getHours();
          if (hour < 9) return "BMO";
          return "AMC";
        })();

        // Create a date without time component
        const scheduledDate = new Date(transcript.time);
        scheduledDate.setHours(0, 0, 0, 0);

        const savedTranscript = await prisma.transcript.upsert({
          where: {
            companyId_scheduledAt: {
              companyId: transcript.companyId,
              scheduledAt: scheduledDate,
            },
          },
          update: {
            title: transcript.title,
            quarter: transcript.quarter || null,
            year: transcript.year || null,
            audioUrl: transcript.fullTranscript.audio || null,
            MarketTime: marketTime,
            status: "COMPLETED",
            fullText: transcript.fullTranscript.transcript
              .map((t: TranscriptSpeech) => `${t.name}: ${t.speech.join(" ")}`)
              .join("\n"),
            speakers: {
              value: JSON.parse(
                JSON.stringify(transcript.fullTranscript.participant)
              ),
            },
            participants: {
              deleteMany: {},
              create: transcript.fullTranscript.participant.map(
                (p: TranscriptParticipant) => ({
                  name: p.name,
                  role: p.role || null,
                  description: p.description || null,
                  speeches: {
                    create: transcript.fullTranscript.transcript
                      .filter((t: TranscriptSpeech) => t.name === p.name)
                      .map((t: TranscriptSpeech, idx: number) => ({
                        content: t.speech.join("\n"),
                        sequence: idx,
                        sessionType: t.session || null,
                      })),
                  },
                })
              ),
            },
          },
          create: {
            id: transcript.id,
            companyId: transcript.companyId,
            scheduledAt: scheduledDate, // Use date without time
            title: transcript.title,
            quarter: transcript.quarter || null,
            year: transcript.year || null,
            audioUrl: transcript.fullTranscript.audio || null,
            MarketTime: marketTime,
            status: "COMPLETED",
            fullText: transcript.fullTranscript.transcript
              .map((t: TranscriptSpeech) => `${t.name}: ${t.speech.join(" ")}`)
              .join("\n"),
            speakers: {
              value: JSON.parse(
                JSON.stringify(transcript.fullTranscript.participant)
              ),
            },
            participants: {
              create: transcript.fullTranscript.participant.map(
                (p: TranscriptParticipant) => ({
                  name: p.name,
                  role: p.role || null,
                  description: p.description || null,
                  speeches: {
                    create: transcript.fullTranscript.transcript
                      .filter((t: TranscriptSpeech) => t.name === p.name)
                      .map((t: TranscriptSpeech, idx: number) => ({
                        content: t.speech.join("\n"),
                        sequence: idx,
                        sessionType: t.session || null,
                      })),
                  },
                })
              ),
            },
          },
        });

        savedTranscripts.push(savedTranscript);
      } catch (error) {
        console.error(`Error saving transcript ${transcript.id}:`, error);
        results.errors.push(
          `Failed to save transcript ${transcript.id}: ${error}`
        );
      }
    }

    console.log(
      `Successfully saved ${savedTranscripts.length} transcripts to database`
    );
    console.log(`Failed to save ${results.errors.length} transcripts`);

    // After all processing, show summary of companies with transcripts
    console.log("\n=== SUMMARY OF COMPANIES WITH TRANSCRIPTS ===");
    const companiesWithTranscripts = Array.from(
      new Set(
        results.upcomingTranscripts.map(
          (t: TranscriptWithCompanyId) => t.symbol
        )
      )
    );
    console.log(
      "Companies with transcripts in the past week:",
      companiesWithTranscripts
    );
    console.log(
      `Total companies with transcripts: ${companiesWithTranscripts.length}`
    );
    console.log("============================================\n");

    // Final results
    const summary = {
      totalCompanies: companies.length,
      companiesChecked: results.totalCompaniesChecked,
      apiCallsMade: results.apiResponses,
      transcriptsFound: results.upcomingTranscripts.length,
      transcriptDetailsFetched: results.transcriptDetails.length,
      errors: results.errors.length,
      dateRange: {
        from: lastWeek.toISOString(),
        to: today.toISOString(),
      },
    };

    console.log("Summary:", summary);
    console.log("All transcript details:", results.transcriptDetails);

    if (results.errors.length > 0) {
      console.log("Errors encountered:", results.errors);
    }

    return NextResponse.json({
      message: "Transcript check completed",
      summary,
      results: results.transcriptDetails,
      errors: results.errors,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check transcripts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
