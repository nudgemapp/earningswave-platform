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
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder="Search companies by name or ticker..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            "No companies found."
          )}
        </CommandEmpty>
        <CommandGroup heading="Companies">
          {companies?.map((company) => (
            <CommandItem
              key={company.id}
              value={`${company.symbol}-${company.name}`}
              onSelect={() => onCompanySelect(company.id)}
            >
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.symbol}
                  className="mr-2 h-4 w-4"
                />
              ) : (
                <Building2 className="mr-2 h-4 w-4" />
              )}
              <span className="font-medium">{company.symbol}</span>
              {company.name && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {company.name}
                </span>
              )}
              {company._count.transcripts > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {company._count.transcripts} transcripts
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
