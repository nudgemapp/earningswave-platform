import { MarketTime, TranscriptStatus } from "@prisma/client";

interface Company {
  id: string;
  symbol: string;
  name: string;
  logo: string | null;
}

export interface ProcessedTranscript {
  id: string;
  title: string;
  scheduledAt: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  MarketTime: "BMO" | "AMC" | "DMH" | "UNKNOWN";
  quarter: number;
  marketTime: string;
  totalForDay?: number;
  company: Company;
}

export interface WeekViewResponse {
  transcripts: ProcessedTranscript[];
}
