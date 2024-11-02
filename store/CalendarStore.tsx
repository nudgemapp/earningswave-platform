import { create } from "zustand";

interface CalendarState {
  currentDate: Date;
  view: "week" | "month";
  setCurrentDate: (date: Date) => void;
  setView: (view: "week" | "month") => void;
  navigateWeek: (direction: number) => void;
  navigateMonth: (direction: number) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
  view: "week",
  setCurrentDate: (date) => {
    set({ currentDate: date });
    updateURL(date);
  },
  setView: (view) => {
    set({ view });
    updateURL(undefined, view);
  },
  navigateWeek: (direction) =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setDate(newDate.getDate() + direction * 7);
      updateURL(newDate);
      return { currentDate: newDate };
    }),
  navigateMonth: (direction) =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setMonth(newDate.getMonth() + direction);
      updateURL(newDate);
      return { currentDate: newDate };
    }),
}));

function updateURL(date?: Date, view?: "week" | "month") {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const currentDate =
    date || new Date(url.searchParams.get("date") || new Date());

  const params = {
    year: currentDate.getFullYear().toString(),
    month: (currentDate.getMonth() + 1).toString(),
    week: getWeekNumber(currentDate).toString(),
    date: currentDate.toISOString(),
    view: view || url.searchParams.get("view") || "week",
  };

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  window.history.replaceState({}, "", url.toString());
}

function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
