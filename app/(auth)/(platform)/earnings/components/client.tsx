"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useCalendarStore } from "@/store/CalendarStore";
import { useEmailModal } from "@/store/EmailModalStore";
import { useAuthModal } from "@/store/AuthModalStore";
import { useEarningsStore } from "@/store/EarningsStore";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";
import {
  User,
  Subscription,
  EarningsCallTranscript,
  EarningsReport,
} from "@prisma/client";
import { EarningsReportWithCompany } from "../page";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@clerk/nextjs";

const CalendarNavbar = dynamic(() => import("@/components/CalendarNavbar"), {
  ssr: false,
});
const WeekView = dynamic(() => import("@/components/WeekView"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
const MonthView = dynamic(() => import("@/components/MonthView"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export type UserWithSubscription =
  | (User & {
      subscription: Subscription | null;
    })
  | null;

const EarningsClient: React.FC<{
  userInfo: UserWithSubscription;
  transcripts: EarningsCallTranscript[];
  futureEarningsReports: EarningsReportWithCompany[];
}> = React.memo(({ userInfo, transcripts, futureEarningsReports }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentDate, view, setCurrentDate, setView, navigateMonth } =
    useCalendarStore();
  const emailModal = useEmailModal();
  const { onOpen: openAuthModal } = useAuthModal();
  const { onOpen: openSubscriptionModal } = useSubscriptionModal();
  const { setSelectedCompany, setSelectedFutureEarnings } = useEarningsStore();
  const { user } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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

  const weekDays = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri"], []);
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - currentDate.getDay() + i);
      return date;
    });
  }, [currentDate]);

  const handleViewChange = (newView: "week" | "month") => setView(newView);

  const handleDateChange = (newDate: Date) => {
    if (!userInfo) {
      openAuthModal();
    } else {
      setCurrentDate(newDate);
    }
  };

  const handleNavigateMonth = (direction: "prev" | "next") => {
    if (!user) {
      openAuthModal();
    } else {
      navigateMonth(direction === "next" ? 1 : -1);
    }
  };

  const handleCompanyClick = (transcriptInfo: EarningsCallTranscript) => {
    if (user && userInfo && userInfo.subscription?.status === "active") {
      setSelectedCompany({ id: transcriptInfo.id });
    } else if (!user) {
      openAuthModal();
    } else {
      openSubscriptionModal();
    }
  };

  const handleFutureEarningsClick = (report: EarningsReport) => {
    setSelectedCompany({ id: null });
    if (!user) {
      openAuthModal();
    }
    setSelectedFutureEarnings(report);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
            futureEarningsReports={futureEarningsReports}
            handleFutureEarningsClick={handleFutureEarningsClick}
          />
        ) : (
          <MonthView
            currentDate={currentDate}
            transcripts={transcripts}
            handleCompanyClick={handleCompanyClick}
            futureEarningsReports={futureEarningsReports}
            handleFutureEarningsClick={handleFutureEarningsClick}
          />
        )}
      </div>
    </div>
  );
});

EarningsClient.displayName = "EarningsClient";

export default EarningsClient;
