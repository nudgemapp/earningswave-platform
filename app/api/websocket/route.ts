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
    console.log("WebSocket manager instance obtained");

    // Await the subscription
    await wsManager.subscribe(symbol);
    console.log(`Successfully subscribed to ${symbol}`);

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Send initial connection success message
    await writer.write(
      new TextEncoder().encode(
        `data: {"type":"connection","status":"connected","symbol":"${symbol}"}\n\n`
      )
    );

    const cleanup = wsManager.onTrade(async (data) => {
      try {
        if (data.data?.[0]?.s === symbol) {
          await writer.write(
            new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        }
      } catch (error) {
        console.error("Error writing to stream:", error);
        cleanup();
        wsManager.unsubscribe(symbol);
        writer.close();
      }
    });

    request.signal.addEventListener("abort", () => {
      console.log(`Cleaning up subscription for ${symbol}`);
      cleanup();
      wsManager.unsubscribe(symbol);
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
    console.error("WebSocket connection error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to establish connection" }),
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
