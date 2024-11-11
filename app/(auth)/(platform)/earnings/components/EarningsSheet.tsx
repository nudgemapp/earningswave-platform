"use client";

import React, { useState, useEffect, useMemo } from "react";
import FutureEarnings from "./FutureEarnings";
import WelcomeMessage from "./WelcomeMessage";
import { useEarningsStore } from "@/store/EarningsStore";
import DayView from "./DayView";
import Watchlist from "./Watchlist";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { selectedCompany, selectedDate, showWatchlist } = useEarningsStore();

  const content = useMemo(
    () => (
      <div
        className={`h-screen p-4 overflow-y-auto bg-white dark:bg-slate-900 ${className}`}
        key={`${showWatchlist}-${selectedCompany?.companyId}`}
      >
        {showWatchlist ? (
          <Watchlist />
        ) : selectedCompany?.companyId ? (
          <FutureEarnings
            SelectedCompany={{
              companyId: selectedCompany.companyId,
              transcriptId: selectedCompany.transcriptId || "",
            }}
          />
        ) : selectedDate || isMobile ? (
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
            // onReportClick={(report) => {
            //   useEarningsStore.setState({
            //     selectedFutureEarnings: report,
            //     showWatchlist: false,
            //     selectedCompany: null,
            //   });
            // }}
          />
        ) : (
          <WelcomeMessage />
        )}
      </div>
    ),
    [showWatchlist, selectedCompany, selectedDate, isMobile, className]
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

export default React.memo(EarningsTranscriptSheet);
