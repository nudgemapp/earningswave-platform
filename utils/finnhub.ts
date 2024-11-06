import { FinnhubTranscript } from "@/app/(auth)/(platform)/earnings/types";

const finnhub = require("finnhub");

const finnhubClient = new finnhub.DefaultApi();

// Set up API key
finnhubClient.apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";

console.log(finnhubClient.apiKey);

console.log(finnhubClient);

export const getFinnhubTicker = (ticker: string): Promise<any> => {
  console.log(ticker);
  return new Promise((resolve, reject) => {
    finnhubClient.symbolSearch(
      ticker,
      (error: any, data: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};

export const getTranscript = (
  transcriptId: string
): Promise<FinnhubTranscript> => {
  return new Promise((resolve, reject) => {
    console.log(transcriptId);
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

export const getStockSymbols = (exchange: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Starting getStockSymbols with exchange:", exchange);
      console.log("Using Finnhub client with API key:", finnhubClient.apiKey);

      if (!finnhubClient.apiKey) {
        throw new Error("Finnhub API key is not set");
      }

      console.log(finnhubClient.stockSymbols);

      finnhubClient.stockSymbols(
        exchange,
        (error: any, data: any, response: any) => {
          if (error) {
            console.error("Finnhub error in callback:", error);
            reject(error);
          } else if (!data) {
            console.error("No data received from Finnhub");
            reject(new Error("No data received from Finnhub"));
          } else {
            console.log("Finnhub success data:", data);
            resolve(data);
          }
          console.log("response");
          console.log(response);
          console.log("data");
          console.log(data);
          return data;
        }
      );
    } catch (error) {
      console.error("Error in getStockSymbols:", error);
      reject(error);
    }
  });
};
