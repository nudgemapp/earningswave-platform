import React, { useMemo, useEffect, useState } from "react";
import {
  Company,
  MarketTime,
  Transcript,
  TranscriptStatus,
} from "@prisma/client";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEarningsStore } from "@/store/EarningsStore";
import { useUser } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import { formatCurrency } from "@/lib/utils";
import { useRef } from "react";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";
import { useUserSubscription } from "@/app/hooks/use-user-subscription";
import AIEarningsAnalysis from "./AIEarnings";
import { useUpcomingEarnings } from "@/app/hooks/use-upcoming-earnings";
import { useCalendarStore } from "@/store/CalendarStore";

interface CompanyTranscriptsProps {
  transcripts: Transcript[];
  company: Company;
}

interface FinnhubEarnings {
  date: string;
  epsActual: number;
  epsEstimate: number;
  hour: string;
  quarter: number;
  revenueActual: number;
  revenueEstimate: number;
  symbol: string;
  year: number;
}

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const { user } = useUser();
  const authModal = useAuthModal();
  const subscriptionModal = useSubscriptionModal();
  const { data: subscription } = useUserSubscription(user?.id);
  const hasActiveSubscription = subscription?.isActive;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (!user) {
      authModal.onOpen();
      return;
    }

    if (!hasActiveSubscription) {
      subscriptionModal.onOpen();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(audioRef.current.currentTime + seconds, 0),
        duration
      );
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={restart}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => skip(-10)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <SkipBack className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            ) : (
              <Play className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            )}
          </button>
          <button
            onClick={() => skip(10)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-12">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-500 dark:[&::-webkit-slider-thumb]:bg-gray-300"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400 w-12">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

const CompanyTranscripts: React.FC<CompanyTranscriptsProps> = ({
  transcripts,
  company,
}) => {
  const { user } = useUser();
  const authModal = useAuthModal();
  const subscriptionModal = useSubscriptionModal();
  const {
    setSelectedTranscript,
    selectedAiTranscript,
    setSelectedAiTranscript,
  } = useEarningsStore();

  const { data: subscription } = useUserSubscription(user?.id);
  const { data: earningsData } = useUpcomingEarnings(company.symbol);

  const hasActiveSubscription = subscription?.isActive;

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const handleTranscriptClick = (transcriptId: string) => {
    if (!user) {
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

  const handleAiSummary = (transcriptId: string) => {
    if (!user) {
      authModal.onOpen();
      return;
    }

    if (hasActiveSubscription) {
      setSelectedAiTranscript(
        selectedAiTranscript === transcriptId ? null : transcriptId
      );
    } else {
      subscriptionModal.onOpen();
    }
  };

  const [finnhubData, setFinnhubData] = useState<FinnhubEarnings[]>([]);
  const [isFinnhubLoading, setIsFinnhubLoading] = useState(true);
  const { currentDate, view } = useCalendarStore();

  // Fetch Finnhub data
  useEffect(() => {
    const fetchFinnhubData = async () => {
      setIsFinnhubLoading(true);
      try {
        const from = new Date().toISOString().split("T")[0];
        const to = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const response = await fetch(
          `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${company.symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch Finnhub data");

        const data = await response.json();
        setFinnhubData(data.earningsCalendar || []);
      } catch (error) {
        console.error("Error fetching Finnhub data:", error);
        setFinnhubData([]);
      } finally {
        setIsFinnhubLoading(false);
      }
    };

    fetchFinnhubData();
  }, [company.symbol]);

  // Filter and combine earnings data
  const upcomingTranscripts = useMemo(() => {
    // Don't process anything while Finnhub is loading
    if (isFinnhubLoading) {
      return [];
    }

    // First check if we have Finnhub data
    if (finnhubData.length > 0) {
      const finnhubTranscripts = finnhubData.map((earning) => {
        const [year, month, day] = earning.date.split("-").map(Number);
        const scheduledDate = new Date(Date.UTC(year, month - 1, day));

        return {
          id: `${earning.symbol}_${earning.year}_Q${earning.quarter}`,
          companyId: company.id,
          title: `${earning.symbol} Q${earning.quarter} ${earning.year} Earnings Call`,
          status: "SCHEDULED" as TranscriptStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
          scheduledAt: scheduledDate,
          quarter: earning.quarter,
          year: earning.year,
          audioUrl: null,
          MarketTime: earning.hour.toUpperCase() as MarketTime,
          epsEstimate:
            earning.epsEstimate != null
              ? Number(earning.epsEstimate.toFixed(2))
              : null,
          epsActual:
            earning.epsActual != null ? Number(earning.epsActual) : null,
          revenueEstimate:
            earning.revenueEstimate != null
              ? earning.revenueEstimate / 1e9
              : null,
          revenueActual:
            earning.revenueActual != null ? earning.revenueActual : null,
          fullText: null,
          speakers: null,
          aiSummary: null,
          aiKeyPoints: null,
          aiSentimentAnalysis: null,
          aiLastUpdated: null,
        };
      });

      // console.log("Returning Finnhub transcripts:", finnhubTranscripts);
      return finnhubTranscripts;
    }

    // Only use earnings data if Finnhub returned no results
    if (earningsData?.upcomingEarnings) {
      // console.log(
      //   "Falling back to database earnings:",
      //   earningsData.upcomingEarnings
      // );
      return earningsData.upcomingEarnings.map((earning) => ({
        id: earning.id,
        companyId: company.id,
        title: `${earning.symbol} Q${earning.quarter} ${earning.year} Earnings Call`,
        status: "SCHEDULED" as TranscriptStatus,
        createdAt: earning.createdAt,
        updatedAt: earning.updatedAt,
        scheduledAt: new Date(earning.earningsDate),
        quarter: earning.quarter,
        year: earning.year,
        audioUrl: null,
        MarketTime: earning.marketTime || "BMO",
        epsEstimate: earning.earningsEstimate,
        epsActual: null,
        revenueEstimate: earning.revenueEstimate
          ? parseFloat(earning.revenueEstimate)
          : null,
        revenueActual: null,
        fullText: null,
        speakers: null,
        aiSummary: null,
        aiKeyPoints: null,
        aiSentimentAnalysis: null,
        aiLastUpdated: null,
      }));
    }

    return [];
  }, [
    finnhubData,
    isFinnhubLoading,
    earningsData?.upcomingEarnings,
    company.id,
  ]);

  // Filter recentTranscripts to only show completed ones
  const recentTranscripts = transcripts.filter((t) => t.status === "COMPLETED");

  // Show loading state while fetching Finnhub data
  if (isFinnhubLoading) {
    return <div>Loading earnings data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Transcripts Section */}
      {upcomingTranscripts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Upcoming Transcripts
          </h2>
          <div className="space-y-2">
            {upcomingTranscripts.map((transcript) => (
              <button
                key={transcript.id}
                // onClick={() => handleTranscriptClick(transcript.id)}
                className="w-full text-left group"
              >
                <div className="overflow-hidden border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 transition-all duration-200 shadow-sm hover:shadow-md">
                  {/* Main Card Content */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {transcript.status === "COMPLETED" ? (
                        <div className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 p-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-blue-50 dark:bg-blue-500/10 p-1.5">
                          <Clock className="w-4 h-4 text-blue-500" />
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
                    <div className="border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 divide-x divide-gray-100 dark:divide-slate-800">
                      {/* EPS Column - Only show if there's EPS data */}
                      {(transcript.epsActual !== null ||
                        transcript.epsEstimate !== null) && (
                        <div className="p-3 transition-colors group-hover:bg-gray-50/50 dark:group-hover:bg-slate-800/50">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {transcript.status === "COMPLETED"
                              ? "EPS"
                              : "Est. EPS"}
                          </div>
                          {transcript.status === "COMPLETED" &&
                          transcript.epsActual !== null ? (
                            <div>
                              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {formatCurrency(transcript.epsActual)}
                              </span>
                              {transcript.epsEstimate !== null && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  vs est.{" "}
                                  {formatCurrency(transcript.epsEstimate)}
                                  <span
                                    className={`ml-1 ${
                                      transcript.epsActual >
                                      transcript.epsEstimate
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
                        <div className="p-3 transition-colors group-hover:bg-gray-50/50 dark:group-hover:bg-slate-800/50">
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
                                  {formatCurrency(
                                    transcript.revenueEstimate,
                                    true
                                  )}
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
                                ? formatCurrency(
                                    transcript.revenueEstimate,
                                    true
                                  )
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
        </div>
      )}

      {/* Recent Transcripts Section */}
      {recentTranscripts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Recent Earnings
          </h2>
          <div className="space-y-4">
            {recentTranscripts.map((transcript) => (
              <div key={transcript.id}>
                <div className="overflow-hidden border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 transition-all duration-200 shadow-sm hover:shadow-md">
                  {/* Main Card Content */}
                  <div
                    onClick={() => handleTranscriptClick(transcript.id)}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
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

                  {/* Financial Data Section */}
                  {hasFinancialData(transcript) && (
                    <div className="border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 divide-x divide-gray-100 dark:divide-slate-800">
                      {/* EPS Column - Only show if there's EPS data */}
                      {(transcript.epsActual !== null ||
                        transcript.epsEstimate !== null) && (
                        <div className="p-4 transition-colors group-hover:bg-gray-50/50 dark:group-hover:bg-slate-800/50">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {transcript.status === "COMPLETED"
                              ? "EPS"
                              : "Est. EPS"}
                          </div>
                          {transcript.status === "COMPLETED" &&
                          transcript.epsActual !== null ? (
                            <div>
                              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {formatCurrency(transcript.epsActual)}
                              </span>
                              {transcript.epsEstimate !== null && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  vs est.{" "}
                                  {formatCurrency(transcript.epsEstimate)}
                                  <span
                                    className={`ml-1 ${
                                      transcript.epsActual >
                                      transcript.epsEstimate
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
                                  {formatCurrency(
                                    transcript.revenueEstimate,
                                    true
                                  )}
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
                                ? formatCurrency(
                                    transcript.revenueEstimate,
                                    true
                                  )
                                : "-"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Audio Player */}
                  {transcript.status === "COMPLETED" && transcript.audioUrl && (
                    <AudioPlayer audioUrl={transcript.audioUrl} />
                  )}

                  {/* Action Buttons Section */}
                  {transcript.status === "COMPLETED" && (
                    <div className="border-t border-gray-100 dark:border-slate-800">
                      <div className="p-3 space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              company.weburl
                                ? window.open(company.weburl, "_blank")
                                : null
                            }
                            className="flex-1 py-2 px-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            Website
                          </button>
                          <button
                            onClick={() => handleTranscriptClick(transcript.id)}
                            className="flex-1 py-2 px-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            Transcript
                          </button>
                        </div>
                        <button
                          onClick={() => handleAiSummary(transcript.id)}
                          className={`w-full py-2 px-4 ${
                            selectedAiTranscript === transcript.id
                              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200"
                              : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                          } rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 flex items-center justify-center gap-2`}
                        >
                          AI Summary
                        </button>
                      </div>

                      {/* AI Summary Panel */}
                      {selectedAiTranscript === transcript.id && (
                        <div className="border-t border-gray-100 dark:border-slate-800">
                          <AIEarningsAnalysis
                            company={{
                              ...company,
                              recentTranscripts: [transcript],
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTranscripts;
