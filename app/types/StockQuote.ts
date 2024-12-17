export type StockQuote = {
  c: number;
  h: number;
  d: number;
  dp: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

export interface StockData {
  date: string;
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  gain: boolean;
  marketSession: "pre" | "regular" | "post";
}

export interface RealtimeStockData {
  realtimePrice: number;
  lastUpdate: string;
  data: StockData[];
}

export interface FinnhubCandle {
  c: number[]; // close prices
  h: number[]; // high prices
  l: number[]; // low prices
  o: number[]; // open prices
  s: string; // status
  t: number[]; // timestamps
  v: number[]; // volume
}
