import React, { useEffect, useState } from "react";
import {
  Calendar,
  CalendarCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  Filter,
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
  onFilter: (filters: FilterState) => void;
}

interface FilterState {
  sectors: string[];
  marketCap: string[];
  watchlist: string[];
}

const CalendarNavbar: React.FC<CalendarNavbarProps> = ({
  currentDate,
  navigateMonth,
  setCurrentDate,
  view,
  setView,
  onFilter,
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
    const params = searchParams
      ? new URLSearchParams(searchParams)
      : new URLSearchParams();
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

  const [filters, setFilters] = useState<FilterState>({
    sectors: [],
    marketCap: [],
    watchlist: [],
  });

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [category]: newValues,
      };
    });
  };

  useEffect(() => {
    const savedFilters = localStorage.getItem("earnings-filters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("earnings-filters", JSON.stringify(filters));
  }, [filters]);

  return (
    <div className="bg-white dark:bg-slate-900 pb-2 px-6 rounded-lg shadow-sm dark:shadow-slate-800/50 mt-5 lg:mt-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleNavigation(-1)}
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Select
            value={months[currentDate.getMonth()]}
            onValueChange={(month) => {
              const newDate = new Date(currentDate);
              newDate.setMonth(months.indexOf(month));
              updateURL(newDate);
              setCurrentDate(newDate);
            }}
          >
            <SelectTrigger className="h-9 w-[120px] font-medium bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
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
            <SelectTrigger className="h-9 w-[100px] font-medium bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
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
            className="h-9 w-9 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="default"
                  className="h-9 px-4 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filter{" "}
                  {Object.values(filters).flat().length > 0 &&
                    `(${Object.values(filters).flat().length})`}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="text-sm font-semibold">Filter Earnings</h4>
                    {Object.values(filters).flat().length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFilters({
                            sectors: [],
                            marketCap: [],
                            watchlist: [],
                          })
                        }
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Sector Section */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Sector</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Retail",
                        "Automotive",
                        "Software",
                        "Insurance",
                        "Real Estate",
                        "Telecomm",
                        "Technology",
                        "Healthcare",
                        "Finance",
                        "Energy",
                      ].map((sector) => (
                        <label
                          key={sector}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={filters.sectors.includes(sector)}
                            onChange={() =>
                              handleFilterChange("sectors", sector)
                            }
                          />
                          <span>{sector}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Market Cap Section */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Market Cap</h5>
                    <div className="space-y-1">
                      {[
                        "Large Cap ($10B+)",
                        "Mid Cap ($2B-$10B)",
                        "Small Cap ($300M-$2B)",
                      ].map((cap) => (
                        <label
                          key={cap}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={filters.marketCap.includes(cap)}
                            onChange={() =>
                              handleFilterChange("marketCap", cap)
                            }
                          />
                          <span>{cap}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Watchlist Section */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Watchlist</h5>
                    <div className="space-y-1">
                      {["Show only watchlist", "Include watchlist alerts"].map(
                        (option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={filters.watchlist.includes(option)}
                              onChange={() =>
                                handleFilterChange("watchlist", option)
                              }
                            />
                            <span>{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Reset all filters to empty arrays
                        const clearedFilters = {
                          marketCap: [],
                          sectors: [],
                          watchlist: [],
                        };
                        // Update UI state to clear checkboxes
                        setFilters(clearedFilters);
                        // Apply cleared filters
                        onFilter(clearedFilters);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => {
                        onFilter(filters);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="default"
                className="h-9 px-4 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
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

          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-1">
            <div className="flex gap-1">
              <Button
                onClick={() => setView("month")}
                variant={view === "month" ? "default" : "outline"}
                className={`px-4 py-2 transition-colors duration-200 ${
                  view === "month"
                    ? "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"
                    : "bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
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
                    ? "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"
                    : "bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
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
