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
