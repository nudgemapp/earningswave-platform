import { MarketTiming } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type ProcessedTranscript = {
  id: number;
  date: Date;
  title: string;
  company: {
    id: number;
    symbol: string;
    name: string;
    logo: string | null;
  } | null;
};

export type ProcessedReport = {
  fiscalQuarter: string;
  id: string;
  symbol: string;
  name: string;
  reportDate: Date;
  fiscalDateEnding: Date;
  estimate: number | null;
  currency: string;
  marketTiming: MarketTiming | null;
  lastYearEPS: number | null;
  lastYearReportDate: Date | null;
  lastYearRevenue: number | null;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
  company: {
    id: number;
    symbol: string;
    name: string;
    marketCap: Decimal | null;
    price: Decimal | null;
    revenue: Decimal | null;
    logoId: number | null;
    createdAt: Date;
    updatedAt: Date;
    logo: string | null;
  };
};

export type HistoricalEarnings = {
  quarter: string;
  date: string;
  revenueBeat: number;
  epsBeat: number;
  revenue: number;
  eps: number;
};

export type EnhancedReport = {
  quarter: string;
  year: number;
  date: string;
  revenue: number;
  eps: number;
  revenueBeat: number;
  epsBeat: number;
};

export type EarningsCallTranscriptWithCompany = {
  id: number;
  date: Date;
  title: string;
  company: {
    id: number;
    symbol: string;
    name: string;
    logo: {
      data: Buffer | null;
    } | null;
  } | null;
};

export type EarningsReportWithCompany = {
  id: string;
  symbol: string;
  name: string;
  reportDate: Date;
  fiscalDateEnding: Date;
  estimate: number | null;
  currency: string;
  marketTiming: MarketTiming | null;
  lastYearEPS: number | null;
  lastYearReportDate: Date | null;
  companyId: number;
  company: {
    id: number;
    symbol: string;
    name: string;
    logo: {
      data: Buffer | null;
    } | null;
  } | null;
};

//finhub transcript types
export interface TranscriptParticipant {
  description: string;
  name: string;
  role: string;
}

export interface TranscriptSpeech {
  name: string;
  session: string;
  speech: string;
}

export interface FinnhubTranscript {
  audio: string;
  id: string;
  participant: TranscriptParticipant[];
  quarter: number;
  symbol: string;
  time: number;
  title: string;
  transcript: TranscriptSpeech[];
  year: number;
}
