import { MarketTime, TranscriptStatus } from "@prisma/client";

interface Company {
  id: string;
  symbol: string;
  name: string;
  logo: string | null;
}

export interface ProcessedTranscript {
  id: string;
  title: string | null;
  scheduledAt: Date;
  status: TranscriptStatus;
  MarketTime: MarketTime;
  quarter: number | null;
  year: number | null;
  epsActual: number | null;
  epsEstimate: number | null;
  revenueActual: number | null;
  revenueEstimate: number | null;
  company: Company;
}

export interface DayViewResponse {
  transcripts: ProcessedTranscript[];
}
