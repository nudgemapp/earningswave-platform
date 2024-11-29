import { PrismaClient } from "@prisma/client";

async function fetchAndMapEarningsData() {
  const prisma = new PrismaClient();

  try {
  } catch (error) {
    console.error("Error processing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndMapEarningsData();
