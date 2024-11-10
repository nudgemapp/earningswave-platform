import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transcript } from "@prisma/client";
import { CalendarIcon, CheckCircle, Clock } from "lucide-react";
import { useEarningsStore } from "@/store/EarningsStore";

interface CompanyTranscriptsProps {
  transcripts: Transcript[];
}

const CompanyTranscripts: React.FC<CompanyTranscriptsProps> = ({
  transcripts,
}) => {
  const setSelectedTranscript = useEarningsStore(
    (state) => state.setSelectedTranscript
  );

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleTranscriptClick = (transcriptId: string) => {
    setSelectedTranscript(transcriptId);
  };

  return (
    <Card className="shadow-sm dark:shadow-slate-800/50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Earnings History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transcripts.map((transcript) => (
            <div
              key={transcript.id}
              onClick={() => handleTranscriptClick(transcript.id)}
              className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {transcript.status === "COMPLETED" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-500" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Q{transcript.quarter} {transcript.year} Earnings
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(transcript.scheduledAt)} (
                    {transcript.MarketTime})
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {transcript.status}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyTranscripts;
