"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { useSearchCompanies } from "@/app/hooks/use-search-companies";
import { useEarningsStore } from "@/store/EarningsStore";
import { Building2, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export const SearchCommand = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState("");

  const { data: companies, isLoading } = useSearchCompanies(query);
  const setSelectedCompany = useEarningsStore(
    (state) => state.setSelectedCompany
  );

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    setQuery("");
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onCompanySelect = (companyId: string) => {
    if (pathname !== "/") {
      router.push("/");
    }

    setSelectedCompany({ companyId });
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onClose}
      style={{
        position: "fixed",
        top: "50vh",
        maxWidth: "90%",
        width: "1000px",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      <CommandInput
        placeholder="Search companies by name or ticker..."
        value={query}
        onValueChange={setQuery}
        className="h-14 text-lg px-4"
      />
      <CommandList className="max-h-[750px]">
        <CommandEmpty>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <p className="text-lg py-6">No companies found.</p>
          )}
        </CommandEmpty>
        <CommandGroup heading="Companies" className="px-2">
          {companies?.map((company) => (
            <CommandItem
              key={company.id}
              value={`${company.symbol}-${company.name}`}
              onSelect={() => onCompanySelect(company.id)}
              className="p-4 hover:bg-muted/60 rounded-lg cursor-pointer"
            >
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.symbol}
                  className="mr-3 h-8 w-8 flex-shrink-0"
                />
              ) : (
                <Building2 className="mr-3 h-8 w-8 flex-shrink-0" />
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-lg truncate">
                    {company.symbol}
                  </span>
                  {company.name && (
                    <span className="text-sm text-muted-foreground truncate">
                      {company.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {company._count.transcripts > 0 && (
                    <span className="whitespace-nowrap">
                      {company._count.transcripts} transcripts
                    </span>
                  )}
                  {company.marketCapitalization && (
                    <span className="whitespace-nowrap">
                      • MCap: $
                      {(company.marketCapitalization / 1000).toFixed(1)}B
                    </span>
                  )}
                  {company.finnhubIndustry && (
                    <span className="whitespace-nowrap">
                      • {company.finnhubIndustry}
                    </span>
                  )}
                  {company.country && (
                    <span className="whitespace-nowrap">
                      • {company.country}
                    </span>
                  )}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
