import WebSocket, { RawData } from "ws";
import { EventEmitter } from "events";

export class FinnhubWebSocketService {
  unsubscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
      this.subscribedSymbols.delete(symbol);
      this.events.emit("unsubscribed", symbol);
    }
  }
  private static instance: FinnhubWebSocketService;
  private ws: WebSocket | null = null;
  private readonly apiKey: string;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly initialRetryDelay = 1000;
  private readonly maxRetryDelay = 30000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private subscribedSymbols: Set<string> = new Set();
  public events: EventEmitter;
  private isConnecting = false;
  private isReconnecting = false;

  private constructor() {
    this.apiKey = process.env.FINNHUB_API_KEY || "";
    this.events = new EventEmitter();
    // Don't automatically connect in constructor
  }

  public static getInstance(): FinnhubWebSocketService {
    if (!FinnhubWebSocketService.instance) {
      FinnhubWebSocketService.instance = new FinnhubWebSocketService();
    }
    return FinnhubWebSocketService.instance;
  }

  private async handleReconnect(): Promise<void> {
    if (this.isReconnecting) {
      console.log("Already attempting to reconnect...");
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(
        `❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached`
      );
      this.events.emit("error", new Error("Max reconnection attempts reached"));
      this.isReconnecting = false;
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.initialRetryDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxRetryDelay
    );

    console.log(
      `⏳ Attempting reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error("❌ Reconnection attempt failed:", error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.isReconnecting = false;
          this.handleReconnect();
        }
      } finally {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.isReconnecting = false;
        }
      }
    }, delay);
  }

  private async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      await this.cleanup();

      this.ws = new WebSocket(`wss://ws.finnhub.io?token=${this.apiKey}`, {
        handshakeTimeout: 10000,
        maxPayload: 1024 * 1024, // 1MB
        perMessageDeflate: false,
      });

      return new Promise((resolve, reject) => {
        const connectionTimeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
          this.cleanup();
        }, 10000);

        this.ws!.on("open", () => {
          clearTimeout(connectionTimeout);
          console.log("🟢 WebSocket connected");
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.setupHeartbeat();
          this.resubscribeWithDelay();
          resolve();
        });

        this.ws!.on("error", (error: Error) => {
          console.error("❌ WebSocket error:", error.message);
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          reject(error);
        });

        this.setupEventListeners();
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.on("message", (data: RawData) => {
      try {
        const message = JSON.parse(data.toString());
        this.events.emit("message", message);
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    });

    this.ws.on("close", (code, reason) => {
      console.log(
        `🔴 WebSocket disconnected - Code: ${code}, Reason: ${reason}`
      );
      this.events.emit("disconnected");
      this.cleanup();

      // Only attempt reconnect for unexpected closures
      if (code === 1006 || code === 1001) {
        this.handleReconnect();
      }
    });

    this.ws.on("pong", () => {
      this.lastPong = Date.now();
    });
  }

  private lastPong = Date.now();
  private setupHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Check if we haven't received a pong in more than 30 seconds
        if (Date.now() - this.lastPong > 30000) {
          console.log("❌ No pong received, reconnecting...");
          this.cleanup();
          this.connect();
          return;
        }
        this.ws.ping();
      }
    }, 15000);
  }

  private async cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      const ws = this.ws;
      this.ws = null;

      return new Promise<void>((resolve) => {
        ws.removeAllListeners();
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
        ws.terminate();
        resolve();
      });
    }
  }

  public async subscribe(symbol: string) {
    if (!symbol) return;

    this.subscribedSymbols.add(symbol);

    try {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        await this.connect();
      }

      if (this.ws?.readyState === WebSocket.OPEN) {
        console.log(`📥 Subscribing to ${symbol}`);
        this.ws.send(JSON.stringify({ type: "subscribe", symbol }));
      }
    } catch (error) {
      console.error(`❌ Error subscribing to ${symbol}:`, error);
    }
  }

  private resubscribeWithDelay() {
    if (this.subscribedSymbols.size === 0) return;

    Array.from(this.subscribedSymbols).forEach((symbol, index) => {
      setTimeout(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "subscribe", symbol }));
        }
      }, index * 500);
    });
  }

  public async shutdown(): Promise<void> {
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent further reconnections
    await this.cleanup();
    this.events.removeAllListeners();
  }
}

// Export a singleton instance
export const getFinnhubWS = () => FinnhubWebSocketService.getInstance();
