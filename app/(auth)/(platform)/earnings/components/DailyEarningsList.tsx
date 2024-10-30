import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FileText, FileDown } from "lucide-react";
import { ProcessedReport } from "../types";

interface DailyEarningsListProps {
  date: Date;
  reports: ProcessedReport[];
}

const DailyEarningsList: React.FC<DailyEarningsListProps> = ({ date, reports }) => {
  const formatCurrency = (value: number | null): string => {
    if (value === null) return 'N/A';
    const absValue = Math.abs(value);

    if (absValue >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const calculatePercentageChange = (actual: number | null, estimate: number | null): string => {
    if (!actual || !estimate) return "0.00%";
    const change = ((actual - estimate) / Math.abs(estimate)) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const CompanyCard = ({ report }: { report: ProcessedReport }) => (
    <Card className="w-full shadow-sm bg-white mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {report.company?.logo && (
              <div className="w-10 h-10 relative">
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
              <CardTitle className="text-lg font-bold">
                {report.name}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {report.symbol}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {report.marketTiming?.replace('_', ' ')}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Revenue</div>
              <div className="text-sm">{formatCurrency(report.estimate)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">EPS</div>
              <div className="text-sm">${report.estimate?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Change</div>
              <div className={`text-sm ${Number(calculatePercentageChange(report.estimate, report.estimate)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatePercentageChange(report.estimate, report.estimate)}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 flex-1">
              <FileText className="w-4 h-4" />
              <span>Summary</span>
            </button>
            <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 flex-1">
              <FileDown className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full p-4 space-y-4">
      <div className="sticky top-0 bg-gray-100/80 p-4 backdrop-blur-sm z-10">
        <h2 className="text-xl font-bold">
          Earnings for {date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {reports.length} companies reporting
        </p>
      </div>

      <div className="space-y-4 pb-4">
        {reports.map((report, index) => (
          <CompanyCard key={`${report.symbol}-${index}`} report={report} />
        ))}
      </div>
    </div>
  );
};

export default DailyEarningsList;
