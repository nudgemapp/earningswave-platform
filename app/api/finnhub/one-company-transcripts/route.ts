import { PrismaClient } from "@prisma/client";

async function fetchAndMapEarningsData() {
  const prisma = new PrismaClient();

  try {
    console.log("Fetching and mapping earnings data");
  } catch (error) {
    console.error(
      "Error processing data:",
      error instanceof Error ? error.message : "Unknown error"
    );
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndMapEarningsData();
