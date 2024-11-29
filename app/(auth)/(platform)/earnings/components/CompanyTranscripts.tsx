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

  const hasFinancialData = (transcript: Transcript) => {
    return (
      transcript.epsActual !== null ||
      transcript.epsEstimate !== null ||
      transcript.revenueActual !== null ||
      transcript.revenueEstimate !== null
    );
  };

  return (
    <div className="space-y-4">
      {transcripts.map((transcript) => (
        <button
          key={transcript.id}
          onClick={() => handleTranscriptClick(transcript.id)}
          className="w-full text-left group"
        >
          <div className="overflow-hidden border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 transition-all duration-200 shadow-sm hover:shadow-md">
            {/* Main Card Content */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {transcript.status === "COMPLETED" ? (
                  <div className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 p-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                ) : (
                  <div className="rounded-full bg-blue-50 dark:bg-blue-500/10 p-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    Q{transcript.quarter || "?"} {transcript.year || ""}{" "}
                    Earnings Call
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(transcript.scheduledAt)} •{" "}
                    {transcript.MarketTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Data Footer - Only show if there's data */}
            {hasFinancialData(transcript) && (
              <div className="border-t border-gray-100 dark:border-slate-800 mt-2 grid grid-cols-2 divide-x divide-gray-100 dark:divide-slate-800">
                {/* EPS Column - Only show if there's EPS data */}
                {(transcript.epsActual !== null ||
                  transcript.epsEstimate !== null) && (
                  <div className="p-4 transition-colors group-hover:bg-gray-50/50 dark:group-hover:bg-slate-800/50">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {transcript.status === "COMPLETED" ? "EPS" : "Est. EPS"}
                    </div>
                    {transcript.status === "COMPLETED" &&
                    transcript.epsActual !== null ? (
                      <div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(transcript.epsActual)}
                        </span>
                        {transcript.epsEstimate !== null && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            vs est. {formatCurrency(transcript.epsEstimate)}
                            <span
                              className={`ml-1 ${
                                transcript.epsActual > transcript.epsEstimate
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }`}
                            >
                              (
                              {(
                                ((transcript.epsActual -
                                  transcript.epsEstimate) /
                                  transcript.epsEstimate) *
                                100
                              ).toFixed(1)}
                              %)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {transcript.epsEstimate
                          ? formatCurrency(transcript.epsEstimate)
                          : "-"}
                      </span>
                    )}
                  </div>
                )}

                {/* Revenue Column - Only show if there's Revenue data */}
                {(transcript.revenueActual !== null ||
                  transcript.revenueEstimate !== null) && (
                  <div className="p-4 transition-colors group-hover:bg-gray-50/50 dark:group-hover:bg-slate-800/50">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {transcript.status === "COMPLETED"
                        ? "Revenue"
                        : "Est. Revenue"}
                    </div>
                    {transcript.status === "COMPLETED" &&
                    transcript.revenueActual !== null ? (
                      <div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(transcript.revenueActual, true)}
                        </span>
                        {transcript.revenueEstimate !== null && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            vs est.{" "}
                            {formatCurrency(transcript.revenueEstimate, true)}
                            <span
                              className={`ml-1 ${
                                transcript.revenueActual >
                                transcript.revenueEstimate
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }`}
                            >
                              (
                              {(
                                ((transcript.revenueActual -
                                  transcript.revenueEstimate) /
                                  transcript.revenueEstimate) *
                                100
                              ).toFixed(1)}
                              %)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {transcript.revenueEstimate
                          ? formatCurrency(transcript.revenueEstimate, true)
                          : "-"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default CompanyTranscripts;
