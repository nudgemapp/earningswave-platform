import React, { useEffect } from "react";
import {
  Calendar,
  CalendarCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEarningsStore } from "@/store/EarningsStore";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CalendarNavbarProps {
  currentDate: Date;
  navigateMonth: (direction: number) => void;
  setCurrentDate: (date: Date) => void;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
}

const CalendarNavbar: React.FC<CalendarNavbarProps> = ({
  currentDate,
  navigateMonth,
  setCurrentDate,
  view,
  setView,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const authModal = useAuthModal();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);
  }, []);

  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  useEffect(() => {
    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth() + 1;
    const defaultYear = currentDate.getFullYear();

    // If month or year is not set in the URL, update the URL with default values
    if (!monthParam || !yearParam) {
      const params = new URLSearchParams(searchParams);
      if (!monthParam)
        params.set("month", defaultMonth.toString().padStart(2, "0"));
      if (!yearParam) params.set("year", defaultYear.toString());

      router.replace(`?${params.toString()}`);
    }
  }, [monthParam, yearParam, router, searchParams]);

  const handleNavigation = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
      setCurrentDate(newDate);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
      navigateMonth(direction);
    }
    updateURL(newDate);
  };

  const updateURL = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", (date.getMonth() + 1).toString().padStart(2, "0"));
    params.set("year", date.getFullYear().toString());
    router.push(`?${params.toString()}`);
  };

  const handleWatchlistClick = () => {
    if (!userId) {
      authModal.onOpen();
      return;
    }

    useEarningsStore.setState({ showWatchlist: true });
  };

  const handleApiClick = async () => {
    try {
      const response = await fetch("/api/finnhub");
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching from API:", error);
    }
  };

  return (
    <div className="bg-white-300/50 dark:bg-slate-900 pb-2 px-6 rounded-xl shadow-sm mt-5 lg:mt-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleNavigation(-1)}
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:text-primary hover:bg-secondary/80 transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Button onClick={handleApiClick}>Sync</Button>
          <Select
            value={months[currentDate.getMonth()]}
            onValueChange={(month) => {
              const newDate = new Date(currentDate);
              newDate.setMonth(months.indexOf(month));
              updateURL(newDate);
              setCurrentDate(newDate);
            }}
          >
            <SelectTrigger className="h-9 w-[120px] font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentDate.getFullYear().toString()}
            onValueChange={(year) => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(parseInt(year));
              updateURL(newDate);
              setCurrentDate(newDate);
            }}
          >
            <SelectTrigger className="h-9 w-[100px] font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => handleNavigation(1)}
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:text-primary hover:bg-secondary/80 transition-colors duration-200"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="default"
                className="h-9 px-4 font-medium hover:bg-secondary/80 hover:text-primary transition-colors duration-200"
                onClick={handleWatchlistClick}
              >
                <StarIcon className="h-5 w-5 mr-2" />
                Watchlist
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Company Watchlist</h4>
                <p className="text-sm text-muted-foreground">
                  Add companies to your watchlist to receive notifications
                  about:
                  <ul className="list-disc list-inside mt-1">
                    <li>New earnings transcripts</li>
                    <li>Important company news</li>
                    <li>Price changes</li>
                    <li>Market sentiment updates</li>
                    <li>Financial reports</li>
                  </ul>
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <div className="bg-secondary/20 rounded-lg p-1">
            <div className="flex gap-1">
              <Button
                onClick={() => setView("month")}
                variant={view === "month" ? "default" : "outline"}
                className={`px-4 py-2 transition-colors duration-200 ${
                  view === "month"
                    ? "bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-white dark:text-black"
                    : "bg-white dark:bg-slate-900 hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
                }`}
              >
                {view === "month" ? (
                  <CalendarCheckIcon className="w-4 h-4 mr-2" />
                ) : (
                  <Calendar className="w-4 h-4 mr-2" />
                )}
                <span>Month</span>
              </Button>
              <Button
                onClick={() => setView("week")}
                variant={view === "week" ? "default" : "outline"}
                className={`px-4 py-2 transition-colors duration-200 ${
                  view === "week"
                    ? "bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-white dark:text-black"
                    : "bg-white dark:bg-slate-900 hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
                }`}
              >
                {view === "week" ? (
                  <CalendarCheckIcon className="w-4 h-4 mr-2" />
                ) : (
                  <Calendar className="w-4 h-4 mr-2" />
                )}
                <span>Week</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarNavbar;
