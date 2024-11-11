import { MarketTime, TranscriptStatus } from "@prisma/client";

export interface Company {
  id: string;
  symbol: string;
  name: string | null;
  logo: string | null;
}

export interface ProcessedTranscript {
  id: string;
  title: string | null;
  scheduledAt: Date;
  quarter: number | null;
  year: number | null;
  MarketTime: MarketTime;
  status: TranscriptStatus;
  epsActual: number | null;
  epsEstimate: number | null;
  revenueActual: number | null;
  revenueEstimate: number | null;
  company: Company;
}

export interface DayViewResponse {
  transcripts: ProcessedTranscript[];
}
