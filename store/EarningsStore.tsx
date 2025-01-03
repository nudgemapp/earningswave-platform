import { create } from "zustand";
import { WatchlistEntry } from "@prisma/client";
import { ProcessedTranscript } from "@/app/(auth)/(platform)/(calendar)/earnings/types";

interface SelectedCompany {
  companyId?: string;
  symbol?: string;
  transcriptId?: string | null;
}

interface EarningsState {
  selectedCompany: SelectedCompany | null;
  setSelectedCompany: (company: SelectedCompany | null) => void;
  selectedFutureEarnings: ProcessedTranscript | null;
  setSelectedFutureEarnings: (report: ProcessedTranscript | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  showWatchlist: boolean;
  setShowWatchlist: (show: boolean) => void;
  watchlistItems: WatchlistEntry[];
  selectedTranscript: string | null;
  setSelectedTranscript: (transcriptId: string | null) => void;
  selectedAiTranscript: string | null;
  setSelectedAiTranscript: (transcriptId: string | null) => void;
}

export const useEarningsStore = create<EarningsState>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) =>
    set({
      selectedCompany:
        company && (company.companyId || company.symbol) ? company : null,
      selectedFutureEarnings: null,
      showWatchlist: false,
    }),
  selectedFutureEarnings: null,
  setSelectedFutureEarnings: (report) =>
    set({
      selectedFutureEarnings: report,
      selectedCompany: null,
      showWatchlist: false,
    }),
  selectedDate: null,
  setSelectedDate: (date) =>
    set({
      selectedDate: date,
      showWatchlist: false,
    }),
  showWatchlist: false,
  setShowWatchlist: (show) =>
    set({
      showWatchlist: show,
      ...(show
        ? {
            selectedCompany: null,
            selectedFutureEarnings: null,
          }
        : {}),
    }),
  watchlistItems: [],
  selectedTranscript: null,
  setSelectedTranscript: (transcriptId) =>
    set({
      selectedTranscript: transcriptId,
      showWatchlist: false,
    }),
  selectedAiTranscript: null,
  setSelectedAiTranscript: (transcriptId) =>
    set({
      selectedAiTranscript: transcriptId,
    }),
}));
