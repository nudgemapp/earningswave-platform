import React, { useState } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { ProcessedReport } from "@/app/(auth)/(platform)/earnings/types";
import { useGetWeekView } from "@/app/hooks/use-get-week-view";

interface TickerSearchProps {
  handleFutureEarningsClick: (report: ProcessedReport) => void;
}

const TickerSearch: React.FC<TickerSearchProps> = ({
  handleFutureEarningsClick,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [filteredReports, setFilteredReports] = useState<ProcessedReport[]>([]);
  const { data } = useGetWeekView();

  const handleSearch = (query: string) => {
    setValue(query);

    if (!query.trim()) {
      setFilteredReports([]);
      setOpen(false);
      return;
    }

    // Filter reports directly from the week's data
    const filtered =
      data?.reports?.filter(
        (report: ProcessedReport) =>
          report.symbol.toLowerCase().includes(query.toLowerCase()) ||
          report.name.toLowerCase().includes(query.toLowerCase())
      ) || [];

    setFilteredReports(filtered);
    setOpen(filtered.length > 0);
  };

  const handleSelect = (report: ProcessedReport) => {
    console.log("Selected report data:", {
      symbol: report.symbol,
      name: report.name,
      // Log other relevant fields
    });
    setValue(report.symbol);
    handleFutureEarningsClick(report);
    setOpen(false);
  };

  return (
    <div className="relative w-64">
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen && !value) {
            setValue("");
            setFilteredReports([]);
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
                if (value.length > 0 && filteredReports.length > 0) {
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
            {filteredReports.length === 0 ? (
              <div className="py-2 text-center text-sm text-gray-500">
                {value ? "No companies found" : "Type to search companies..."}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredReports.map((report) => (
                  <div
                    key={report.symbol}
                    onClick={() => handleSelect(report)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="font-medium">{report.symbol}</span>
                    <span className="text-gray-500 text-sm truncate">
                      {report.name}
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
