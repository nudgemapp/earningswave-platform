import { create } from "zustand";
import { EarningsReport } from "@prisma/client";

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
}

export const useEarningsStore = create<EarningsState>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) =>
    set({
      selectedCompany: company,
      selectedFutureEarnings: null, // Clear future earnings when selecting a company
    }),
  selectedFutureEarnings: null,
  setSelectedFutureEarnings: (report) =>
    set({
      selectedFutureEarnings: report,
      selectedCompany: null, // Clear selected company when selecting future earnings
    }),
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
