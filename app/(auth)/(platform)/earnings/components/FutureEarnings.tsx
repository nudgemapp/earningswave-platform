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
import {
  // FileText,
  // FileDown,
  ChevronLeft,
  File,
  Star as StarIcon,
  Globe,
} from "lucide-react";
import { ResponsiveContainer } from "recharts";
// import EnhancedEarnings from "./EnhancedEarnings";
import { useEarningsStore } from "@/store/EarningsStore";
import StockPriceChart from "./StockPriceChart";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { toast } from "sonner";
import { useWatchlistCheck } from "@/app/hooks/use-watchlist-check";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
// import AIEarningsAnalysis from "./AIEarnings";
import { useGetCompany } from "@/app/hooks/use-get-company";
import { Company, Transcript } from "@prisma/client";
import CompanyTranscripts from "./CompanyTranscripts";
import { Skeleton } from "@/components/ui/skeleton";

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

  console.log(company);

  // Check if company is in watchlist
  const { data: isWatchlisted, isLoading: isCheckingWatchlist } =
    useWatchlistCheck(SelectedCompany?.companyId);

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

  // Get the most recent upcoming transcript with proper type checking
  const upcomingTranscript = company.recentTranscripts?.find(
    (t: Transcript) => new Date(t.scheduledAt).getTime() > new Date().getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-sm dark:shadow-slate-800/50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
        <CardHeader className="space-y-4">
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              {company.logo && (
                <div className="w-12 h-12 relative shrink-0">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded"
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

          {/* Company Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Market Cap
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                ${(company.marketCapitalization || 0).toFixed(2)}M
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Industry
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {company.finnhubIndustry || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                IPO Date
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {company.ipo
                  ? new Date(company.ipo).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Shares Outstanding
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {company.sharesOutstanding
                  ? `${company.sharesOutstanding.toFixed(2)}M`
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleWatchlistClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
              disabled={
                isCheckingWatchlist ||
                addToWatchlist.isPending ||
                removeFromWatchlist.isPending
              }
            >
              <StarIcon
                className={`w-4 h-4 ${
                  isCheckingWatchlist ||
                  addToWatchlist.isPending ||
                  removeFromWatchlist.isPending
                    ? "text-gray-300 dark:text-gray-600"
                    : isWatchlisted
                    ? "fill-blue-500 text-blue-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                fill={isWatchlisted ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {isWatchlisted ? "Following" : "Follow"}
              </span>
            </button>
            <button
              onClick={() => setShowSummary(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <File
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                strokeWidth={1.5}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Company Info
              </span>
            </button>
            {company.weburl && (
              <a
                href={company.weburl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <Globe
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  strokeWidth={1.5}
                />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Website
                </span>
              </a>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stock price chart */}
          <div className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <StockPriceChart
                  symbol={company.symbol}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                />
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add CompanyTranscripts component */}
      {/* Upcoming earnings info */}
      {company.recentTranscripts && company.recentTranscripts.length > 0 && (
        <CompanyTranscripts transcripts={company.recentTranscripts} />
      )}

      {/* Additional components */}
      {/* <AIEarningsAnalysis company={company} /> */}

      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {company.name} ({company.symbol}) - Company Summary
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Company Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Industry:</span>{" "}
                    {company.finnhubIndustry}
                  </p>
                  <p>
                    <span className="font-medium">Exchange:</span>{" "}
                    {company.exchange}
                  </p>
                  <p>
                    <span className="font-medium">Market Cap:</span> $
                    {company.marketCapitalization?.toFixed(2)}M
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Additional Details
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Website:</span>{" "}
                    {company.weburl}
                  </p>
                  <p>
                    <span className="font-medium">IPO Date:</span>{" "}
                    {company.ipo
                      ? new Date(company.ipo).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Country:</span>{" "}
                    {company.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FutureEarnings;
