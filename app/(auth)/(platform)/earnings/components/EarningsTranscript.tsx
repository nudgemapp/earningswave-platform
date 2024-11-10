"use client";

import { useWatchlistCheck } from "@/app/hooks/use-watchlist-check";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { Separator } from "@/components/ui/separator";
import { useAuthModal } from "@/store/AuthModalStore";
import { useEarningsStore } from "@/store/EarningsStore";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, StarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

interface EarningsTranscriptProps {
  transcriptData: EarningsCallTranscript;
}

const EarningsTranscript: React.FC<EarningsTranscriptProps> = ({
  transcriptData,
}) => {
  const { userId } = useAuth();
  const authModal = useAuthModal();
  const setSelectedTranscript = useEarningsStore(
    (state) => state.setSelectedTranscript
  );

  const { data: isWatchlisted, isLoading: isCheckingWatchlist } =
    useWatchlistCheck(transcriptData.companyId);

  const handleBack = () => {
    setSelectedTranscript(null);
    useEarningsStore.setState({ selectedCompany: null });
  };

  const handleWatchlistClick = async () => {
    // if (!userId) {
    //   authModal.onOpen();
    //   return;
    // }
    // try {
    //   if (isWatchlisted) {
    //     await removeFromWatchlist.mutateAsync(transcriptData.companyId);
    //     toast.success("Removed from watchlist");
    //   } else {
    //     await addToWatchlist.mutateAsync(transcriptData.companyId);
    //     toast.success("Added to watchlist");
    //   }
    // } catch {
    //   toast.error("Failed to update watchlist");
    // }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-900 overflow-y-auto">
      <div className="flex flex-col items-start mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors ${
                selectedDate ? "md:block" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="w-12 h-12 relative">
              <Image
                src={transcriptData.company_info.logo_base64}
                alt={`${transcriptData.company_info.company_name} logo`}
                layout="fill"
                objectFit="contain"
                className="rounded"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {transcriptData.company_info.company_name}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {transcriptData.company_info.ticker_symbol}
              </div>
            </div>
          </div>
          <button
            onClick={handleWatchlistClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-slate-700 rounded-full transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
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
                  ? "text-gray-300 dark:text-gray-600"
                  : isWatchlisted
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              fill={isWatchlisted ? "currentColor" : "none"}
              strokeWidth={2}
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Follow
            </span>
          </button>
        </div>
        <Separator className="my-4 bg-gray-200 dark:bg-slate-700" />
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {transcriptData.title}
      </h2>

      <div className="mb-4 space-y-2 text-gray-700 dark:text-gray-300">
        <p>
          <strong className="text-gray-900 dark:text-gray-100">Company:</strong>{" "}
          {transcriptData.company_info.company_name}
        </p>
        <p>
          <strong className="text-gray-900 dark:text-gray-100">Ticker:</strong>{" "}
          {transcriptData.company_info.ticker_symbol} (
          {transcriptData.company_info.ticker_change})
        </p>
        <p>
          <strong className="text-gray-900 dark:text-gray-100">Date:</strong>{" "}
          {transcriptData.company_info.date}
        </p>
        <p>
          <strong className="text-gray-900 dark:text-gray-100">Time:</strong>{" "}
          {transcriptData.company_info.time}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Contents
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          {transcriptData.contents.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Prepared Remarks
        </h3>
        {transcriptData.sections["Prepared Remarks"] ? (
          <div className="space-y-4">
            {transcriptData.sections["Prepared Remarks"].map(
              (remark, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
                >
                  <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {remark.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {remark.text}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No prepared remarks available for this transcript.
          </p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Questions and Answers
        </h3>
        {transcriptData.sections["Questions and Answers"] ? (
          <div className="space-y-4">
            {transcriptData.sections["Questions and Answers"].map(
              (qa, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
                >
                  <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {qa.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{qa.text}</p>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No questions and answers available for this transcript.
          </p>
        )}
      </div>
    </div>
  );
};

export default EarningsTranscript;
