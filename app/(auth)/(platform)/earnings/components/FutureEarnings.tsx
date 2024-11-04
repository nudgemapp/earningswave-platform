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
  const selectedDate = useEarningsStore((state) => state.selectedDate);
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
      <Card className="w-full shadow-lg bg-white">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {(selectedDate || window.innerWidth < 768) && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden md:[&:has(~[data-selected-date])]:block"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {report.company?.logo && (
                <div className="w-12 h-12 relative">
                  <Image
                    src={report.company.logo}
                    alt={`${report.name} logo`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded"
                  />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl font-bold">
                  {report.name}
                </CardTitle>
                <div className="text-sm text-gray-500">{report.symbol}</div>
              </div>
            </div>
            <button
              onClick={handleWatchlistClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-full transition-colors hover:bg-gray-50 disabled:opacity-50"
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
                    ? "text-gray-300"
                    : isWatchlisted
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
                fill={isWatchlisted ? "currentColor" : "none"}
                strokeWidth={2}
              />
              <span className="font-medium">Follow</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="font-medium">REV</span>
              <div className="flex items-center gap-8">
                <span className="text-gray-500">
                  {formatCurrency(report.estimate)} (est)
                </span>
                <span>{formatCurrency(report.estimate)}</span>
                <span
                  className={`${
                    Number(
                      calculatePercentageChange(
                        report.estimate,
                        report.estimate
                      )
                    ) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  } font-medium`}
                >
                  {calculatePercentageChange(report.estimate, report.estimate)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="font-medium">EPS</span>
              <div className="flex items-center gap-8">
                <span className="text-gray-500">
                  ${report.estimate?.toFixed(2)} (est)
                </span>
                <span>${report.estimate?.toFixed(2)}</span>
                <span
                  className={`${
                    Number(
                      calculatePercentageChange(
                        report.estimate,
                        report.estimate
                      )
                    ) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  } font-medium`}
                >
                  {calculatePercentageChange(report.estimate, report.estimate)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <div className="space-y-4">
                  <StockPriceChart
                    symbol={report.symbol}
                    timeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                  />
                </div>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => setShowSummary(true)}
              className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              <span>Summary</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <FileDown className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {!isLoading && (
        <EnhancedEarnings
          currentReport={{
            quarter: `Q${quarterNum}`,
            year: new Date(report.fiscalDateEnding).getFullYear(),
            date: new Date(report.reportDate).toLocaleDateString(),
            revenue: Number(report.estimate) || 0, // Ensure it's a number
            eps: Number(report.estimate) || 0, // Ensure it's a number
            revenueBeat: 0,
            epsBeat: epsBeat,
          }}
          historicalData={historicalData}
        />
      )}

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {report.name} ({report.symbol}) - Earnings Summary
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Company Information
                </h3>
                <div className="space-y-2 text-sm">
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
                <h3 className="font-semibold text-gray-900">
                  Financial Metrics
                </h3>
                <div className="space-y-2 text-sm">
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
