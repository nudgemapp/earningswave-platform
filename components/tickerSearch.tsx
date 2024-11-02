import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { ProcessedReport } from "@/app/(auth)/(platform)/earnings/types";
import { useGetWeekView } from "@/app/hooks/use-get-week-view";

interface Ticker {
  symbol: string;
  name: string;
  logo?: string | null;
}

interface TickerSearchProps {
  handleFutureEarningsClick: (report: ProcessedReport) => void;
}

const TickerSearch: React.FC<TickerSearchProps> = ({
  handleFutureEarningsClick,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const { data } = useGetWeekView();

  const searchTickers = async (query: string) => {
    if (!query) {
      setTickers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/search/tickers?q=${query}`);
      if (!response.ok) throw new Error("Failed to fetch tickers");
      const data = await response.json();
      setTickers(data);
      setOpen(true); // Ensure popover opens when we have results
    } catch (error) {
      console.error("Error searching tickers:", error);
      setTickers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setValue(query);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.length > 0) {
      debounceTimer.current = setTimeout(() => {
        searchTickers(query);
      }, 300);
    } else {
      setTickers([]);
      setOpen(false);
    }
  };

  const handleSelect = async (ticker: Ticker) => {
    const matchingReport = data?.reports.find(
      (report: ProcessedReport) => report.symbol === ticker.symbol
    );

    if (matchingReport) {
      setValue(ticker.symbol);
      handleFutureEarningsClick(matchingReport);
      setOpen(false);
    }
  };

  return (
    <div className="relative w-64">
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          // If closing and no value, reset everything
          if (!isOpen && !value) {
            setValue("");
            setTickers([]);
          }
        }}
      >
        <PopoverTrigger asChild>
          <div className="w-full flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:border-gray-400 cursor-text">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={value}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => {
                if (value.length > 0 && tickers.length > 0) {
                  setOpen(true);
                }
              }}
              className="flex-1 outline-none placeholder:text-gray-500 w-full"
              placeholder="Search ticker..."
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="py-2 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : tickers.length === 0 ? (
              <div className="py-2 text-center text-sm text-gray-500">
                {value ? "No tickers found." : "Type to search tickers..."}
              </div>
            ) : (
              <div className="space-y-1">
                {tickers.map((ticker) => (
                  <div
                    key={ticker.symbol}
                    onClick={() => handleSelect(ticker)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="font-medium">{ticker.symbol}</span>
                    <span className="text-gray-500 text-sm truncate">
                      {ticker.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TickerSearch;
