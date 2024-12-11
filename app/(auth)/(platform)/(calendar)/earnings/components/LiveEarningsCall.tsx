"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  CalendarIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLiveCall } from "@/app/hooks/use-get-live-call";

// interface LiveCall {
//   symbol: string;
//   scheduledTime: string;
//   quarter: number;
//   year: number;
//   eventName: string;
//   audioUrl: string;
//   recording: string;
//   isLive: boolean;
// }

interface LiveEarningsCallProps {
  companyId: string;
}

const LiveEarningsCallSkeleton = () => (
  <div className="overflow-hidden border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 transition-all duration-200">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <Skeleton className="h-8 w-[120px] rounded-full" />
      </div>

      {/* Info Section Skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>

    {/* Audio Controls Skeleton */}
    <div className="border-t border-gray-100 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="w-32 h-10 rounded-full" />
      </div>
    </div>
  </div>
);

const LiveEarningsCall: React.FC<LiveEarningsCallProps> = ({ companyId }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [timeUntilCall, setTimeUntilCall] = useState<string>("");

  const { data: liveCallData, isLoading } = useGetLiveCall(companyId);

  console.log(liveCallData);

  useEffect(() => {
    if (liveCallData?.calls?.[0]) {
      setCurrentCall(liveCallData.calls[0]);
    }
  }, [liveCallData]);

  useEffect(() => {
    if (!currentCall?.audioUrl || !audioRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentCall.audioUrl);
      hls.attachMedia(audioRef.current);
    }
  }, [currentCall?.audioUrl]);

  useEffect(() => {
    const updateTimeUntilCall = () => {
      if (!currentCall?.scheduledTime) return;

      const now = new Date();
      const callTime = new Date(currentCall.scheduledTime);
      const diff = callTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilCall("Live Now");
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const hours = Math.floor(minutes / 60);
      setTimeUntilCall(`Starts in ${hours}h ${minutes % 60}m`);
    };

    updateTimeUntilCall();
    const interval = setInterval(updateTimeUntilCall, 60000);
    return () => clearInterval(interval);
  }, [currentCall?.scheduledTime]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isLoading) {
    return <LiveEarningsCallSkeleton />;
  }

  console.log(currentCall);

  if (!liveCallData?.calls?.length || !currentCall || !currentCall.audioUrl)
    return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div className="overflow-hidden border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Header Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-50 dark:bg-red-500/10 p-2">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                {currentCall.eventName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <CalendarIcon className="w-4 h-4" />
                {formatDate(currentCall.scheduledTime)}
              </div>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
              {timeUntilCall}
            </span>
          </div> */}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="border-t border-gray-100 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={togglePlay}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Listen Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default LiveEarningsCall;
