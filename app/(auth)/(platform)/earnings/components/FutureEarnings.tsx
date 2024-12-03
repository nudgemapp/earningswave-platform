"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ChevronLeft, Star as StarIcon } from "lucide-react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
// import { useGetLiveCall } from "@/app/hooks/use-get-live-call";
// import AIEarningsAnalysis from "./AIEarnings";

interface FutureEarningsProps {
  SelectedCompany: {
    companyId: string;
    transcriptId: string;
  };
}
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Define an extended Company type that includes recentTranscripts
type ExtendedCompany = Company & {
  recentTranscripts?: Transcript[];
};

// Add this type definition near the top of the file
type WatchlistMutation = {
  isPending: boolean;
  mutateAsync: (companyId: string) => Promise<void>;
};

// Update the CompanyHeader props interface
interface CompanyHeaderProps {
  company: ExtendedCompany;
  onBack: () => void;
  onWatchlistClick: () => void;
  isWatchlisted: boolean;
  isCheckingWatchlist: boolean;
  addToWatchlist: WatchlistMutation;
  removeFromWatchlist: WatchlistMutation;
}

const StockChartSkeleton = () => (
  <div className="bg-gray-50/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700/50 p-4">
    <div className="h-[400px] w-full bg-gray-100 dark:bg-slate-800 animate-pulse rounded-lg" />
  </div>
);

const TranscriptsSkeleton = () => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      Recent Earnings
    </h3>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 bg-gray-50/50 dark:bg-slate-800/50 animate-pulse rounded-lg border border-gray-200/50 dark:border-slate-700/50"
        />
      ))}
    </div>
  </div>
);

// ???
// use scrollarea here form ShadowNoneIcon

