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
  Star as StarIcon,
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
    useWatchlistCheck(Number(SelectedCompany?.companyId));

  if (!company || isLoadingCompany) return null;

  console.log(isWatchlisted);

  console.log(company);

  const handleWatchlistClick = async () => {
    if (!userId) {
      authModal.onOpen();
      return;
    }

    try {
      if (isWatchlisted) {
        await removeFromWatchlist.mutateAsync(
          Number(SelectedCompany.companyId)
        );
        toast.success("Removed from watchlist");
      } else {
        await addToWatchlist.mutateAsync(Number(SelectedCompany.companyId));
        toast.success("Added to watchlist");
      }
    } catch {
      toast.error("Failed to update watchlist");
    }
  };

  const handleBack = () => {
    setSelectedCompany(null);
  };

  // Get the most recent upcoming transcript with proper type checking
  const upcomingTranscript = company.recentTranscripts?.find(
    (t: Transcript) => new Date(t.scheduledAt).getTime() > new Date().getTime()
  );

  console.log(upcomingTranscript);

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-sm dark:shadow-slate-800/50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
        <CardHeader className="space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors md:[&:has(~[data-selected-date])]:block shrink-0"
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
                <CardTitle className="text-2xl font-bold break-words text-gray-900 dark:text-gray-100">
                  {company.name}
                </CardTitle>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {company.symbol}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Buttons section */}
          <div className="flex flex-row items-center gap-4">
            <button
              onClick={handleWatchlistClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-slate-700 rounded-full transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
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
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                fill={isWatchlisted ? "currentColor" : "none"}
                strokeWidth={2}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Follow
              </span>
            </button>
            {/* ... other buttons ... */}
          </div>

          {/* Stock price chart */}
          <div className="space-y-4">
            <div className="h-[300px] w-full mb-8">
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
