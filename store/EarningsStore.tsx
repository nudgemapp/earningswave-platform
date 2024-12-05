import { create } from "zustand";
import { WatchlistEntry } from "@prisma/client";
import { ProcessedTranscript } from "@/app/(auth)/(platform)/earnings/types";

interface SelectedCompany {
  companyId: string;
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
      selectedCompany: company,
      selectedFutureEarnings: null, // Clear future earnings
      showWatchlist: false, // Close watchlist
    }),
  selectedFutureEarnings: null,
  setSelectedFutureEarnings: (report) =>
    set({
      selectedFutureEarnings: report,
      selectedCompany: null, // Clear selected company
      showWatchlist: false, // Close watchlist
    }),
  selectedDate: null,
  setSelectedDate: (date) =>
    set({
      selectedDate: date,
      showWatchlist: false, // Close watchlist when date is selected
    }),
  showWatchlist: false,
  setShowWatchlist: (show) =>
    set({
      showWatchlist: show,
      // Clear other selections when watchlist is shown
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
      showWatchlist: false, // Close watchlist when transcript is selected
    }),
  selectedAiTranscript: null,
  setSelectedAiTranscript: (transcriptId) =>
    set({
      selectedAiTranscript: transcriptId,
    }),
}));
