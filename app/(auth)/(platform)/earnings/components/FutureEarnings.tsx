"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { FileText, FileDown } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { ProcessedReport } from "../types";
import EnhancedEarnings from './EnhancedEarnings';

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
  const [timeframe, setTimeframe] = useState('1M');
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalEarnings[]>([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!report.companyId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/earnings/history/${report.companyId}`);
        if (!response.ok) throw new Error('Failed to fetch historical data');
        const data = await response.json();
        setHistoricalData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [report.companyId]);

  const calculatePercentageChange = (actual: number | null, estimate: number | null): string => {
    if (!actual || !estimate) return "0.00%";
    const change = ((actual - estimate) / Math.abs(estimate)) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const formatCurrency = (value: number | null): string => {
    if (value === null) return 'N/A';
    const absValue = Math.abs(value);
    if (absValue >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (absValue >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const generateMockData = () => {
    const mockData = [];
    const basePrice = 150;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const open = basePrice + Math.random() * 10 - 5;
      const close = basePrice + Math.random() * 10 - 5;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      const volume = Math.random() * 1000000;

      mockData.push({
        date: date.toISOString().split('T')[0],
        open,
        close,
        high,
        low,
        volume,
        gain: close > open,
      });
    }
    return mockData;
  };

  const data = generateMockData();
  const timeframeButtons = ['1D', '1W', '1M', '6M', '1Y'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white shadow-lg rounded-lg p-3 border">
          <p className="text-gray-600">
            {new Date(data.date).toLocaleDateString()}
          </p>
          <p className="font-semibold">Open: ${data.open.toFixed(2)}</p>
          <p className="font-semibold">Close: ${data.close.toFixed(2)}</p>
          <p className="font-semibold">High: ${data.high.toFixed(2)}</p>
          <p className="font-semibold">Low: ${data.low.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Get current quarter number
  const quarterNum = Math.floor(new Date(report.fiscalDateEnding).getMonth() / 3) + 1;
  const epsBeat = report.lastYearEPS
    ? ((report.estimate || 0) - report.lastYearEPS) / Math.abs(report.lastYearEPS) * 100
    : 0;

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg bg-white">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
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
                <div className="text-sm text-gray-500">
                  {report.symbol}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="font-medium">REV</span>
              <div className="flex items-center gap-8">
                <span className="text-gray-500">{formatCurrency(report.estimate)} (est)</span>
                <span>{formatCurrency(report.estimate)}</span>
                <span className={`${Number(calculatePercentageChange(report.estimate, report.estimate)) >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {calculatePercentageChange(report.estimate, report.estimate)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="font-medium">EPS</span>
              <div className="flex items-center gap-8">
                <span className="text-gray-500">${report.estimate?.toFixed(2)} (est)</span>
                <span>${report.estimate?.toFixed(2)}</span>
                <span className={`${Number(calculatePercentageChange(report.estimate, report.estimate)) >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {calculatePercentageChange(report.estimate, report.estimate)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">Price History</div>
              <div className="flex gap-2">
                {timeframeButtons.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      timeframe === tf
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="price"
                    domain={['auto', 'auto']}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    tickLine={false}
                    axisLine={false}
                    hide
                  />
                  <Tooltip content={CustomTooltip} />
                  <Bar
                    dataKey="volume"
                    yAxisId="volume"
                    fill="#E5ECF6"
                    opacity={0.5}
                    barSize={20}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    yAxisId="price"
                    stroke="#2563EB"
                    dot={false}
                    strokeWidth={2}
                  />
                </ComposedChart>
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
          eps: Number(report.estimate) || 0,     // Ensure it's a number
          revenueBeat: 0, // Will need lastYearRevenue for this
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
                <h3 className="font-semibold text-gray-900">Company Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Report Date:</span> {new Date(report.reportDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Fiscal Period:</span> {new Date(report.fiscalDateEnding).toLocaleDateString()}</p>
                  <p><span className="font-medium">Market Timing:</span> {report.marketTiming}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Financial Metrics</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Current EPS Estimate:</span> ${report.estimate?.toFixed(2)}</p>
                  <p><span className="font-medium">Last Year EPS:</span> ${report.lastYearEPS?.toFixed(2)}</p>
                  <p><span className="font-medium">Revenue Estimate:</span> {formatCurrency(report.estimate)}</p>
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
