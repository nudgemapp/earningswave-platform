"use client";

import NavBar from "@/components/NavBar";
import CalendarNavbar from "@/components/CalendarNavbar";
import WeekView from "@/components/WeekView";
import MonthView from "@/components/MonthView";
import { useCalendarStore } from "@/store/CalendarStore";
import { useEmailModal } from "@/store/EmailModalStore";
import { useEffect } from "react";

export default function EarningsPage() {
  const { currentDate, view, setCurrentDate, setView, navigateMonth } =
    useCalendarStore();
  const emailModal = useEmailModal();

  useEffect(() => {
    const hasModalBeenShown = localStorage.getItem("emailModalShown");

    if (!hasModalBeenShown) {
      const timer = setTimeout(() => {
        emailModal.onOpen();
        localStorage.setItem("emailModalShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [emailModal]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + i);
    return date;
  });

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CalendarNavbar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          navigateMonth={navigateMonth}
          view={view}
          setView={setView}
        />
        <div className="flex-1 overflow-y-auto">
          {view === "week" ? (
            <WeekView weekDays={weekDays} weekDates={weekDates} />
          ) : (
            <MonthView currentDate={currentDate} />
          )}
        </div>
      </div>
    </div>
  );
}
