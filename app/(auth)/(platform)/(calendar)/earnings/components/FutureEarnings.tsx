"use client";

import React, { Suspense, useState } from "react";
import { CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  ChevronLeft,
  ShareIcon,
  Star as StarIcon,
  ExternalLink,
} from "lucide-react";
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
import LiveEarningsCall from "./LiveEarningsCall";
import { useInView } from "react-intersection-observer";
import { Separator } from "@/components/ui/separator";
import DailyStockChart from "@/components/DailyStockChart";
import { useTimeframeStore } from "@/store/TimeframeStore";
import StockPriceHeader from "@/components/StockPriceHeader";
import { useRouter } from "next/navigation";
// import {
//   CustomTabs,
//   CustomTabsList,
//   CustomTabsTrigger,
//   CustomTabsContent,
// } from "./CustomTabs";
// import InfoTab from "./InfoTab";

interface FutureEarningsProps {
  SelectedCompany: {
    companyId: string;
  };
}

type ExtendedCompany = Company & {
  recentTranscripts?: Transcript[];
};

type WatchlistMutation = {
  isPending: boolean;
  mutateAsync: (companyId: string) => Promise<void>;
};

interface CompanyHeaderProps {
  company: ExtendedCompany;
  onBack: () => void;
  onWatchlistClick: () => void;
  isWatchlisted: boolean | undefined;
  isCheckingWatchlist: boolean;
  addToWatchlist: WatchlistMutation;
  removeFromWatchlist: WatchlistMutation;
}

const StockChartSkeleton = () => (
  <div className="space-y-2">
    {/* Stock Price Header Skeleton */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-[150px]" />
      <Skeleton className="h-8 w-[100px]" />
    </div>

    {/* Chart Skeleton */}
    <div className="h-[330px] bg-gray-100 dark:bg-slate-800 animate-pulse rounded-lg" />

    {/* Timeframe Buttons Skeleton */}
    <div className="w-full mb-8">
      <div className="flex items-center justify-between w-full gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-16" />
        ))}
      </div>
    </div>
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

const StockChartContainer: React.FC<{ symbol: string }> = ({ symbol }) => {
  const timeframe = useTimeframeStore((state) => state.timeframe);
  const setTimeframe = useTimeframeStore((state) => state.setTimeframe);
  const timeframeButtons = ["1D", "1W", "1M", "6M", "1Y"];

  return (
    <div className="space-y-2">
      <StockPriceHeader symbol={symbol} />

      {/* Fixed height container for chart */}
      <div className="h-[330px] relative">
        {timeframe === "1D" ? (
          <DailyStockChart symbol={symbol} />
        ) : (
          <StockPriceChart symbol={symbol} />
        )}
      </div>

      {/* Timeframe buttons in a separate container */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between w-full gap-2">
          {timeframeButtons.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                timeframe === tf
                  ? "bg-gray-600/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company,
  onBack,
  onWatchlistClick,
  isWatchlisted,
  isCheckingWatchlist,
  addToWatchlist,
  removeFromWatchlist,
}) => {
  const router = useRouter();
  const { setSelectedCompany } = useEarningsStore();

  const handleCompanyClick = () => {
    setSelectedCompany({
      companyId: company.id,
      symbol: company.symbol,
    });
    router.push(`/quote/${company.symbol}`);
  };

  return (
    <div className="flex justify-between items-start w-full">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div
          onClick={handleCompanyClick}
          className="flex items-center gap-4 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
        >
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
      </div>

      <div className="flex items-center gap-2">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button
              onClick={handleCompanyClick}
              className="shrink-0 inline-flex items-center gap-2 p-2 text-sm font-medium rounded-full transition-colors
                bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300
                hover:bg-opacity-90 border border-gray-200 dark:border-slate-700"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-32">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View details
            </p>
          </HoverCardContent>
        </HoverCard>

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
                  isWatchlisted
                    ? "fill-blue-500 text-blue-500"
                    : "text-gray-400"
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
    </div>
  );
};

const FutureEarnings: React.FC<FutureEarningsProps> = ({ SelectedCompany }) => {
  const [showSummary, setShowSummary] = useState(false);
  const { addToWatchlist, removeFromWatchlist } = useWatchlistMutations();
  const { userId } = useAuth();
  const authModal = useAuthModal();
  const { setSelectedCompany } = useEarningsStore();
  const selectedTranscript = useEarningsStore(
    (state) => state.selectedTranscript
  );
  const { data: company, isLoading: isLoadingCompany } = useGetCompany(
    SelectedCompany?.companyId
  );

  const { data: isWatchlisted, isLoading: isCheckingWatchlist } =
    useWatchlistCheck(SelectedCompany?.companyId);

  const { ref: transcriptsRef } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  if (isLoadingCompany) {
    return (
      <div className="space-y-6 p-4">
        <div className="space-y-4">
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
        </div>
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
        <div className="space-y-4">
          <div className="px-2 pt-2">
            <CompanyHeader
              company={company}
              onBack={handleBack}
              onWatchlistClick={handleWatchlistClick}
              isWatchlisted={isWatchlisted}
              isCheckingWatchlist={isCheckingWatchlist}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
            />
          </div>
          <Separator className="mb-0" />
          <div className="px-0 pt-0">
            {/* <CustomTabs defaultValue="general" className="w-full -mt-3">
              <CustomTabsList className="mt-0">
                <CustomTabsTrigger value="general">General</CustomTabsTrigger>
                <CustomTabsTrigger value="info">Info</CustomTabsTrigger>
                <CustomTabsTrigger value="transcripts">
                  Transcripts
                </CustomTabsTrigger>
              </CustomTabsList> */}

            {/* <CustomTabsContent value="general" className="space-y-8 px-5"> */}
            <div className="space-y-8 px-5">
              <Suspense fallback={<StockChartSkeleton />}>
                <div className="h-[400px] w-full mb-16">
                  <StockChartContainer symbol={company.symbol} />
                </div>
              </Suspense>
              {/* <Suspense fallback={<StockChartSkeleton />}>
                <div className="h-[400px] w-full mb-12">
                  <StockPriceChart symbol={company.symbol} />
                </div>
              </Suspense> */}
              <Suspense fallback={null}>
                <LiveEarningsCall companyId={company.id} />
              </Suspense>
              <div ref={transcriptsRef}>
                <Suspense fallback={<TranscriptsSkeleton />}>
                  <CompanyTranscripts
                    transcripts={company.recentTranscripts || []}
                    company={company}
                  />
                </Suspense>
              </div>
            </div>
            {/* </CustomTabsContent> */}

            {/* <CustomTabsContent value="info" className="px-5">
                <div className="py-4">
                  <h3 className="text-lg font-semibold">Company Information</h3>
                  <InfoTab company={company} />
                </div>
              </CustomTabsContent>

              <CustomTabsContent value="transcripts" className="px-5">
                <div>
                  {isTranscriptsVisible && hasValidTranscripts(company) && (
                    <Suspense fallback={<TranscriptsSkeleton />}>
                      <CompanyTranscripts
                        transcripts={company.recentTranscripts}
                        company={company}
                      />
                    </Suspense>
                  )}
                </div>
              </CustomTabsContent> */}
            {/* </CustomTabs> */}
          </div>
        </div>
      )}

      {/* Selected Transcript View */}
      {selectedTranscript && (
        <div className="px-2">
          <EarningsTranscript />
        </div>
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
