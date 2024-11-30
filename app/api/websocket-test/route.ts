import { NextResponse } from "next/server";
import { getFinnhubWS } from "@/services/FinnhubWebSocketService";

let isInitialized = false;

export async function GET() {
  try {
    if (!isInitialized) {
      const finnhubWS = getFinnhubWS();
      
      finnhubWS.events.removeAllListeners();
      
      finnhubWS.events.on("connected", () => {
        console.log("🟢 Connected to Finnhub WebSocket");
      });

      finnhubWS.events.on("message", (data) => {
        console.log("📨 Trade data:", JSON.stringify(data, null, 2));
      });

      finnhubWS.events.on("disconnected", (details) => {
        console.log("🔴 Disconnected from Finnhub WebSocket:", details);
      });

      finnhubWS.events.on("error", (error) => {
        console.error("❌ WebSocket error:", error);
      });

      // Start with just one symbol for testing
      await finnhubWS.subscribe('AAPL');
      
      isInitialized = true;
    }

    return NextResponse.json({ 
      status: "WebSocket connection initialized",
      message: "Check your server console for real-time updates",
      subscribedSymbols: ['AAPL']
    });
  } catch (error) {
    console.error("Failed to initialize WebSocket:", error);
    return NextResponse.json({ 
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 