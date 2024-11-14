import { MarketTime, TranscriptStatus } from "@prisma/client";

export interface Company {
  id: string;
  symbol: string;
  name: string;
  logo: string | null;
  marketCapitalization?: number | null;
  finnhubIndustry?: string | null;
  exchange?: string | null;
  country?: string | null;
  weburl?: string | null;
  sharesOutstanding?: number | null;
}

export interface ProcessedTranscript {
  id: string;
  title: string | null;
  scheduledAt: string;
  quarter: number;
  year: number;
  MarketTime: string;
  epsActual: number | null;
  epsEstimate: number | null;
  revenueActual: number | null;
  revenueEstimate: number | null;
  company: Company;
}

export interface DayViewResponse {
  transcripts: ProcessedTranscript[];
}
