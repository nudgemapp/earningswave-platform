"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ChevronLeft, File, Star as StarIcon, Globe } from "lucide-react";
import { useEarningsStore } from "@/store/EarningsStore";
import StockPriceChart from "./StockPriceChart";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { toast } from "sonner";
import { useWatchlistCheck } from "@/app/hooks/use-watchlist-check";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import { useGetCompany } from "@/app/hooks/use-get-company";
import { Company, Transcript } from "@prisma/client";
import CompanyTranscripts from "./CompanyTranscripts";
import { Skeleton } from "@/components/ui/skeleton";
import EarningsTranscript from "./EarningsTranscript";
// import EnhancedEarnings from "./EnhancedEarnings";
// import AIEarningsAnalysis from "./AIEarnings";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface FutureEarningsProps {
  SelectedCompany: {
    companyId: string;
    transcriptId: string;
  };
}

// Define an extended Company type that includes recentTranscripts
type ExtendedCompany = Company & {
  recentTranscripts?: Transcript[];
};

const FutureEarnings: React.FC<FutureEarningsProps> = ({ SelectedCompany }) => {
  const [timeframe, setTimeframe] = useState("1M");
  const [showSummary, setShowSummary] = useState(false);
  const { addToWatchlist, removeFromWatchlist } = useWatchlistMutations();
  const { userId } = useAuth();
  const authModal = useAuthModal();
  const { setSelectedCompany } = useEarningsStore();

  // Update the type assertion for company
  const { data: company, isLoading: isLoadingCompany } = useGetCompany(
    SelectedCompany?.companyId
  ) as { data: ExtendedCompany | undefined; isLoading: boolean };

  // Check if company is in watchlist
  const { data: isWatchlisted, isLoading: isCheckingWatchlist } =
    useWatchlistCheck(SelectedCompany?.companyId);

  const selectedTranscript = useEarningsStore(
    (state) => state.selectedTranscript
  );

  if (isLoadingCompany || isCheckingWatchlist) {
    return (
      <div className="space-y-6">
        <Card className="w-full shadow-sm dark:shadow-slate-800/50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
          <CardHeader className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-12 h-12 rounded" />
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-8 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Buttons skeleton */}
            <div className="flex flex-row items-center gap-4">
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>

            {/* Chart skeleton */}
            <div className="space-y-4">
              <div className="h-[300px] w-full mb-8">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcripts skeleton */}
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!company) return null;

  const handleWatchlistClick = async () => {
    if (!userId) {
      authModal.onOpen();
      return;
    }

    try {
      if (isWatchlisted) {
        await removeFromWatchlist.mutateAsync(SelectedCompany.companyId);
        toast.success("Removed from watchlist", {
          className:
            "bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700",
          descriptionClassName: "text-gray-700 dark:text-gray-300",
        });
      } else {
        await addToWatchlist.mutateAsync(SelectedCompany.companyId);
        toast.success("Added to watchlist", {
          className:
            "bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700",
          descriptionClassName: "text-gray-700 dark:text-gray-300",
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update watchlist",
        {
          className: "bg-white text-gray-900 border-gray-200",
          descriptionClassName: "text-gray-700",
        }
      );
    }
  };

  const handleBack = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="space-y-4">
      {!selectedTranscript && (
        <Card className="w-full bg-white dark:bg-slate-900 border-gray-200/50 dark:border-slate-800/50 shadow-sm dark:shadow-slate-900/30">
          <CardHeader className="space-y-4 pb-4 px-4">
            {/* Company Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                {company.logo && (
                  <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <CardTitle className="text-xl font-semibold break-words text-gray-900 dark:text-gray-100">
                    {company.name}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {company.symbol}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {company.exchange}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <button
                    onClick={handleWatchlistClick}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                      ${
                        isWatchlisted
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      } border border-gray-200 dark:border-slate-700`}
                    disabled={
                      isCheckingWatchlist ||
                      addToWatchlist.isPending ||
                      removeFromWatchlist.isPending
                    }
                  >
                    <StarIcon
                      className={`w-4 h-4 ${
                        isWatchlisted
                          ? "fill-blue-500 text-blue-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      fill={isWatchlisted ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                    <span>{isWatchlisted ? "Following" : "Follow"}</span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Company Following
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Follow this company to receive notifications about:
                      <ul className="mt-2 space-y-1 list-none">
                        {[
                          "New earnings transcripts",
                          "Important company news",
                          "Price changes",
                          "Market sentiment updates",
                          "Financial reports",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <button
                onClick={() => setShowSummary(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
              >
                <File
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  strokeWidth={1.5}
                />
                <span>Company Info</span>
              </button>

              {company.weburl && (
                <a
                  href={company.weburl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
                >
                  <Globe
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    strokeWidth={1.5}
                  />
                  <span>Website</span>
                </a>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-4 pb-4">
            {/* Stock Chart Container */}
            <div className="bg-gray-50/50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 p-4">
              <div className="h-[400px] w-full">
                <StockPriceChart
                  symbol={company.symbol}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                />
              </div>
            </div>

            {/* Company Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Market Cap */}
              <div className="relative p-5 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 transition-colors hover:bg-gray-100/50 dark:hover:bg-slate-700/50">
                <div className="flex flex-col h-full">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Market Cap
                  </span>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {company.marketCapitalization
                          ? new Intl.NumberFormat("en-US", {
                              maximumFractionDigits: 2,
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(company.marketCapitalization)
                          : "N/A"}
                      </span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        USD
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {company.marketCapitalization
                        ? new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            maximumFractionDigits: 0,
                          }).format(company.marketCapitalization)
                        : "No data"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Industry */}
              <div className="relative p-5 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 transition-colors hover:bg-gray-100/50 dark:hover:bg-slate-700/50">
                <div className="flex flex-col h-full">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Industry
                  </span>
                  <div className="mt-auto">
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger asChild>
                        <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:cursor-help">
                          {company.finnhubIndustry || "N/A"}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto max-w-sm">
                        {company.finnhubIndustry}
                      </HoverCardContent>
                    </HoverCard>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      Listed on {company.exchange}
                    </span>
                  </div>
                </div>
              </div>

              {/* IPO Date */}
              <div className="relative p-5 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 transition-colors hover:bg-gray-100/50 dark:hover:bg-slate-700/50">
                <div className="flex flex-col h-full">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    IPO Date
                  </span>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {company.ipo
                          ? new Date(company.ipo).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {company.ipo
                        ? `${Math.abs(
                            new Date(company.ipo).getFullYear() -
                              new Date().getFullYear()
                          )} years ago`
                        : "No data"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shares Outstanding */}
              <div className="relative p-5 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 transition-colors hover:bg-gray-100/50 dark:hover:bg-slate-700/50">
                <div className="flex flex-col h-full">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Shares Outstanding
                  </span>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {company.sharesOutstanding
                          ? new Intl.NumberFormat("en-US", {
                              maximumFractionDigits: 1,
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(company.sharesOutstanding)
                          : "N/A"}
                      </span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        shares
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {company.sharesOutstanding
                        ? `${new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            maximumFractionDigits: 0,
                          }).format(company.sharesOutstanding)} total shares`
                        : "No data"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Transcripts Section - Adjusted to match card width */}
      {!selectedTranscript &&
        company.recentTranscripts &&
        company.recentTranscripts.length > 0 && (
          <Card className="w-full bg-white dark:bg-slate-900 border-gray-200/50 dark:border-slate-800/50 shadow-sm">
            <CardHeader className="pb-4 px-4">
              <CardTitle className="text-lg font-semibold">
                Recent Transcripts
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <CompanyTranscripts transcripts={company.recentTranscripts} />
            </CardContent>
          </Card>
        )}

      {/* Selected Transcript View */}
      {selectedTranscript && (
        <Card className="w-full">
          <CardContent className="p-4">
            <EarningsTranscript />
          </CardContent>
        </Card>
      )}

      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {company.name} ({company.symbol}) - Company Summary
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Company Information",
                  items: [
                    { label: "Industry", value: company.finnhubIndustry },
                    { label: "Exchange", value: company.exchange },
                    {
                      label: "Market Cap",
                      value: `$${company.marketCapitalization?.toFixed(2)}M`,
                    },
                  ],
                },
                {
                  title: "Additional Details",
                  items: [
                    { label: "Website", value: company.weburl },
                    {
                      label: "IPO Date",
                      value: company.ipo
                        ? new Date(company.ipo).toLocaleDateString()
                        : "N/A",
                    },
                    { label: "Country", value: company.country },
                  ],
                },
              ].map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {section.items.map((item, itemIndex) => (
                      <p key={itemIndex} className="flex items-center gap-2">
                        <span className="font-medium">{item.label}:</span>{" "}
                        {item.value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FutureEarnings;
