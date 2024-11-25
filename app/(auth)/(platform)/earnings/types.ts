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
  MarketTime: MarketTime;
  transcriptStatus: TranscriptStatus;
  epsActual: number | null;
  epsEstimate: number | null;
  revenueActual: number | null;
  revenueEstimate: number | null;
  company: Company;
}

export interface DayViewResponse {
  transcripts: ProcessedTranscript[];
}

export interface StockData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  gain: boolean;
  marketSession: "pre" | "regular" | "post";
}

export interface AlphaVantageDaily {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

export interface AlphaVantageIntraday extends AlphaVantageDaily {}

export interface FinnhubTrade {
  p: number; // Last price
  s: string; // Symbol
  t: number; // Timestamp
  v: number; // Volume
}

export interface WebSocketMessage {
  data: FinnhubTrade[];
  type: string;
}
