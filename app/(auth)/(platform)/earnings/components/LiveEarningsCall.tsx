"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLiveCall } from "@/app/hooks/use-get-live-call";
import { motion } from "framer-motion";
import { LiveCall } from "../types";

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
  const [currentCall, setCurrentCall] = useState<LiveCall["calls"][0] | null>(
    null
  );
  // const [duration, setDuration] = useState(0);
  // const [currentTime, setCurrentTime] = useState(0);

  const { data: liveCallData, isLoading } = useGetLiveCall(companyId);

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

  // useEffect(() => {
  //   if (!audioRef.current) return;

  //   const audio = audioRef.current;

  //   const handleTimeUpdate = () => {
  //     setCurrentTime(audio.currentTime);
  //   };

  //   const handleDurationChange = () => {
  //     setDuration(audio.duration);
  //   };

  //   audio.addEventListener("timeupdate", handleTimeUpdate);
  //   audio.addEventListener("durationchange", handleDurationChange);

  //   return () => {
  //     audio.removeEventListener("timeupdate", handleTimeUpdate);
  //     audio.removeEventListener("durationchange", handleDurationChange);
  //   };
  // }, []);

  // const formatTime = (time: number) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  // const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (audioRef.current) {
  //     const time = Number(e.target.value);
  //     audioRef.current.currentTime = time;
  //     setCurrentTime(time);
  //   }
  // };

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

  const LiveIndicator = () => (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-2 h-2 bg-red-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="text-xs font-medium text-red-500">LIVE</span>
    </div>
  );

  if (isLoading) {
    return <LiveEarningsCallSkeleton />;
  }

  if (!liveCallData?.calls?.length || !currentCall || !currentCall.audioUrl)
    return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      //   hour: "numeric",
      //   minute: "2-digit",
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
              <LiveIndicator />
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
        </div>
      </div>

      {/* Audio Controls */}
      <div className="border-t border-gray-100 dark:border-slate-800 p-4">
        <div className="space-y-4">
          {/* Progress Bar */}
          {/* <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <span className="text-sm font-medium text-red-500 dark:text-red-400 min-w-[40px]">
              LIVE
            </span>
          </div> */}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              {/* Add volume slider */}
              <input
                type="range"
                min="0"
                max="100"
                className="w-24 h-1 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.volume = Number(e.target.value) / 100;
                  }
                }}
              />
            </div>

            <button
              onClick={togglePlay}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex items-center gap-2 shadow-sm"
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
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default LiveEarningsCall;
