import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import pLimit from "p-limit";

export async function GET() {
  const prisma = new PrismaClient();
  const BATCH_SIZE = 100; // Process 100 records at a time

  try {
    // Find all transcripts with MarketTime DMH or UNKNOWN
    const transcriptsToUpdate = await prisma.transcript.findMany({
      select: {
        id: true,
        MarketTime: true,
        scheduledAt: true,
      },
    });

    console.log(`Found ${transcriptsToUpdate.length} transcripts to update`);

    // // Process in batches
    // let updatedCount = 0;
    // let bmoCount = 0;
    // let amcCount = 0;

    for (let i = 0; i < transcriptsToUpdate.length; i += BATCH_SIZE) {
      const batch = transcriptsToUpdate.slice(i, i + BATCH_SIZE);

      // Process each transcript in the batch
      //   const updates = batch.map((transcript) => {
      //     const utcHour = transcript.scheduledAt.getUTCHours();
      //     const utcMinutes = transcript.scheduledAt.getUTCMinutes();
      //     const timeInUTC = utcHour + utcMinutes / 60;
      //     const newMarketTime = timeInUTC < 16 ? "BMO" : "AMC";

      //     if (newMarketTime === "BMO") bmoCount++;
      //     else amcCount++;

      //     // Return the prisma update operation
      //     return prisma.transcript.update({
      //       where: { id: transcript.id },
      //       data: { MarketTime: newMarketTime },
      //     });
      //   });

      //   // Execute all updates in this batch
      //   await prisma.$transaction(updates);

      //   updatedCount += batch.length;
      //   console.log(
      //     `Progress: ${updatedCount}/${transcriptsToUpdate.length} records processed`
      //   );
    }

    console.log("\nUpdate Summary:");
    // console.log(`Total transcripts updated: ${updatedCount}`);
    // console.log(`Changed to BMO: ${bmoCount}`);
    // console.log(`Changed to AMC: ${amcCount}`);

    return NextResponse.json({
      message: "Update complete",
      //   totalUpdated: updatedCount,
      //   bmoCount,
      //   amcCount,
    });
  } catch (error) {
    console.error("Error updating transcripts:", error);
    return NextResponse.json(
      {
        error: "Failed to update transcripts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
