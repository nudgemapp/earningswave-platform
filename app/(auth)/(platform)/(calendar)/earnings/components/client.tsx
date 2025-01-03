"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useCalendarStore } from "@/store/CalendarStore";
import { useEarningsStore } from "@/store/EarningsStore";
import { User, Subscription } from "@prisma/client";
import { EarningsEntry } from "../types";
import { CalendarSkeleton } from "./loading-skeleton";
import { useAuthModal } from "@/store/AuthModalStore";

interface FilterState {
  sectors: string[];
  marketCap: string[];
  watchlist: string[];
}

const CalendarNavbar = dynamic(() => import("@/components/CalendarNavbar"), {
  ssr: false,
  loading: () => <CalendarSkeleton />,
});
const WeekView = dynamic(() => import("@/components/WeekView"), {
  ssr: false,
  loading: () => <CalendarSkeleton />,
});
const MonthView = dynamic(() => import("@/components/MonthView"), {
  ssr: false,
  loading: () => <CalendarSkeleton />,
});

export type UserWithSubscription =
  | (User & {
      subscription: Subscription | null;
    })
  | null;

const EarningsClient = () => {
  const [filters, setFilters] = useState<FilterState>({
    sectors: [],
    marketCap: [],
    watchlist: [],
  });
  const { currentDate, view, setCurrentDate, setView, navigateMonth } =
    useCalendarStore();
  const { setSelectedCompany, setSelectedTranscript } = useEarningsStore();

  const { onOpen: openAuthModal } = useAuthModal();

  useEffect(() => {
    const hasModalBeenShown = localStorage.getItem("authModalShown");
    if (!hasModalBeenShown) {
      const timer = setTimeout(() => {
        openAuthModal();
        localStorage.setItem("authModalShown", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [openAuthModal]);

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
    setCurrentDate(newDate);
  };

  const handleNavigateMonth = (direction: "prev" | "next") => {
    navigateMonth(direction === "next" ? 1 : -1);
  };

  const handleCompanyClick = (transcriptInfo: EarningsEntry) => {
    if (!transcriptInfo.company) {
      console.error("Company information is missing from transcript");
      return;
    }

    setSelectedCompany({
      companyId: transcriptInfo.company.id,
      symbol: transcriptInfo.company.symbol,
    });
    setSelectedTranscript(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative sm:mt-0 mt-12">
      <div className="hidden sm:block">
        <CalendarNavbar
          onFilter={(filters) => {
            console.log(filters);
            setFilters(filters);
          }}
          currentDate={currentDate}
          setCurrentDate={handleDateChange}
          navigateMonth={(direction: number) =>
            handleNavigateMonth(direction > 0 ? "next" : "prev")
          }
          view={view}
          setView={handleViewChange}
        />
      </div>
      <div className="flex-1 overflow-y-auto relative">
        {view === "week" ? (
          <WeekView handleCompanyClick={handleCompanyClick} filters={filters} />
        ) : (
          <MonthView
            currentDate={currentDate}
            handleCompanyClick={handleCompanyClick}
            filters={filters}
          />
        )}
      </div>
    </div>
  );
};

EarningsClient.displayName = "EarningsClient";

export default EarningsClient;
