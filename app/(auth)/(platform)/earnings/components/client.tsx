"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useCalendarStore } from "@/store/CalendarStore";
import { useEmailModal } from "@/store/EmailModalStore";
import { useAuthModal } from "@/store/AuthModalStore";
import { useEarningsStore } from "@/store/EarningsStore";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";
import { User, Subscription } from "@prisma/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@clerk/nextjs";
import { ProcessedReport, ProcessedTranscript } from "../types";

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

interface EarningsClientProps {
  userInfo: UserWithSubscription;
  // transcripts: ProcessedTranscript[];
  // reports: ProcessedReport[];
}

const EarningsClient: React.FC<EarningsClientProps> = ({
  userInfo,
  // transcripts,
  // reports,
}) => {
  const { currentDate, view, setCurrentDate, setView, navigateMonth } =
    useCalendarStore();
  const emailModal = useEmailModal();
  const { onOpen: openAuthModal } = useAuthModal();
  const { onOpen: openSubscriptionModal } = useSubscriptionModal();
  const { setSelectedCompany, setSelectedFutureEarnings } = useEarningsStore();

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

  useEffect(() => {
    const url = new URL(window.location.href);
    const dateParam = url.searchParams.get("date");
    const viewParam = url.searchParams.get("view") as "week" | "month" | null;

    if (dateParam) {
      setCurrentDate(new Date(dateParam));
    }
    if (viewParam) {
      setView(viewParam);
    }
  }, []);

  const handleViewChange = (newView: "week" | "month") => setView(newView);

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

  const handleCompanyClick = (transcriptInfo: ProcessedTranscript) => {
    if (userInfo && userInfo.subscription?.status === "active") {
      setSelectedCompany({ id: transcriptInfo.id });
    } else if (!userInfo) {
      openAuthModal();
    } else {
      openSubscriptionModal();
    }
  };

  const handleFutureEarningsClick = (report: ProcessedReport) => {
    setSelectedCompany({ id: null });
    if (!userInfo) {
      openAuthModal();
    }
    setSelectedFutureEarnings(report);
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
            handleCompanyClick={handleCompanyClick}
            handleFutureEarningsClick={handleFutureEarningsClick}
          />
        ) : (
          <MonthView
            currentDate={currentDate}
            handleCompanyClick={handleCompanyClick}
            handleFutureEarningsClick={handleFutureEarningsClick}
          />
        )}
      </div>
    </div>
  );
};

EarningsClient.displayName = "EarningsClient";

export default EarningsClient;
