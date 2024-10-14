import { create } from "zustand";

interface EarningsState {
  selectedCompany: string | null;
  setSelectedCompany: (company: string | null) => void;
}

export const useEarningsStore = create<EarningsState>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}));
