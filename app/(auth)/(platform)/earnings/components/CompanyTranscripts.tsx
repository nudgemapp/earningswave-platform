import React from "react";
import { Transcript } from "@prisma/client";
import { CalendarIcon, CheckCircle, Clock } from "lucide-react";
import { useEarningsStore } from "@/store/EarningsStore";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";

interface CompanyTranscriptsProps {
  transcripts: Transcript[];
}

const CompanyTranscripts: React.FC<CompanyTranscriptsProps> = ({
  transcripts,
}) => {
  const { isSignedIn } = useAuth();
  const authModal = useAuthModal();
  const subscriptionModal = useSubscriptionModal();
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
    <div className="space-y-4">
      {transcripts.map((transcript) => (
        <button
          key={transcript.id}
          onClick={() => handleTranscriptClick(transcript.id)}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
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
                  {formatDate(transcript.scheduledAt)} ({transcript.MarketTime})
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {transcript.status}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CompanyTranscripts;
