"use client";

import { useWatchlistCheck } from "@/app/hooks/use-watchlist-check";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { Separator } from "@/components/ui/separator";
import { useEarningsStore } from "@/store/EarningsStore";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
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
  const selectedDate = useEarningsStore((state) => state.selectedDate);
  const { addToWatchlist, removeFromWatchlist } = useWatchlistMutations();

  const { data: isWatchlisted, isLoading: isCheckingWatchlist } =
    useWatchlistCheck(transcriptData.companyId);

  const handleBack = () => {
    useEarningsStore.setState({ selectedCompany: null });
  };

  const handleWatchlistClick = async () => {
    try {
      if (isWatchlisted) {
        await removeFromWatchlist.mutateAsync(transcriptData.companyId);
        toast.success("Removed from watchlist");
      } else {
        await addToWatchlist.mutateAsync(transcriptData.companyId);
        toast.success("Added to watchlist");
      }
    } catch (error) {
      toast.error("Failed to update watchlist");
    }
  };

  return (
    <div className="p-4 bg-white overflow-y-auto">
      <div className="flex flex-col items-start mb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden ${
                selectedDate ? "md:block" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
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
              <h2 className="text-2xl font-bold">
                {transcriptData.company_info.company_name}
              </h2>
              <div className="text-sm text-gray-500">
                {transcriptData.company_info.ticker_symbol}
              </div>
            </div>
          </div>
          <button
            onClick={handleWatchlistClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-full transition-colors hover:bg-gray-50 disabled:opacity-50"
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
                  ? "text-gray-300"
                  : isWatchlisted
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
              fill={isWatchlisted ? "currentColor" : "none"}
              strokeWidth={2}
            />
            <span className="font-medium">Follow</span>
          </button>
        </div>
        <Separator className="my-4" />
      </div>

      <h2 className="text-xl font-semibold mb-4">{transcriptData.title}</h2>

      <div className="mb-4">
        <p>
          <strong>Company:</strong> {transcriptData.company_info.company_name}
        </p>
        <p>
          <strong>Ticker:</strong> {transcriptData.company_info.ticker_symbol} (
          {transcriptData.company_info.ticker_change})
        </p>
        <p>
          <strong>Date:</strong> {transcriptData.company_info.date}
        </p>
        <p>
          <strong>Time:</strong> {transcriptData.company_info.time}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Contents</h3>
        <ul className="list-disc pl-5">
          {transcriptData.contents.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Prepared Remarks</h3>
        {transcriptData.sections["Prepared Remarks"] ? (
          transcriptData.sections["Prepared Remarks"].map((remark, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{remark.name}</p>
              <p>{remark.text}</p>
            </div>
          ))
        ) : (
          <p>No prepared remarks available for this transcript.</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Questions and Answers</h3>
        {transcriptData.sections["Questions and Answers"] ? (
          transcriptData.sections["Questions and Answers"].map((qa, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{qa.name}</p>
              <p>{qa.text}</p>
            </div>
          ))
        ) : (
          <p>No questions and answers available for this transcript.</p>
        )}
      </div>
    </div>
  );
};

export default EarningsTranscript;
