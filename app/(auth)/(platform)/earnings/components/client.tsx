"use client";

import { useEffect } from "react";
import CalendarNavbar from "@/components/CalendarNavbar";
import WeekView from "@/components/WeekView";
import MonthView from "@/components/MonthView";
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
  Company,
  Logo,
} from "@prisma/client";
import { EarningsReportWithCompany } from "../page";

// TODO: Remove this, it is to fetch todays earnings calls
// const fetchEarningsCalendar = async () => {
//   try {
//     const response = await fetch(
//       "https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=3month&apikey=demo"
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const csvText = await response.text();
//     const rows = csvText.split("\n").map((row) => row.split(","));

//     // Get today's date
//     const today = new Date();
//     const todayDateString = today.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

//     // Filter rows to match today's date
//     const filteredRows = rows.filter((row) => {
//       const reportDateString = row[2]; // Assuming reportDate is at index 2
//       if (!reportDateString) return false; // Skip if reportDate is missing

//       const reportDate = new Date(reportDateString);
//       if (isNaN(reportDate.getTime())) return false; // Skip if invalid date

//       return reportDate.toISOString().split("T")[0] === todayDateString;
//     });

//     console.log(filteredRows);
//   } catch (error) {
//     console.error("Failed to fetch earnings calendar:", error);
//   }
// };

// fetchEarningsCalendar();

// console.log("done");

export type UserWithSubscription =
  | (User & {
      subscription: Subscription | null;
    })
  | null;

const EarningsClient = ({
  userInfo,
  transcripts,
  futureEarningsReports,
}: {
  userInfo: UserWithSubscription;
  transcripts: EarningsCallTranscript[];
  futureEarningsReports: EarningsReportWithCompany[];
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
    if (userInfo && userInfo.subscription?.status === "active") {
      console.log("set selected company");
      setSelectedCompany({
        id: transcriptInfo.id,
      });
    } else if (!userInfo) {
      console.log("open auth modal");
      openAuthModal();
    } else {
      console.log("open subscription modal");
      openSubscriptionModal();
    }
  };

  const handleFutureEarningsClick = (report: EarningsReport) => {
    console.log(report);
    // setSelectedCompany({
    //   id: report.id,
    // });
  };

  // useEffect(() => {
  //   const storeEarningsData = async () => {
  //     try {
  //       const response = await fetch("/api/transcripts/fetch", {
  //         method: "GET",
  //       });
  //       const data = await response.json();
  //       console.log(data.message);
  //     } catch (error) {
  //       console.error("Error storing earnings data:", error);
  //     }
  //   };

  //   storeEarningsData();
  // }, []);

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
            futureEarningsReports={futureEarningsReports}
            handleFutureEarningsClick={handleFutureEarningsClick}
          />
        )}
      </div>
    </div>
  );
};

export default EarningsClient;
