"use client";

import React, { useMemo } from "react";
import FutureEarnings from "./FutureEarnings";
import WelcomeMessage from "./WelcomeMessage";
import { useEarningsStore } from "@/store/EarningsStore";
import DayView from "./DayView";
import Watchlist from "./Watchlist";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EarningsEntry } from "./DayView";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const WatchlistView = React.memo(() => <Watchlist />);
WatchlistView.displayName = "WatchlistView";

const FutureEarningsView = React.memo(
  ({
    company,
  }: {
    company: {
      companyId: string;
    };
  }) => (
    <FutureEarnings
      SelectedCompany={{
        companyId: company.companyId,
      }}
    />
  )
);
FutureEarningsView.displayName = "FutureEarningsView";

const DayViewWrapper = React.memo(
  ({
    date,
    onTranscriptClick,
  }: {
    date: Date;
    onTranscriptClick: (transcript: EarningsEntry) => void;
  }) => <DayView date={date} onTranscriptClick={onTranscriptClick} />
);
DayViewWrapper.displayName = "DayViewWrapper";

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { selectedCompany, selectedDate, showWatchlist } = useEarningsStore();

  const content = useMemo(
    () => (
      <div
        className={`h-screen py-4 overflow-y-auto bg-white dark:bg-slate-900 ${className}`}
      >
        {showWatchlist ? (
          <WatchlistView />
        ) : selectedCompany?.companyId ? (
          <FutureEarningsView company={selectedCompany} />
        ) : selectedDate || isMobile ? (
          <DayViewWrapper
            date={selectedDate || new Date()}
            onTranscriptClick={(transcript: EarningsEntry) => {
              useEarningsStore.setState({
                selectedCompany: {
                  companyId: transcript.company.id,
                  transcriptId: transcript.id,
                },
                showWatchlist: false,
                selectedFutureEarnings: null,
              });
            }}
          />
        ) : (
          <WelcomeMessage />
        )}
      </div>
    ),
    [
      showWatchlist,
      selectedCompany?.companyId,
      selectedDate,
      isMobile,
      className,
    ]
  );

  const shouldShowSheet = useMemo(
    () => !!(selectedCompany || showWatchlist || (isMobile && selectedDate)),
    [selectedCompany, showWatchlist, isMobile, selectedDate]
  );

  if (isMobile) {
    return (
      <Sheet open={shouldShowSheet}>
        <SheetContent
          side="right"
          className="w-full p-0 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700"
        >
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 h-full">
      {content}
    </div>
  );
};

export default React.memo(EarningsTranscriptSheet);
