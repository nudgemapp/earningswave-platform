"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoricalEarnings, ProcessedReport } from "../types";


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

const EnhancedEarnings: React.FC<EnhancedEarningsProps> = ({ currentReport, historicalData }) => {
  const [expandedQuarter, setExpandedQuarter] = useState<string | null>(null);

  const formatBeat = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatRevenue = (value: number) => {
    return `$${(value / 1e6).toFixed(2)}M`;
  };

  return (
    <div className="space-y-4">
      {/* Current Quarter Card */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">{`Q${currentReport.quarter} ${currentReport.year} Earnings`}</h2>
              <p className="text-sm text-gray-500">{currentReport.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Next Report</p>
              <p className="text-sm text-gray-500">in 90 days</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-bold">{formatRevenue(currentReport.revenue)}</p>
              <p className={`text-sm ${currentReport.revenueBeat >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatBeat(currentReport.revenueBeat)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">EPS</p>
              <p className="text-lg font-bold">${currentReport.eps.toFixed(2)}</p>
              <p className={`text-sm ${currentReport.epsBeat >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatBeat(currentReport.epsBeat)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Earnings */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Previous Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {historicalData.map((quarter, index) => (
              <div key={index} className="border-b last:border-b-0">
                <button
                  onClick={() => setExpandedQuarter(expandedQuarter === quarter.quarter ? null : quarter.quarter)}
                  className="w-full py-3 px-4 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{quarter.quarter}</span>
                    <div className="flex gap-4">
                      <span className={`text-sm ${quarter.revenueBeat >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rev: {formatBeat(quarter.revenueBeat)}
                      </span>
                      <span className={`text-sm ${quarter.epsBeat >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        EPS: {formatBeat(quarter.epsBeat)}
                      </span>
                    </div>
                  </div>
                </button>
                {expandedQuarter === quarter.quarter && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50">
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="font-medium">{formatRevenue(quarter.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">EPS</p>
                      <p className="font-medium">${quarter.eps.toFixed(2)}</p>
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
