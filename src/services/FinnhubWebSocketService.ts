import WebSocket from 'ws';
import { EventEmitter } from 'events';

export class FinnhubWebSocketService {
  private ws: WebSocket | null = null;
  private readonly apiKey: string;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly initialRetryDelay = 1000;
  private readonly maxRetryDelay = 30000;
  public events: EventEmitter;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
    this.events = new EventEmitter();
    this.connect();
  }

  private connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws?.close();
      this.ws = new WebSocket(`wss://ws.finnhub.io?token=${this.apiKey}`);

      this.ws.on('open', () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.events.emit('connected');
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          this.events.emit('message', message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      this.ws.on('close', () => {
        console.log('WebSocket disconnected');
        this.events.emit('disconnected');
        this.handleReconnect();
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.events.emit('error', error);
      });

    } catch (error) {
      console.error('Failed to connect:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.events.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    const delay = Math.min(
      this.initialRetryDelay * Math.pow(2, this.reconnectAttempts),
      this.maxRetryDelay
    );

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  public subscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    }
  }

  public unsubscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }

  public close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create singleton instance
export const finnhubWS = new FinnhubWebSocketService(); 