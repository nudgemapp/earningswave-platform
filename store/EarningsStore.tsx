import { create } from "zustand";
import { EarningsReport, WatchlistEntry } from "@prisma/client";

interface SelectedCompany {
  id: any | null;
}

interface EarningsState {
  selectedCompany: SelectedCompany | null;
  setSelectedCompany: (company: SelectedCompany | null) => void;
  selectedFutureEarnings: EarningsReport | null;
  setSelectedFutureEarnings: (report: EarningsReport | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  showWatchlist: boolean;
  setShowWatchlist: (show: boolean) => void;
  watchlistItems: WatchlistEntry[];
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
}));
