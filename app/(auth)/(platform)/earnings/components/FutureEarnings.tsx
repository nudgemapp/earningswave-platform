"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  FileText,
  FileDown,
  ChevronLeft,
  Star as StarIcon,
} from "lucide-react";
import { ResponsiveContainer } from "recharts";
import { ProcessedReport } from "../types";
import EnhancedEarnings from "./EnhancedEarnings";
import { useEarningsStore } from "@/store/EarningsStore";
import StockPriceChart from "./StockPriceChart";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { toast } from "sonner";
import { useWatchlistCheck } from "@/app/hooks/use-watchlist-check";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import AIEarningsAnalysis from "./AIEarnings";

interface FutureEarningsProps {
  report: ProcessedReport;
}

interface HistoricalEarnings {
  quarter: string;
  date: string;
  revenueBeat: number;
  epsBeat: number;
  revenue: number;
  eps: number;
}

const FutureEarnings: React.FC<FutureEarningsProps> = ({ report }) => {
  const [timeframe, setTimeframe] = useState("1M");
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalEarnings[]>(
    []
  );
  const { addToWatchlist, removeFromWatchlist } = useWatchlistMutations();
  const { userId } = useAuth();
  const authModal = useAuthModal();

  // Add this query to check if company is in watchlist
  const { data: isWatchlisted, isLoading: isCheckingWatchlist } =
    useWatchlistCheck(report.companyId);

  const handleWatchlistClick = async () => {
    if (!userId) {
      authModal.onOpen();
      return;
    }

    console.log("isWatchlisted", isWatchlisted);

    try {
      if (isWatchlisted) {
        await removeFromWatchlist.mutateAsync(report.companyId);
        toast.success("Removed from watchlist");
      } else {
        await addToWatchlist.mutateAsync(report.companyId);
        toast.success("Added to watchlist");
      }
    } catch {
      toast.error("Failed to update watchlist");
    }
  };

  //change to use useQuery
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!report.companyId) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/earnings/history/${report.companyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch historical data");
        const data = await response.json();
        setHistoricalData(data);
      } catch (_error) {
        console.error("Error fetching historical data:", _error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [report.companyId]);

  const calculatePercentageChange = (
    actual: number | null,
    estimate: number | null
  ): string => {
    if (!actual || !estimate) return "0.00%";
    const change = ((actual - estimate) / Math.abs(estimate)) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const formatCurrency = (value: number | null): string => {
    if (value === null) return "N/A";
    const absValue = Math.abs(value);
    if (absValue >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (absValue >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };
  // Get current quarter number
  const quarterNum =
    Math.floor(new Date(report.fiscalDateEnding).getMonth() / 3) + 1;
  const epsBeat = report.lastYearEPS
    ? (((report.estimate || 0) - report.lastYearEPS) /
        Math.abs(report.lastYearEPS)) *
      100
    : 0;

  const handleBack = () => {
    useEarningsStore.setState({ selectedFutureEarnings: null });
  };

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
              {report.company?.logo && (
                <div className="w-12 h-12 relative shrink-0">
                  <Image
                    src={report.company.logo}
                    alt={`${report.name} logo`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded"
                  />
                </div>
              )}
              <div className="min-w-0">
                <CardTitle className="text-2xl font-bold break-words text-gray-900 dark:text-gray-100">
                  {report.name}
                </CardTitle>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {report.symbol}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
            <button
              onClick={() => setShowSummary(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-slate-700 rounded-full transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <FileText
                className="w-4 h-4 text-gray-400 dark:text-gray-500"
                strokeWidth={2}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Summary
              </span>
            </button>
            <button
              onClick={() => setShowSummary(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-slate-700 rounded-full transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <FileDown
                className="w-4 h-4 text-gray-400 dark:text-gray-500"
                strokeWidth={2}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Report
              </span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                REV
              </span>
              <div className="flex items-center gap-8">
                <span className="text-gray-500 dark:text-gray-400">
                  {formatCurrency(report.estimate)} (est)
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {formatCurrency(report.estimate)}
                </span>
                <span
                  className={`${
                    Number(
                      calculatePercentageChange(
                        report.estimate,
                        report.estimate
                      )
                    ) >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  } font-medium`}
                >
                  {calculatePercentageChange(report.estimate, report.estimate)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                EPS
              </span>
              <div className="flex items-center gap-8">
                <span className="text-gray-500 dark:text-gray-400">
                  ${report.estimate?.toFixed(2)} (est)
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  ${report.estimate?.toFixed(2)}
                </span>
                <span
                  className={`${
                    Number(
                      calculatePercentageChange(
                        report.estimate,
                        report.estimate
                      )
                    ) >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  } font-medium`}
                >
                  {calculatePercentageChange(report.estimate, report.estimate)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-[300px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <StockPriceChart
                  symbol={report.symbol}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                />
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isLoading && (
        <EnhancedEarnings
          currentReport={{
            quarter: `Q${quarterNum}`,
            year: new Date(report.fiscalDateEnding).getFullYear(),
            date: new Date(report.reportDate).toLocaleDateString(),
            revenue: Number(report.estimate) || 0,
            eps: Number(report.estimate) || 0,
            revenueBeat: 0,
            epsBeat: epsBeat,
          }}
          historicalData={historicalData}
        />
      )}

      <AIEarningsAnalysis report={report} />

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {report.name} ({report.symbol}) - Earnings Summary
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
                    <span className="font-medium">Report Date:</span>{" "}
                    {new Date(report.reportDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Fiscal Period:</span>{" "}
                    {new Date(report.fiscalDateEnding).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Market Timing:</span>{" "}
                    {report.marketTiming}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Financial Metrics
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Current EPS Estimate:</span> $
                    {report.estimate?.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Last Year EPS:</span> $
                    {report.lastYearEPS?.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Revenue Estimate:</span>{" "}
                    {formatCurrency(report.estimate)}
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
