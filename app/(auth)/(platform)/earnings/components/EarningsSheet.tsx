"use client";

import React, { useState, useEffect } from "react";
import EarningsTranscript from "./EarningsTranscript";
import FutureEarnings from "./FutureEarnings";
import WelcomeMessage from "./WelcomeMessage";
import { useEarningsStore } from "@/store/EarningsStore";
import DayView from "./DayView";
import Watchlist from "./Watchlist";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useGetTranscriptData } from "@/app/hooks/use-get-transcript-data";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const {
    selectedCompany,
    // selectedFutureEarnings,
    selectedDate,
    showWatchlist,
  } = useEarningsStore();

  const { data: transcriptData, isLoading: isLoadingTranscript } =
    useGetTranscriptData(selectedCompany?.transcriptId);

  console.log(transcriptData);

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-slate-900">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-semibold">
        Loading...
      </p>
    </div>
  );

  const renderContent = () => {
    if (showWatchlist) {
      return <Watchlist />;
    }

    if (selectedCompany?.transcriptId) {
      if (isLoadingTranscript) {
        return <LoadingSpinner />;
      }
      // return transcriptData ? (
      //   <EarningsTranscript transcriptData={transcriptData} />
      // ) : null;
    }

    if (selectedCompany?.companyId) {
      return <FutureEarnings SelectedCompany={selectedCompany} />;
    }

    if (selectedDate || isMobile) {
      return (
        <DayView
          date={selectedDate || new Date()}
          onTranscriptClick={(transcript) => {
            useEarningsStore.setState({
              selectedCompany: {
                companyId: transcript.company.id,
                transcriptId: transcript.id,
              },
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

  // Replace the direct window.innerWidth check with state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < 768);

    // Add window resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowSheet = !!(
    selectedCompany ||
    // selectedFutureEarnings ||
    showWatchlist ||
    (isMobile && selectedDate)
  );

  const content = (
    <div
      className={`h-screen p-4 overflow-y-auto bg-white dark:bg-slate-900 ${className}`}
      key={`${showWatchlist}-${selectedCompany?.companyId}`}
    >
      {renderContent()}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={shouldShowSheet}>
        <SheetContent
          side="right"
          className="w-full p-0 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800"
        >
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 h-full">
      {content}
    </div>
  );
};

export default EarningsTranscriptSheet;
