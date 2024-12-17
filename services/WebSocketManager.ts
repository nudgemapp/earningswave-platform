import WebSocket from "ws";

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 5000;
  private isConnecting = false;

  private constructor() {
    console.log("[WebSocketManager] Initializing");
    this.connect();
  }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      console.log("[WebSocketManager] Creating new instance");
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private async connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      console.log("[WebSocketManager] Connecting to Finnhub");
      this.ws = new WebSocket(
        `wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`
      );

      this.ws.onopen = () => {
        console.log("[WebSocketManager] Connected successfully");
        this.reconnectAttempts = 0;
        this.isConnecting = false;

        // Resubscribe to all symbols
        Array.from(this.subscribers.keys()).forEach((symbol) => {
          console.log(`[WebSocketManager] Resubscribing to ${symbol}`);
          this.ws?.send(JSON.stringify({ type: "subscribe", symbol }));
        });
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data.toString());
        if (data.type === "trade" && data.data?.[0]) {
          const trade = data.data[0];
          const symbol = trade.s;
          console.log(
            `[WebSocketManager] Received trade for ${symbol}: ${trade.p}`
          );

          const subscribers = this.subscribers.get(symbol);
          subscribers?.forEach((callback) => callback(data));
        }
      };

      this.ws.onclose = () => {
        console.log("[WebSocketManager] Disconnected");
        this.isConnecting = false;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(
            `[WebSocketManager] Reconnecting attempt ${this.reconnectAttempts}`
          );
          setTimeout(() => this.connect(), this.reconnectTimeout);
        }
      };

      this.ws.onerror = (error) => {
        console.error("[WebSocketManager] Error:", error);
      };
    } catch (error) {
      console.error("[WebSocketManager] Connection error:", error);
      this.isConnecting = false;
    }
  }

  async subscribe(
    symbol: string,
    callback: (data: any) => void
  ): Promise<void> {
    console.log(`[WebSocketManager] Subscribing to ${symbol}`);

    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }

    this.subscribers.get(symbol)?.add(callback);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "subscribe", symbol }));
      console.log(`[WebSocketManager] Sent subscription for ${symbol}`);
    }
  }

  unsubscribe(symbol: string, callback: (data: any) => void) {
    console.log(`[WebSocketManager] Unsubscribing from ${symbol}`);
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(symbol);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
          console.log(`[WebSocketManager] Sent unsubscription for ${symbol}`);
        }
      }
    }
  }
}

export default WebSocketManager;
