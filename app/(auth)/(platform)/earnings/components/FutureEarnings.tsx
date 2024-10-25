"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EarningsReport } from "@prisma/client";
import React from "react";
import { CalendarIcon, DollarSignIcon, TrendingUpIcon } from "lucide-react";

interface FutureEarningsProps {
  report: EarningsReport;
}

const FutureEarnings: React.FC<FutureEarningsProps> = ({ report }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {report.name} ({report.symbol})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium">
              Report Date: {report.reportDate.toLocaleDateString()}
            </span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <TrendingUpIcon className="w-5 h-5 text-gray-500" />
              <span>
                Fiscal Date Ending:{" "}
                {report.fiscalDateEnding.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="w-5 h-5 text-gray-500" />
              <span>
                Estimate:{" "}
                {report.estimate
                  ? `${report.estimate} ${report.currency}`
                  : "N/A"}
              </span>
            </div>
          </div>
          {/* Add more details about the future earnings report here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default FutureEarnings;
