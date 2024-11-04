"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import EarningsTranscript from "./EarningsTranscript";
import FutureEarnings from "./FutureEarnings";
import WelcomeMessage from "./WelcomeMessage";
import { useEarningsStore } from "@/store/EarningsStore";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
import { ProcessedReport } from "../types";
import DayView from "./DayView";
import Watchlist from "./Watchlist";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const {
    selectedCompany,
    selectedFutureEarnings,
    selectedDate,
    showWatchlist,
  } = useEarningsStore();

  // Convert to React Query for better caching and loading states
  const { data: transcriptData, isLoading: isLoadingTranscript } =
    useQuery<EarningsCallTranscript>({
      queryKey: ["transcript", selectedCompany?.id],
      queryFn: async () => {
        if (!selectedCompany?.id) throw new Error("No transcript selected");
        const response = await fetch(`/api/transcripts/${selectedCompany.id}`);
        if (!response.ok) throw new Error("Failed to fetch transcript");
        return response.json();
      },
      enabled: !!selectedCompany?.id,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
    </div>
  );

  const renderContent = () => {
    // Priority-based rendering
    if (showWatchlist) {
      return <Watchlist />;
    }

    if (selectedCompany?.id) {
      if (isLoadingTranscript) {
        return <LoadingSpinner />;
      }
      return transcriptData ? (
        <EarningsTranscript transcriptData={transcriptData} />
      ) : null;
    }

    if (selectedFutureEarnings) {
      return (
        <FutureEarnings report={selectedFutureEarnings as ProcessedReport} />
      );
    }

    if (selectedDate || window.innerWidth < 768) {
      return (
        <DayView
          date={selectedDate || new Date()}
          onTranscriptClick={(transcript) => {
            useEarningsStore.setState({
              selectedCompany: transcript,
              showWatchlist: false,
              selectedFutureEarnings: null,
            });
          }}
          onReportClick={(report) => {
            useEarningsStore.setState({
              selectedFutureEarnings: report,
              showWatchlist: false,
              selectedCompany: null,
            });
          }}
        />
      );
    }

    return <WelcomeMessage />;
  };

  // Add state to control sheet visibility on mobile
  const isMobile = window.innerWidth < 768;
  const shouldShowSheet = !!(
    selectedCompany ||
    selectedFutureEarnings ||
    showWatchlist ||
    (isMobile && selectedDate)
  );

  const content = (
    <div
      className={`h-screen p-4 overflow-y-auto bg-gray-100/80 ${className}`}
      key={`${showWatchlist}-${selectedCompany?.id}-${selectedFutureEarnings?.id}`}
    >
      {renderContent()}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={shouldShowSheet}>
        <SheetContent side="right" className="w-full p-0">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return content;
};

export default EarningsTranscriptSheet;
