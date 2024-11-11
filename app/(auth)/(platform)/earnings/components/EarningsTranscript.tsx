"use client";

import { useGetTranscriptData } from "@/app/hooks/use-get-transcript-data";
import { useEarningsStore } from "@/store/EarningsStore";
import { ChevronLeft, Volume2, Calendar, Clock } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const EarningsTranscript = () => {
  const transcriptId = useEarningsStore((state) => state.selectedTranscript);
  const setSelectedTranscript = useEarningsStore(
    (state) => state.setSelectedTranscript
  );
  const { data: transcript, isLoading } = useGetTranscriptData(transcriptId);

  console.log(transcript);

  console.log(transcript);
  const handleBack = () => {
    setSelectedTranscript(null);
  };

  if (isLoading) {
    return <TranscriptSkeleton />;
  }

  if (!transcript) return null;

  // Add check for scheduled status
  if (transcript.status === "SCHEDULED") {
    return (
      <div className="space-y-6 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        {/* Header */}
        <div className="space-y-4 border-b border-gray-200 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {transcript.title}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(transcript.scheduledAt), "MMMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {transcript.MarketTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state message */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Upcoming Earnings Call
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            This earnings call is scheduled for{" "}
            {format(
              new Date(transcript.scheduledAt),
              "MMMM d, yyyy 'at' h:mm a"
            )}
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-600">
            The transcript will be available after the call has concluded
          </div>
        </div>
      </div>
    );
  }

  // Split transcript into sections (this is a basic example - you might want to enhance this)
  const sections =
    transcript.fullText?.split("\n").filter((line) => line.trim()) || [];

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="space-y-4 border-b border-gray-200 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {transcript.title}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                {format(new Date(transcript.scheduledAt), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {transcript.MarketTime}
              </div>
            </div>
          </div>
        </div>

        {/* Audio Link if available */}
        {transcript.audioUrl && (
          <a
            href={transcript.audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            Listen to Audio Recording
          </a>
        )}
      </div>

      {/* Financial Results if available */}
      {(transcript.epsActual ||
        transcript.epsEstimate ||
        transcript.revenueActual ||
        transcript.revenueEstimate) && (
        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">EPS</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {transcript.epsActual
                  ? `$${transcript.epsActual.toFixed(2)}`
                  : "N/A"}
              </p>
              {transcript.epsEstimate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  vs ${transcript.epsEstimate.toFixed(2)} est.
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {transcript.revenueActual
                  ? `$${transcript.revenueActual.toFixed(2)}M`
                  : "N/A"}
              </p>
              {transcript.revenueEstimate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  vs ${transcript.revenueEstimate.toFixed(2)}M est.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transcript Content */}
      {transcript.fullText && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Transcript
          </h3>
          <div className="prose dark:prose-invert max-w-none space-y-4">
            {sections.map((section, index) => {
              const [speaker, ...content] = section.split(":");
              return (
                <div key={index} className="space-y-2">
                  {content.length > 0 ? (
                    <>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {speaker.trim()}:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {content.join(":").trim()}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {section}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const TranscriptSkeleton = () => (
  <div className="space-y-6 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <Skeleton className="h-[200px] w-full" />
  </div>
);

export default EarningsTranscript;
