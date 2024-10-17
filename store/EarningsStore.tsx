import { create } from "zustand";

interface SelectedCompany {
  id: any;
}

interface EarningsState {
  selectedCompany: SelectedCompany;
  setSelectedCompany: (company: SelectedCompany) => void;
}

// Default company ID (replace with an actual ID from your database)
const DEFAULT_COMPANY_ID = "670f141fc4ca8ac376a21884";

export const useEarningsStore = create<EarningsState>((set) => ({
  selectedCompany: { id: DEFAULT_COMPANY_ID },
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}));
