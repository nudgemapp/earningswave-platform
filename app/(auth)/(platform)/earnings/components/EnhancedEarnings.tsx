"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HistoricalEarnings } from "../types";

interface CurrentReport {
  quarter: string;
  year: number;
  date: string;
  revenue: number;
  eps: number;
  revenueBeat: number;
  epsBeat: number;
}

interface EnhancedEarningsProps {
  currentReport: CurrentReport;
  historicalData: HistoricalEarnings[];
}

const EnhancedEarnings: React.FC<EnhancedEarningsProps> = ({
  currentReport,
}) => {
  const formatBeat = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const formatRevenue = (value: number) => {
    return `$${(value / 1e6).toFixed(2)}M`;
  };

  return (
    <div className="space-y-4">
      {/* Current Quarter Card */}
      <Card className="border-t-4 border-t-blue-500 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-800/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {`Q${currentReport.quarter} ${currentReport.year} Earnings`}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentReport.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Next Report
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                in 90 days
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Revenue
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatRevenue(currentReport.revenue)}
              </p>
              <p
                className={`text-sm ${
                  currentReport.revenueBeat >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatBeat(currentReport.revenueBeat)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">EPS</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ${currentReport.eps.toFixed(2)}
              </p>
              <p
                className={`text-sm ${
                  currentReport.epsBeat >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatBeat(currentReport.epsBeat)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Earnings */}
      {/* <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Previous Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {historicalData.map((quarter, index) => (
              <div key={index} className="border-b dark:border-slate-700 last:border-b-0">
                <button
                  onClick={() => setExpandedQuarter(expandedQuarter === quarter.quarter ? null : quarter.quarter)}
                  className="w-full py-3 px-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{quarter.quarter}</span>
                    <div className="flex gap-4">
                      <span className={`text-sm ${quarter.revenueBeat >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Rev: {formatBeat(quarter.revenueBeat)}
                      </span>
                      <span className={`text-sm ${quarter.epsBeat >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        EPS: {formatBeat(quarter.epsBeat)}
                      </span>
                    </div>
                  </div>
                </button>
                {expandedQuarter === quarter.quarter && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatRevenue(quarter.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">EPS</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">${quarter.eps.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default EnhancedEarnings;
