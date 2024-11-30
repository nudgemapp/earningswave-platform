import { NextResponse } from 'next/server';
import { getFinnhubWS } from "@/services/FinnhubWebSocketService";

export async function GET() {
  if (!process.env.FINNHUB_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  getFinnhubWS();
  
  return NextResponse.json({ 
    status: 'WebSocket service initialized'
  });
} 