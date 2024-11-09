import { MarketTime, TranscriptStatus } from "@prisma/client";

export type ProcessedTranscript = {
  id: string;
  title: string | null;
  scheduledAt: Date;
  status: TranscriptStatus;
  MarketTime: MarketTime;
  quarter: number | null;
  year: number | null;
  company: {
    id: string;
    symbol: string;
    name: string | null;
    logo: string | null;
  } | null;
  marketTime: MarketTime; // This is the transformed version for frontend compatibility
};

// Optional: You might want to add these helper types as well
export type Company = {
  id: string;
  symbol: string;
  name: string | null;
  logo: string | null;
};

export type WeekViewResponse = {
  transcripts: ProcessedTranscript[];
};
