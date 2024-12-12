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

interface CompanyType {
  id: string;
  symbol: string;
  name: string | null;
  logo: string | null;
  description: string;
  currency: string;
  marketCapitalization: number | null;
  weburl: string | null;
  finnhubIndustry: string | null;
  exchange: string | null;
}
export interface FilterState {
  sectors: string[];
  marketCap: string[];
  watchlist: string[];
}

export interface EarningsEntry {
  id: string;
  symbol: string;
  quarter: number;
  year: number;
  earningsDate: string;
  earningsTime: string;
  isDateConfirmed: boolean;
  marketCap: number | null;
  totalForDay: number;
  remainingCount: number;
  company: CompanyType;
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

export interface AISummary {
  summary: {
    overview: string;
    quarterHighlights: string;
    challenges: string;
  };
  keyHighlights: Array<{
    category: string;
    title: string;
    description: string;
    impact: string;
  }>;
  performanceAnalysis: Array<{
    metric: string;
    value: string;
    analysis: string;
    trend: "positive" | "neutral" | "negative";
  }>;
  forwardGuidance: {
    outlook: string;
    keyInitiatives: string[];
    risks: string[];
  };
  sentiment: {
    score: number;
    label: "bullish" | "neutral" | "bearish";
    rationale: string;
  };
}

export interface LiveCall {
  calls: Array<{
    id: string;
    eventName: string;
    scheduledTime: string;
    quarter: number;
    year: number;
    audioUrl: string | null;
    MarketTime: MarketTime;
    status: TranscriptStatus;
  }>;
}
