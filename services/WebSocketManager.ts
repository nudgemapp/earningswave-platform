import WebSocket from "ws";
import { EventEmitter } from "events";

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private eventEmitter = new EventEmitter();
  private subscribedSymbols: Set<string> = new Set();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private async connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(
        `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
      );

      this.ws.on("open", () => {
        console.log(
          "WebSocket connected - Current subscriptions:",
          Array.from(this.subscribedSymbols)
        );
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Resubscribe to all symbols
        this.subscribedSymbols.forEach((symbol) => {
          this.ws?.send(JSON.stringify({ type: "subscribe", symbol }));
        });
      });

      this.ws.on("message", (data: WebSocket.Data) => {
        console.log("data", data);
        try {
          const message = JSON.parse(data.toString());
          if (message.type === "trade" && Array.isArray(message.data)) {
            this.eventEmitter.emit("trade", message);
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      });

      this.ws.on("close", () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(
            `WebSocket closed, attempt ${this.reconnectAttempts + 1}/${
              this.maxReconnectAttempts
            }`
          );
          this.scheduleReconnect();
        } else {
          console.log("Max reconnection attempts reached");
        }
      });

      this.ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectDelay);
    }
  }

  async subscribe(symbol: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    if (!this.subscribedSymbols.has(symbol)) {
      console.log(`Subscribing to ${symbol}`);
      this.subscribedSymbols.add(symbol);
      this.ws?.send(JSON.stringify({ type: "subscribe", symbol }));
    }
  }

  unsubscribe(symbol: string) {
    if (this.subscribedSymbols.has(symbol)) {
      console.log(`Unsubscribing from ${symbol}`);
      this.subscribedSymbols.delete(symbol);
      this.ws?.send(JSON.stringify({ type: "unsubscribe", symbol }));
    }
  }

  onTrade(callback: (data: any) => void) {
    this.eventEmitter.on("trade", callback);
    return () => this.eventEmitter.off("trade", callback);
  }
}

export default WebSocketManager;
