import { finnhubWS } from "@/websocket/services/FinnhubWebSocketService";

// Initialize WebSocket connection with desired symbols
const symbols = ["AAPL", "MSFT", "GOOGL"];
symbols.forEach((symbol) => finnhubWS.subscribe(symbol));

// Listen for messages
finnhubWS.events.on("message", (data) => {
  console.log("Received message:", data);
  // Handle the data as needed
});

// Handle connection events
finnhubWS.events.on("connected", () => {
  console.log("Connected to Finnhub WebSocket");
});

finnhubWS.events.on("disconnected", () => {
  console.log("Disconnected from Finnhub WebSocket");
});

finnhubWS.events.on("error", (error) => {
  console.error("WebSocket error:", error);
});

finnhubWS.close();
