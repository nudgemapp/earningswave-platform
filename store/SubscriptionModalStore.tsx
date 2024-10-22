import { create } from "zustand";

interface SubscriptionModalInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSubscriptionModal = create<SubscriptionModalInterface>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
