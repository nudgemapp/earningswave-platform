import React, { useState } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { useSearchCompanies } from "@/app/hooks/use-search-companies";
import { useEarningsStore } from "@/store/EarningsStore";

interface TickerSearchProps {
  onClose?: () => void;
}

const TickerSearch: React.FC<TickerSearchProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data: companies, isLoading } = useSearchCompanies(value);
  const { setSelectedCompany } = useEarningsStore();

  const handleSearch = (query: string) => {
    setValue(query);
    setOpen(query.length > 0);
  };

  const handleSelect = (company: {
    id: string;
    symbol: string;
    name: string | null;
  }) => {
    setValue(company.symbol);
    setSelectedCompany({
      companyId: company.id,
      transcriptId: null,
    });
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full max-w-3xl mb-12">
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen && !value) {
            setValue("");
          }
          setOpen(isOpen);
        }}
      >
        <PopoverTrigger className="w-full">
          <div className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800/50 hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              value={value}
              onChange={(e) => handleSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-full bg-transparent"
              placeholder="Search company or ticker symbol..."
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[--radix-popover-trigger-width] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-800/50"
          align="start"
        >
          <div className="max-h-[300px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            ) : companies?.length === 0 ? (
              <div className="py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                {value ? "No companies found" : "Type to search companies..."}
              </div>
            ) : (
              <div className="space-y-1">
                {companies?.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleSelect(company)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {company.symbol}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
                      {company.name}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs ml-auto">
                      {company.mic}
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
