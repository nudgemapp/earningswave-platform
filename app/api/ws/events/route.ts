import { NextRequest } from 'next/server';
import { getFinnhubWS } from "@/services/FinnhubWebSocketService";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return new Response('Symbol is required', { status: 400 });
  }

  const finnhubWS = getFinnhubWS();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  let isStreamActive = true;

  // Handle client disconnect
  req.signal.addEventListener('abort', () => {
    isStreamActive = false;
    finnhubWS.unsubscribe(symbol);
    writer.close().catch(console.error);
  });

  const tradeBuffer: any[] = [];
  let flushTimeout: NodeJS.Timeout | null = null;

  const safeWrite = async (data: string) => {
    if (!isStreamActive) return;
    try {
      await writer.write(encoder.encode(`data: ${data}\n\n`));
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('WritableStream is closed')) {
        isStreamActive = false;
        finnhubWS.unsubscribe(symbol);
      } else {
        console.error('Error writing to stream:', error);
      }
    }
  };

  const flushBuffer = async () => {
    if (tradeBuffer.length === 0 || !isStreamActive) return;

    try {
      await safeWrite(JSON.stringify({
        type: 'trade',
        data: [...tradeBuffer]
      }));
      tradeBuffer.length = 0; // Clear buffer
    } catch (error) {
      console.error('Error flushing buffer:', error);
    }
  };

  const messageHandler = (data: any) => {
    if (!isStreamActive) return;

    if (data.type === 'trade' && data.data) {
      tradeBuffer.push(...data.data);
      
      if (tradeBuffer.length >= 100) {
        flushBuffer();
      } else if (!flushTimeout) {
        flushTimeout = setTimeout(() => {
          flushBuffer();
          flushTimeout = null;
        }, 1000);
      }
    }
  };

  finnhubWS.events.on('message', messageHandler);
  await finnhubWS.subscribe(symbol);

  const cleanup = () => {
    isStreamActive = false;
    if (flushTimeout) clearTimeout(flushTimeout);
    finnhubWS.events.removeListener('message', messageHandler);
    finnhubWS.unsubscribe(symbol);
  };

  req.signal.addEventListener('abort', cleanup);

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 