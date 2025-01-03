import { create } from "zustand";

type AuthModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
