import React from "react";
import { Transcript } from "@prisma/client";
import { CalendarIcon, CheckCircle, Clock } from "lucide-react";
import { useEarningsStore } from "@/store/EarningsStore";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import { formatCurrency } from "@/lib/utils";

interface CompanyTranscriptsProps {
  transcripts: Transcript[];
}

const CompanyTranscripts: React.FC<CompanyTranscriptsProps> = ({
  transcripts,
}) => {
  const { isSignedIn } = useAuth();
  const authModal = useAuthModal();
  const { setSelectedTranscript } = useEarningsStore();

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleTranscriptClick = (transcriptId: string) => {
    if (!isSignedIn) {
      authModal.onOpen();
      return;
    }
    setSelectedTranscript(transcriptId);
  };

  return (
    <div className="space-y-2">
      {transcripts.map((transcript) => (
        <button
          key={transcript.id}
          onClick={() => handleTranscriptClick(transcript.id)}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              {transcript.status === "COMPLETED" ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Q{transcript.quarter || "?"} {transcript.year || ""} Earnings
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {formatDate(transcript.scheduledAt)} • {transcript.MarketTime}
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="space-y-0.5">
                <div className="text-gray-500 dark:text-gray-400">
                  (Est.) EPS:{" "}
                  <span className="text-gray-900 dark:text-gray-100">
                    {transcript.epsEstimate
                      ? formatCurrency(transcript.epsEstimate)
                      : "-"}
                  </span>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  (Est.) Rev:{" "}
                  <span className="text-gray-900 dark:text-gray-100">
                    {transcript.revenueEstimate
                      ? formatCurrency(transcript.revenueEstimate, true)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CompanyTranscripts;
