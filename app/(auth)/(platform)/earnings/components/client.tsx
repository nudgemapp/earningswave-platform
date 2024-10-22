"use client";

import { useEffect } from "react";
import CalendarNavbar from "@/components/CalendarNavbar";
import WeekView from "@/components/WeekView";
import MonthView from "@/components/MonthView";
import { useCalendarStore } from "@/store/CalendarStore";
import { useEmailModal } from "@/store/EmailModalStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuthModal } from "@/store/AuthModalStore";
import { useEarningsStore } from "@/store/EarningsStore";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";
import { User, Subscription, EarningsCallTranscript } from "@prisma/client";

export type UserWithSubscription =
  | (User & {
      subscription: Subscription | null;
    })
  | null;

const EarningsClient = ({
  userInfo,
  transcripts,
}: {
  userInfo: UserWithSubscription;
  transcripts: EarningsCallTranscript[];
}) => {
  const setSelectedCompany = useEarningsStore(
    (state) => state.setSelectedCompany
  );

  const { currentDate, view, setCurrentDate, setView, navigateMonth } =
    useCalendarStore();
  const emailModal = useEmailModal();

  const { onOpen: openAuthModal } = useAuthModal();
  const { onOpen: openSubscriptionModal } = useSubscriptionModal();

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

  const handleViewChange = (newView: "week" | "month") => {
    setView(newView);
  };

  const handleDateChange = (newDate: Date) => {
    if (!userInfo) {
      openAuthModal();
    } else {
      setCurrentDate(newDate);
    }
  };

  const handleNavigateMonth = (direction: "prev" | "next") => {
    if (!userInfo) {
      openAuthModal();
    } else {
      navigateMonth(direction === "next" ? 1 : -1);
    }
  };

  const handleCompanyClick = (transcriptInfo: EarningsCallTranscript) => {
    console.log(transcriptInfo);

    if (!userInfo) {
      console.log("open auth modal");
      openAuthModal();
    } else if (!userInfo.subscription) {
      console.log("open subscription modal");
      openSubscriptionModal();
    } else {
      setSelectedCompany({
        id: transcriptInfo.id,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <CalendarNavbar
        currentDate={currentDate}
        setCurrentDate={handleDateChange}
        navigateMonth={(direction: number) =>
          handleNavigateMonth(direction > 0 ? "next" : "prev")
        }
        view={view}
        setView={handleViewChange}
      />
      <div className="flex-1 overflow-y-auto relative">
        {view === "week" ? (
          <WeekView
            weekDays={weekDays}
            weekDates={weekDates}
            transcripts={transcripts}
            handleCompanyClick={handleCompanyClick}
          />
        ) : (
          <MonthView
            currentDate={currentDate}
            transcripts={transcripts}
            handleCompanyClick={handleCompanyClick}
          />
        )}
      </div>
    </div>
  );
};

export default EarningsClient;
