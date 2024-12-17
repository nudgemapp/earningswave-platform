import { NextRequest } from "next/server";
import WebSocketManager from "@/services/WebSocketManager";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return new Response("Symbol is required", { status: 400 });
  }

  try {
    const wsManager = WebSocketManager.getInstance();
    console.log("[WebSocket Route] Manager instance obtained");

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Send initial connection message
    const initialMessage = JSON.stringify({
      type: "connection",
      status: "connected",
      symbol: symbol,
    });
    await writer.write(new TextEncoder().encode(`data: ${initialMessage}\n\n`));

    // Create callback for this specific client
    const callback = async (data: any) => {
      try {
        if (data.data?.[0]?.s === symbol) {
          const message = JSON.stringify(data);
          await writer.write(new TextEncoder().encode(`data: ${message}\n\n`));
        }
      } catch (error) {
        console.error("[WebSocket Route] Error writing to stream:", error);
      }
    };

    // Subscribe to symbol
    await wsManager.subscribe(symbol, callback);
    console.log(`[WebSocket Route] Subscribed to ${symbol}`);

    // Cleanup on disconnect
    request.signal.addEventListener("abort", () => {
      console.log(`[WebSocket Route] Cleaning up subscription for ${symbol}`);
      wsManager.unsubscribe(symbol, callback);
      writer.close();
    });

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[WebSocket Route] Connection error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to establish connection" }),
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
