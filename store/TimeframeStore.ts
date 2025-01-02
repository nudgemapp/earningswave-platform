import { create } from "zustand";

type TimeframeStore = {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
};

export const useTimeframeStore = create<TimeframeStore>((set) => ({
  timeframe: "1D",
  setTimeframe: (timeframe) => set({ timeframe }),
}));
