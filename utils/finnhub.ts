import { FinnhubTranscript } from "@/app/(auth)/(platform)/earnings/types";

const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";

const finnhubClient = new finnhub.DefaultApi();

export const getFinnhubTicker = (ticker: string) => {
  return finnhubClient.symbolSearch(ticker);
};

export const getTranscript = (
  transcriptId: string
): Promise<FinnhubTranscript> => {
  return new Promise((resolve, reject) => {
    finnhubClient.transcripts(
      transcriptId,
      (error: any, data: FinnhubTranscript, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};