// Update the CompanyHeader component with the proper type
const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company,
  onBack,
  onWatchlistClick,
  isWatchlisted,
  isCheckingWatchlist,
  addToWatchlist,
  removeFromWatchlist,
}) => (
  <div className="flex justify-between items-start w-full">
    <div className="flex items-center gap-4 min-w-0">
      <button
        onClick={onBack}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
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
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {company.symbol}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {company.exchange}
          </span>
        </div>
      </div>
    </div>

    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <button
          onClick={onWatchlistClick}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
    ${
      isWatchlisted
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
    } 
    hover:bg-opacity-90 border border-gray-200 dark:border-slate-700`}
          disabled={
            isCheckingWatchlist ||
            addToWatchlist.isPending ||
            removeFromWatchlist.isPending
          }
        >
          <StarIcon
            className={`w-4 h-4 ${
              isWatchlisted ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
            fill={isWatchlisted ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
          {!isWatchlisted && <span>Watch</span>}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Company Following
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Watchlist this company to receive notifications about:
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
  </div>
);

const FutureEarnings: React.FC<FutureEarningsProps> = ({ SelectedCompany }) => {
  // Add state to track current time
  const [currentTime, setCurrentTime] = useState(new Date());
  // Add useEffect for time updates
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000ms = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []); // Empty dependency array since we want this to run once on mount
  const isAfterHours = currentTime.getHours() >= 16;

  const [todayPrices, setTodayPrices] = useState<{
    prevClose: number | null;
    preMarket: number | null;
    regular: number | null;
    afterHours: number | null;
    regularOpen: number | null;
    percentChange: number | null;
    priceDifference: number | null;
    mostRecentDate?: string | null;
    atClose?: number | null;
  }>({
    prevClose: null,
    atClose: null,
    preMarket: null,
    regular: null,
    afterHours: null,
    regularOpen: null,
    percentChange: null,
    priceDifference: null,
    mostRecentDate: null,
  });

  const [timeframe, setTimeframe] = useState("1D");
  const [showSummary, setShowSummary] = useState(false);
  const { addToWatchlist, removeFromWatchlist } = useWatchlistMutations();
  const { userId } = useAuth();
  const authModal = useAuthModal();
  const { setSelectedCompany } = useEarningsStore();
  const selectedTranscript = useEarningsStore(
    (state) => state.selectedTranscript
  );

  console.log("userId", userId);
  const { data: company, isLoading: isLoadingCompany } = useGetCompany(
    SelectedCompany?.companyId
  );

  // console.log(company);

  const { data: isWatchlisted, isLoading: isCheckingWatchlist } =
    useWatchlistCheck(SelectedCompany?.companyId);

  console.log(isWatchlisted);

  // const { data: liveCallData, isLoading: isLoadingLiveCall } = useGetLiveCall(
  //   company?.id
  // );

  if (isLoadingCompany) {
    return (
      <div className="space-y-6">
        <Card className="w-full shadow-sm dark:shadow-slate-800/50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-neutral-800">
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
        <Card className="w-full dark:bg-slate-900 ">
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
    <div className="space-y-4 mb-20 sm:mb-0">
      {!selectedTranscript && (
        <Card className="w-full bg-white dark:bg-slate-900 border-gray-200/50 dark:border-slate-700/50 shadow-sm dark:shadow-slate-800/50">
          <CardHeader className="space-y-4 pb-4 px-4">
            <CompanyHeader
              company={company}
              onBack={handleBack}
              onWatchlistClick={handleWatchlistClick}
              isWatchlisted={isWatchlisted}
              isCheckingWatchlist={isCheckingWatchlist}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
            />
          </CardHeader>
          <CardContent className="space-y-6 px-4 pb-4">
            {/* Stock Chart with Suspense */}
            <Suspense fallback={<StockChartSkeleton />}>
              <div className="bg-gray-50/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700/50 p-4 pb-8">
                <div className="h-[400px] w-full">
                  <StockPriceChart
                    todayData={(data) => {
                      setTodayPrices((prev) => ({ ...prev, ...data }));
                    }}
                    symbol={company.symbol}
                    timeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                  />
                </div>
              </div>
            </Suspense>

            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row justify-center w-full gap-4">
                <Button
                  className="w-full border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                  variant="ghost"
                  onClick={() =>
                    company.weburl
                      ? window.open(company.weburl, "_blank")
                      : null
                  }
                >
                  <span className="text-gray-700 dark:text-gray-200">{`${company.symbol} Website`}</span>
                </Button>
              </div>
            </div>

            {/* Company Info Table */}
            <div className="bg-gray-50/50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700/50 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {company.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {company.description}
              </p>
              <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                <tbody>
                  <tr>
                    <th className="py-2 text-gray-700 dark:text-gray-200">
                      Current Price
                    </th>
                    <td className="py-2">
                      $
                      {(isAfterHours
                        ? todayPrices.atClose
                        : todayPrices.regular) &&
                      todayPrices.regular &&
                      todayPrices.regular < 0
                        ? "-"
                        : ""}
                      {Math.abs(
                        (isAfterHours
                          ? todayPrices.atClose
                          : todayPrices.regular) || 0
                      ).toFixed(2)}{" "}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 text-gray-700 dark:text-gray-200">
                      Previous Close
                    </th>
                    <td className="py-2">
                      ${todayPrices.prevClose?.toFixed(2) || "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 text-gray-700 dark:text-gray-200">
                      Next Earnings
                    </th>
                    <td className="py-2">
                      {company.recentTranscripts?.[0]?.scheduledAt
                        ? formatDate(company.recentTranscripts[0].scheduledAt)
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recent Transcripts with Suspense */}
            {company.recentTranscripts &&
              company.recentTranscripts.length > 0 && (
                <Suspense fallback={<TranscriptsSkeleton />}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Recent Transcripts
                    </h3>
                    <CompanyTranscripts
                      transcripts={company.recentTranscripts}
                    />
                  </div>
                </Suspense>
              )}
          </CardContent>
        </Card>
      )}

      {/* Selected Transcript View */}
      {selectedTranscript && (
        <Card className="w-full dark:bg-slate-900 border-gray-200 dark:border-slate-700">
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
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {item.label}:
                        </span>{" "}
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

export default React.memo(FutureEarnings);
