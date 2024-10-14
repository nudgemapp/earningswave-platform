import { create } from "zustand";

interface EmailModalInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useEmailModal = create<EmailModalInterface>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
