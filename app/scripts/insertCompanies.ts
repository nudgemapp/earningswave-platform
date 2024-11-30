import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

interface FinnhubCompanyProfile {
  address?: string;
  city?: string;
  country?: string;
  currency?: string;
  cusip?: string;
  sedol?: string;
  description?: string;
  employeeTotal?: string;
  exchange?: string;
  ggroup?: string;
  gind?: string;
  gsector?: string;
  gsubind?: string;
  ipo?: string;
  isin?: string;
  marketCapitalization?: number;
  naics?: string;
  naicsNationalIndustry?: string;
  naicsSector?: string;
  naicsSubsector?: string;
  name?: string;
  phone?: string;
  shareOutstanding?: number;
  state?: string;
  ticker?: string;
  weburl?: string;
  logo?: string;
  finnhubIndustry?: string;
}

// First, let's create an interface that matches your Prisma schema
interface CompanyCreate {
  currency: string;
  description: string;
  displaySymbol: string;
  mic: "XNAS" | "XNYS";  // This is an enum in your schema
  symbol: string;
  type: string;
  country?: string;
  exchange?: string;
  ipo?: Date | null;
  marketCapitalization?: number | null;
  name?: string;
  phone?: string;
  sharesOutstanding?: number | null;
  weburl?: string;
  logo?: string;
  finnhubIndustry?: string;
  figi?: string | null;
  isin?: string | null;
  shareClassFIGI?: string | null;
  symbol2?: string | null;
}

async function getCompanyProfile(symbol: string): Promise<CompanyCreate | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json() as FinnhubCompanyProfile;
    
    if (!Object.keys(data).length) {
      console.log(`No data found for ${symbol}`);
      return null;
    }

    // Return only the fields that match your schema
    return {
      currency: data.currency || "USD",
      description: data.description || symbol,
      displaySymbol: data.ticker || symbol,
      mic: await determineExchangeMIC(data.exchange || ""),
      symbol: data.ticker || symbol,
      type: "Common Stock",
      country: data.country || undefined,
      exchange: data.exchange || undefined,
      ipo: data.ipo ? new Date(data.ipo) : undefined,
      marketCapitalization: data.marketCapitalization || undefined,
      name: data.name || symbol,
      phone: data.phone || undefined,
      sharesOutstanding: data.shareOutstanding || undefined,
      weburl: data.weburl || undefined,
      logo: data.logo || undefined,
      finnhubIndustry: data.finnhubIndustry || undefined,
      // Optional fields from your schema
      figi: undefined,
      isin: data.isin || undefined,
      shareClassFIGI: undefined,
      symbol2: undefined
    };
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error);
    return null;
  }
}

async function determineExchangeMIC(exchange: string): Promise<"XNAS" | "XNYS"> {
  // Simple logic to determine MIC based on exchange name
  return exchange.includes("NASDAQ") ? "XNAS" : "XNYS";
}

async function main() {
  try {
    // Get all unique symbols from earnings table
    const uniqueSymbols = await prisma.earnings.findMany({
      select: {
        symbol: true,
      },
      distinct: ['symbol'],
    });

    console.log(`Found ${uniqueSymbols.length} unique symbols to process`);

    for (const { symbol } of uniqueSymbols) {
      try {
        // Get company profile from Finnhub first to determine MIC
        const profile = await getCompanyProfile(symbol);
        
        if (!profile) {
          console.log(`No profile data available for ${symbol}, skipping...`);
          continue;
        }

        // Check if company already exists using both symbol and mic
        const existingCompany = await prisma.company.findFirst({
          where: {
            symbol: profile.symbol,
            mic: profile.mic
          },
        });

        if (existingCompany) {
          console.log(`Company ${symbol} already exists for exchange ${profile.mic}, skipping...`);
          continue;
        }

        // Create new company record
        await prisma.company.create({
          data: profile
        });

        console.log(`Successfully added company ${symbol} for exchange ${profile.mic}`);
        
        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing company ${symbol}:`, error);
        continue; // Skip to next company if there's an error
      }
    }

    console.log("Finished processing all companies");
  } catch (error) {
    console.error("Main process error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
