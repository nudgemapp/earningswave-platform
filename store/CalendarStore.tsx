import { create } from "zustand";

interface CalendarState {
  currentDate: Date;
  view: "week" | "month";
  setCurrentDate: (date: Date) => void;
  setView: (view: "week" | "month") => void;
  navigateMonth: (direction: number) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
  view: "week",
  setCurrentDate: (date) => set({ currentDate: date }),
  setView: (view) => set({ view }),
  navigateMonth: (direction) =>
    set((state) => ({
      currentDate: new Date(
        state.currentDate.getFullYear(),
        state.currentDate.getMonth() + direction,
        1
      ),
    })),
}));
